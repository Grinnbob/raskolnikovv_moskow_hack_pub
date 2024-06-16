import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Education } from 'src/education/education.model';
import { EducationOrganizationController } from './educationOrganization.controller';
import { EducationOrganization } from './educationOrganization.model';
import { EducationOrganizationService } from './educationOrganization.service';
import { FilesModule } from 'src/files/files.module';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [EducationOrganizationService],
  controllers: [EducationOrganizationController],
  imports: [
    SequelizeModule.forFeature([Education, EducationOrganization]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class EducationOrganizationModule {}
