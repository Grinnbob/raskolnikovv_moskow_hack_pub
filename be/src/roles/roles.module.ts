import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role } from './roles.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { AuthModule } from 'src/auth/auth.module';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    SequelizeModule.forFeature([Role, User]),
    forwardRef(() => AuthModule),
    PinoLoggerModule,
  ],
  exports: [RolesService],
})
export class RolesModule {}
