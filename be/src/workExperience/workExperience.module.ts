import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Company } from 'src/company/company.model';
import { CompanyService } from 'src/company/company.service';
import { Resume } from 'src/resume/resume.model';
import { WorkExperienceController } from './workExperience.controller';
import { WorkExperience } from './workExperience.model';
import { WorkExperienceService } from './workExperience.service';
import { FilesService } from 'src/files/files.service';
import { IndustryService } from 'src/industry/industry.service';
import { Industry } from 'src/industry/industry.model';
import { IndustryResume } from 'src/industry/industry-resume.model';
import { IndustryCompany } from 'src/industry/industry-company.model';
import { CompanyRatings } from 'src/company/company-rating.model';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { CompanyOwners } from 'src/company/company-owners.model';
import { PinoLoggerModule } from 'src/logger/logger.module';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { PricesService } from 'src/prices/prices.service';
import { LimitsService } from 'src/limits/limits.service';
import { ChargesService } from 'src/charges/charges.service';
import { Price } from 'src/prices/prices.model';
import { ResumeLimit } from 'src/limits/resumeLimits.model';
import { VacancyLimit } from 'src/limits/vacancyLimits.model';
import { Charge } from 'src/charges/charges.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';

@Module({
  providers: [
    WorkExperienceService,
    CompanyService,
    FilesService,
    IndustryService,
    UsersService,
    RolesService,
    FinanceAccountsService,
    PricesService,
    LimitsService,
    ChargesService,
  ],
  controllers: [WorkExperienceController],
  imports: [
    SequelizeModule.forFeature([
      Resume,
      WorkExperience,
      Company,
      CompanyRatings,
      CompanyOwners,
      Industry,
      IndustryResume,
      IndustryCompany,
      User,
      Role,
      FinanceAccount,
      Price,
      ResumeLimit,
      VacancyLimit,
      ResumeViewLimit,
      Charge,
    ]),
    forwardRef(() => AuthModule),
    PinoLoggerModule,
  ],
})
export class WorkExperienceModule {}
