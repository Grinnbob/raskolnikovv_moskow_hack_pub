import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { EducationOrganization } from 'src/educationOrganization/educationOrganization.model';
import { EducationOrganizationService } from 'src/educationOrganization/educationOrganization.service';
import { Resume } from 'src/resume/resume.model';
import { EducationController } from './education.controller';
import { Education } from './education.model';
import { EducationService } from './education.service';
import { FilesModule } from 'src/files/files.module';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [EducationService, EducationOrganizationService],
  controllers: [EducationController],
  imports: [
    SequelizeModule.forFeature([Resume, Education, EducationOrganization]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class EducationModule {}
