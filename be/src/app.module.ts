import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import * as path from 'path';
import * as dbConfig from './database/config.json';
import { User } from './users/users.model';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { SkillModule } from './skills/skill.module';
import { Skill } from './skills/skill.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WorkExperienceModule } from './workExperience/workExperience.module';
import { EducationModule } from './education/education.module';
import { Education } from './education/education.model';
import { WorkExperience } from './workExperience/workExperience.model';
import { Company } from './company/company.model';
import { CompanyModule } from './company/company.module';
import { EducationOrganization } from './educationOrganization/educationOrganization.model';
import { EducationOrganizationModule } from './educationOrganization/educationOrganization.module';
import { Vacancy } from './vacancy/vacancy.model';
import { Benefit } from './benefits/benefits.model';
import { VacancyBenefit } from './benefits/vacancy-benefits.model';
import { VacancyModule } from './vacancy/vacancy.module';
import { BenefitsModule } from './benefits/benefits.module';
import { VacancyLikes } from './vacancy/vacancy-likes.model';
import { ResumeModule } from './resume/resume.module';
import { Resume } from './resume/resume.model';
import { VacancyViews } from './vacancy/vacancy-views.model';
import { VacancyResponds } from './vacancy/vacancy-responds.model';
import { ResumeLikes } from './resume/resume-likes.model';
import { ResumeViews } from './resume/resume-views.model';
import { ResumeResponds } from './resume/resume-responds.model';
import { Contact } from './contacts/contacts.model';
import { ContactsModule } from './contacts/contacts.module';
import { Category } from './category/category.model';
import { CategoryModule } from './category/category.module';
import { Industry } from './industry/industry.model';
import { IndustryModule } from './industry/industry.module';
import { IndustryResume } from './industry/industry-resume.model';
import { IndustryCompany } from './industry/industry-company.model';
import { CityModule } from './city/city.module';
import { City } from './city/city.model';
import { ResumeSkill } from './skills/resume-skill.model';
import { LanguageModule } from './language/language.module';
import { Language } from './language/language.model';
import { LanguageResume } from './language/language-resume.model';
import { LanguageVacancy } from './language/language-vacancy.model';
import { ThrottlerModule } from '@nestjs/throttler';
import { FilesModule } from './files/files.module';
import { VacancySkill } from './skills/vacancy-skill.model';
import { CompanyRatings } from './company/company-rating.model';
import { Citizenship } from './citizenship/citizenship.model';
import { CitizenshipResume } from './citizenship/citizenship-resume.model';
import { CitizenshipVacancy } from './citizenship/citizenship-vacancy.model';
import { CitizenshipModule } from './citizenship/citizenship.module';
import { CompanyOwners } from './company/company-owners.model';
import { PinoLoggerModule } from './logger/logger.module';
import { FinanceAccount } from './financeAccounts/financeAccounts.model';
import { FinanceAccountsModule } from './financeAccounts/financeAccounts.module';
import { Charge } from './charges/charges.model';
import { ChargesModule } from './charges/charges.module';
import { Price } from './prices/prices.model';
import { PricesModule } from './prices/prices.module';
import { VacancyComplaints } from './vacancy/vacancy-complaints.model';
import { VacancyComments } from './vacancy/vacancy-comments.model';
import { ResumeComplaints } from './resume/resume-complaints.model';
import { ResumeComments } from './resume/resume-comments.model';
import { ResumeLimit } from './limits/resumeLimits.model';
import { LimitsModule } from './limits/limits.module';
import { VacancyLimit } from './limits/vacancyLimits.model';
import { ResumeViewLimit } from './limits/resumeViewLimits.model';
import { ResumeCommentLikes } from './resume/resume-comment-likes.model';
import { VacancyCommentLikes } from './vacancy/vacancy-comment-likes.model';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000, 
        limit: 100, 
      },
    ]), 
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }), 
    SequelizeModule.forRoot({
      dialect: dbConfig[process.env.NODE_ENV].dialect,
      host: dbConfig[process.env.NODE_ENV].host,
      port: dbConfig[process.env.NODE_ENV].port,
      username: dbConfig[process.env.NODE_ENV].username,
      password: dbConfig[process.env.NODE_ENV].password,
      database: dbConfig[process.env.NODE_ENV].database,
      logQueryParameters: process.env.NODE_ENV === 'dev',
      models: [
        User,
        Role,
        Skill,
        ResumeSkill,
        VacancySkill,
        Education,
        WorkExperience,
        Company,
        CompanyRatings,
        CompanyOwners,
        EducationOrganization,
        Vacancy,
        Benefit,
        VacancyBenefit,
        VacancyLikes,
        VacancyViews,
        VacancyResponds,
        VacancyComplaints,
        VacancyComments,
        VacancyCommentLikes,
        Resume,
        ResumeLikes,
        ResumeViews,
        ResumeResponds,
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
      ],
      autoLoadModels: true,
      synchronize: true,
      

      
      
      
      
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    SkillModule,
    EducationModule,
    WorkExperienceModule,
    CompanyModule,
    EducationOrganizationModule,
    VacancyModule,
    BenefitsModule,
    ResumeModule,
    ContactsModule,
    CategoryModule,
    IndustryModule,
    CityModule,
    LanguageModule,
    CitizenshipModule,
    FilesModule,
    PinoLoggerModule,
    FinanceAccountsModule,
    ChargesModule,
    PricesModule,
    LimitsModule,
  ],
})
export class AppModule {}
