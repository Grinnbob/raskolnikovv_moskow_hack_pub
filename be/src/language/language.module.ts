import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { Resume } from 'src/resume/resume.model';
import { LanguageController } from './language.controller';
import { Language } from './language.model';
import { LanguageService } from './language.service';
import { LanguageResume } from './language-resume.model';
import { LanguageVacancy } from './language-vacancy.model';
import { FilesModule } from 'src/files/files.module';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [LanguageService],
  controllers: [LanguageController],
  imports: [
    SequelizeModule.forFeature([
      Language,
      Vacancy,
      Resume,
      LanguageResume,
      LanguageVacancy,
    ]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class LanguageModule {}
