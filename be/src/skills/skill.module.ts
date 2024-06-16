import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Resume } from 'src/resume/resume.model';
import { SkillController } from './skill.controller';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';
import { ResumeSkill } from './resume-skill.model';
import { FilesModule } from 'src/files/files.module';
import { VacancySkill } from './vacancy-skill.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [SkillService],
  controllers: [SkillController],
  imports: [
    SequelizeModule.forFeature([
      Resume,
      Vacancy,
      Skill,
      ResumeSkill,
      VacancySkill,
    ]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class SkillModule {}
