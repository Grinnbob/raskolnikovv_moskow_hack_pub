import { Inject, Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { PinoLogger, Params, PARAMS_PROVIDER_TOKEN } from 'nestjs-pino';
import { Sequelize } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize';

@Injectable()
export class PinoLoggerService extends PinoLogger {
  constructor(
    @Inject(PARAMS_PROVIDER_TOKEN) params: Params,
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
    private readonly pinoLogger: PinoLogger,
    private readonly sequelize: Sequelize,
  ) {
    super(params);
    this.sequelize.options.logging = (sql) => {
      this.pinoLogger.assign({ req: {} });
      this.info(sql, 'SQL');
    };
  }

  private getMessage(message: any, context?: string) {
    return context ? `[ ${context} ] ${message}` : message;
  }

  error(message: any, trace?: string, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pinoLogger.error(
      { traceId, trace },
      this.getMessage(message, context),
    );
  }

  log(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pinoLogger.info({ traceId }, this.getMessage(message, context));
  }

  info(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pinoLogger.info({ traceId }, this.getMessage(message, context));
  }

  warn(message: any, context?: string): any {
    const traceId = this.asyncStorage.getStore()?.get('traceId');
    this.pinoLogger.warn({ traceId }, this.getMessage(message, context));
  }
}
