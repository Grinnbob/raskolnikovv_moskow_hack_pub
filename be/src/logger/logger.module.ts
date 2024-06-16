import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { PinoLoggerService } from './logger.service';
import { LoggerModule } from 'nestjs-pino';
import pino from 'pino';

const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

@Module({
  providers: [
    PinoLoggerService,
    {
      provide: AsyncLocalStorage,
      useValue: asyncLocalStorage,
    },
  ],
  exports: [PinoLoggerService, AsyncLocalStorage],
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'debug',
        
        logger: pino({
          mixin: () => ({
            traceId: asyncLocalStorage?.getStore()?.get('traceId'),
          }),
        }),
        serializers: {
          req(req) {
            req.headers = undefined;
            req.remotePort = undefined;
            req.remoteAddress = undefined;
            return req;
          },
          res(res) {
            res.headers = undefined;
            return res;
          },
        },
      },
    }),
  ],
})
export class PinoLoggerModule {}
