import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Contact } from 'src/contacts/contacts.model';
import { Education } from 'src/education/education.model';
import { Skill } from 'src/skills/skill.model';
import { User } from 'src/users/users.model';
import { WorkExperience } from 'src/workExperience/workExperience.model';
import { ResumeLikes } from './resume-likes.model';
import { ResumeResponds } from './resume-responds.model';
import { ResumeViews } from './resume-views.model';
import { ResumeController } from './resume.controller';
import { Resume } from './resume.model';
import { ResumeService } from './resume.service';
import { Category } from 'src/category/category.model';
import { Industry } from 'src/industry/industry.model';
import { IndustryResume } from 'src/industry/industry-resume.model';
import { City } from 'src/city/city.model';
import { CategoryService } from 'src/category/category.service';
import { ResumeSkill } from 'src/skills/resume-skill.model';
import { SkillService } from 'src/skills/skill.service';
import { Language } from 'src/language/language.model';
import { LanguageService } from 'src/language/language.service';
import { LanguageResume } from 'src/language/language-resume.model';
import { FilesModule } from 'src/files/files.module';
import { IndustryService } from 'src/industry/industry.service';
import { IndustryCompany } from 'src/industry/industry-company.model';
import { LanguageVacancy } from 'src/language/language-vacancy.model';
import { Citizenship } from 'src/citizenship/citizenship.model';
import { CitizenshipResume } from 'src/citizenship/citizenship-resume.model';
import { CitizenshipVacancy } from 'src/citizenship/citizenship-vacancy.model';
import { CitizenshipService } from 'src/citizenship/citizenship.service';
import { VacancySkill } from 'src/skills/vacancy-skill.model';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { PinoLoggerModule } from 'src/logger/logger.module';
import { ResumeComplaints } from './resume-complaints.model';
import { ResumeComments } from './resume-comments.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';
import { PricesService } from 'src/prices/prices.service';
import { Charge } from 'src/charges/charges.model';
import { ChargesService } from 'src/charges/charges.service';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { LimitsService } from 'src/limits/limits.service';
import { ResumeLimit } from 'src/limits/resumeLimits.model';
import { VacancyLimit } from 'src/limits/vacancyLimits.model';
import { Price } from 'src/prices/prices.model';
import { ResumeCommentLikes } from './resume-comment-likes.model';

@Module({
  providers: [
    ResumeService,
    CategoryService,
    SkillService,
    LanguageService,
    IndustryService,
    CitizenshipService,
    UsersService,
    RolesService,
    FinanceAccountsService,
    PricesService,
    LimitsService,
    ChargesService,
  ],
  controllers: [ResumeController],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([
      Resume,
      User,
      Role,
      Education,
      WorkExperience,
      Skill,
      ResumeSkill,
      VacancySkill,
      ResumeLikes,
      ResumeResponds,
      ResumeViews,
      ResumeComplaints,
      ResumeComments,
      ResumeCommentLikes,
      Contact,
      Category,
      Industry,
      IndustryResume,
      IndustryCompany,
      City,
      Language,
      LanguageResume,
      LanguageVacancy,
      Citizenship,
      CitizenshipResume,
      CitizenshipVacancy,
      FinanceAccount,
      Charge,
      Price,
      ResumeLimit,
      VacancyLimit,
      ResumeViewLimit,
    ]),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class ResumeModule {}
