import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Benefit } from 'src/benefits/benefits.model';
import { BenefitsService } from 'src/benefits/benefits.service';
import { VacancyBenefit } from 'src/benefits/vacancy-benefits.model';
import { Company } from 'src/company/company.model';
import { CompanyService } from 'src/company/company.service';
import { Contact } from 'src/contacts/contacts.model';
import { User } from 'src/users/users.model';
import { VacancyLikes } from './vacancy-likes.model';
import { VacancyResponds } from './vacancy-responds.model';
import { VacancyViews } from './vacancy-views.model';
import { VacancyController } from './vacancy.controller';
import { Vacancy } from './vacancy.model';
import { VacancyService } from './vacancy.service';
import { Category } from 'src/category/category.model';
import { Industry } from 'src/industry/industry.model';
import { City } from 'src/city/city.model';
import { CategoryService } from 'src/category/category.service';
import { Language } from 'src/language/language.model';
import { LanguageService } from 'src/language/language.service';
import { LanguageVacancy } from 'src/language/language-vacancy.model';
import { FilesModule } from 'src/files/files.module';
import { IndustryService } from 'src/industry/industry.service';
import { IndustryResume } from 'src/industry/industry-resume.model';
import { IndustryCompany } from 'src/industry/industry-company.model';
import { Skill } from 'src/skills/skill.model';
import { VacancySkill } from 'src/skills/vacancy-skill.model';
import { CompanyRatings } from 'src/company/company-rating.model';
import { LanguageResume } from 'src/language/language-resume.model';
import { Citizenship } from 'src/citizenship/citizenship.model';
import { CitizenshipVacancy } from 'src/citizenship/citizenship-vacancy.model';
import { CitizenshipResume } from 'src/citizenship/citizenship-resume.model';
import { CitizenshipService } from 'src/citizenship/citizenship.service';
import { ResumeSkill } from 'src/skills/resume-skill.model';
import { SkillService } from 'src/skills/skill.service';
import { UsersService } from 'src/users/users.service';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { CompanyOwners } from 'src/company/company-owners.model';
import { PinoLoggerModule } from 'src/logger/logger.module';
import { PinoLoggerService } from 'src/logger/logger.service';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { VacancyComplaints } from './vacancy-complaints.model';
import { VacancyComments } from './vacancy-comments.model';
import { ChargesService } from 'src/charges/charges.service';
import { LimitsService } from 'src/limits/limits.service';
import { PricesService } from 'src/prices/prices.service';
import { Charge } from 'src/charges/charges.model';
import { ResumeLimit } from 'src/limits/resumeLimits.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';
import { VacancyLimit } from 'src/limits/vacancyLimits.model';
import { Price } from 'src/prices/prices.model';
import { VacancyCommentLikes } from './vacancy-comment-likes.model';

@Module({
  providers: [
    VacancyService,
    BenefitsService,
    CategoryService,
    CompanyService,
    LanguageService,
    IndustryService,
    CitizenshipService,
    SkillService,
    UsersService,
    RolesService,
    PinoLoggerService,
    FinanceAccountsService,
    PricesService,
    LimitsService,
    ChargesService,
  ],
  controllers: [VacancyController],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([
      Vacancy,
      Benefit,
      VacancyBenefit,
      Company,
      CompanyRatings,
      CompanyOwners,
      User,
      Role,
      VacancyLikes,
      VacancyViews,
      VacancyResponds,
      VacancyComplaints,
      VacancyComments,
      VacancyCommentLikes,
      Contact,
      Category,
      City,
      Language,
      LanguageVacancy,
      LanguageResume,
      Industry,
      IndustryResume,
      IndustryCompany,
      Skill,
      VacancySkill,
      ResumeSkill,
      Citizenship,
      CitizenshipVacancy,
      CitizenshipResume,
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
export class VacancyModule {}
