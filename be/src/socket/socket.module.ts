import { Module, forwardRef } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from 'src/messages/message.model';
import { LoggerModule } from 'src/logger/logger.module';
import { MessageService } from 'src/messages/message.service';
import { UsersService } from 'src/users/users.service';
import { Room } from 'src/messages/room.model';
import { User } from 'src/users/users.model';
import { UserRoom } from 'src/messages/user-room.model';
import { RolesService } from 'src/roles/roles.service';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { ContactsService } from 'src/contacts/contacts.service';
import { Role } from 'src/roles/roles.model';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { PricesService } from 'src/prices/prices.service';
import { LimitsService } from 'src/limits/limits.service';
import { ChargesService } from 'src/charges/charges.service';
import { Contact } from 'src/contacts/contacts.model';
import { Price } from 'src/prices/prices.model';
import { ResumeLimit } from 'src/limits/resumeLimits.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';
import { VacancyLimit } from 'src/limits/vacancyLimits.model';
import { Charge } from 'src/charges/charges.model';
import { FilesService } from 'src/files/files.service';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { VacancyModule } from 'src/vacancy/vacancy.module';
import { SocketGateway } from './socket.gateway';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Notification } from 'src/notifications/notifications.model';

@Module({
  providers: [
    SocketService,
    SocketGateway,
    MessageService,
    UsersService,
    RolesService,
    FinanceAccountsService,
    ContactsService,
    PricesService,
    LimitsService,
    ChargesService,
    FilesService,
    NotificationsService,
  ],
  
  imports: [
    VacancyModule,
    SequelizeModule.forFeature([
      Message,
      Room,
      User,
      UserRoom,
      Role,
      FinanceAccount,
      Contact,
      Price,
      ResumeLimit,
      ResumeViewLimit,
      VacancyLimit,
      Charge,
      Vacancy,
      Notification,
    ]),
    forwardRef(() => AuthModule),
    LoggerModule,
  ],
  exports: [SocketService],
})
export class SocketModule {}
