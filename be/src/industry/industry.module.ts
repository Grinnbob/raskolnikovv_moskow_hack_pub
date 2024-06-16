import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Resume } from 'src/resume/resume.model';
import { IndustryController } from './industry.controller';
import { Industry } from './industry.model';
import { IndustryService } from './industry.service';
import { IndustryResume } from './industry-resume.model';
import { FilesModule } from 'src/files/files.module';
import { IndustryCompany } from './industry-company.model';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [IndustryService],
  controllers: [IndustryController],
  imports: [
    SequelizeModule.forFeature([
      Industry,
      Resume,
      IndustryResume,
      IndustryCompany,
    ]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class IndustryModule {}
