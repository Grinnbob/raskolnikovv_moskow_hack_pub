import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { ResumeLikes } from 'src/resume/resume-likes.model';
import { ResumeResponds } from 'src/resume/resume-responds.model';
import { ResumeViews } from 'src/resume/resume-views.model';
import { Resume } from 'src/resume/resume.model';
import { Role } from 'src/roles/roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { VacancyLikes } from 'src/vacancy/vacancy-likes.model';
import { VacancyResponds } from 'src/vacancy/vacancy-responds.model';
import { VacancyViews } from 'src/vacancy/vacancy-views.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { UsersController } from './users.controller';
import { User } from './users.model';
import { UsersService } from './users.service';
import { Contact } from 'src/contacts/contacts.model';
import { CompanyRatings } from 'src/company/company-rating.model';
import { CompanyOwners } from 'src/company/company-owners.model';
import { PinoLoggerModule } from 'src/logger/logger.module';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { Charge } from 'src/charges/charges.model';
import { VacancyComplaints } from 'src/vacancy/vacancy-complaints.model';
import { VacancyComments } from 'src/vacancy/vacancy-comments.model';
import { ResumeComplaints } from 'src/resume/resume-complaints.model';
import { ResumeComments } from 'src/resume/resume-comments.model';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { PricesService } from 'src/prices/prices.service';
import { LimitsService } from 'src/limits/limits.service';
import { ChargesService } from 'src/charges/charges.service';
import { Price } from 'src/prices/prices.model';
import { ResumeLimit } from 'src/limits/resumeLimits.model';
import { VacancyLimit } from 'src/limits/vacancyLimits.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';
import { ResumeCommentLikes } from 'src/resume/resume-comment-likes.model';
import { VacancyCommentLikes } from 'src/vacancy/vacancy-comment-likes.model';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    FinanceAccountsService,
    PricesService,
    LimitsService,
    ChargesService,
  ],
  imports: [
    SequelizeModule.forFeature([
      User,
      Role,
      Vacancy,
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
      CompanyRatings,
      CompanyOwners,
      FinanceAccount,
      Charge,
      Price,
      ResumeLimit,
      VacancyLimit,
      ResumeViewLimit,
    ]),
    RolesModule,
    forwardRef(() => AuthModule),
    PinoLoggerModule,
  ],
  exports: [UsersService],
})
export class UsersModule {}
