import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { WorkExperience } from 'src/workExperience/workExperience.model';
import { CompanyController } from './company.controller';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { FilesModule } from 'src/files/files.module';
import { Industry } from 'src/industry/industry.model';
import { IndustryService } from 'src/industry/industry.service';
import { IndustryCompany } from 'src/industry/industry-company.model';
import { IndustryResume } from 'src/industry/industry-resume.model';
import { CompanyRatings } from './company-rating.model';
import { CompanyOwners } from './company-owners.model';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';
import { RolesService } from 'src/roles/roles.service';
import { Role } from 'src/roles/roles.model';
import { PinoLoggerModule } from 'src/logger/logger.module';
import { ChargesService } from 'src/charges/charges.service';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { LimitsService } from 'src/limits/limits.service';
import { PricesService } from 'src/prices/prices.service';
import { Charge } from 'src/charges/charges.model';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { ResumeLimit } from 'src/limits/resumeLimits.model';
import { VacancyLimit } from 'src/limits/vacancyLimits.model';
import { Price } from 'src/prices/prices.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';

@Module({
  providers: [
    CompanyService,
    IndustryService,
    UsersService,
    RolesService,
    FinanceAccountsService,
    PricesService,
    LimitsService,
    ChargesService,
  ],
  controllers: [CompanyController],
  imports: [
    SequelizeModule.forFeature([
      Company,
      CompanyRatings,
      CompanyOwners,
      Vacancy,
      WorkExperience,
      Industry,
      IndustryResume,
      IndustryCompany,
      User,
      Role,
      FinanceAccount,
      Charge,
      Price,
      ResumeLimit,
      VacancyLimit,
      ResumeViewLimit,
    ]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
})
export class CompanyModule {}
