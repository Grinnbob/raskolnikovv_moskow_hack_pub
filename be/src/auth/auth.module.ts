import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PinoLoggerService } from 'src/logger/logger.service';
import { AsyncLocalStorage } from 'async_hooks';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PinoLoggerService, AsyncLocalStorage],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: { expiresIn: '2d' },
    }),
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
