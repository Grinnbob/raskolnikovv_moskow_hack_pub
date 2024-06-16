import { UserGender, UserStatus } from '../enums/users';
import { ResumeModel } from './resume.model';
import { VacancyModel } from './vacancy.model';
import { UserRole } from './role.model';
import { ContactsModel } from './contacts.model';
import { CompanyRatingsModel } from './company.model';

export interface UserModel {
  id?: number;
  email?: string;
  roleId?: number;
  role?: UserRole;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  gender?: UserGender;
  birthDate?: Date;
  emailValidated?: boolean;
  emailValidationCode?: string;
  emailValidationCodeSentAt?: Date;
  status?: UserStatus;

  isBanned: boolean;
  banReason?: string;
  banDate?: Date;

  contactId?: number;
  contact?: ContactsModel;

  resume?: ResumeModel[];
  vacancy?: VacancyModel[];

  vacanciesLiked?: VacancyModel[];
  vacanciesViewed?: VacancyModel[];
  vacanciesResponded?: VacancyModel[];
  vacanciesComplainted?: VacancyModel[];
  vacanciesCommented?: VacancyModel[];

  resumeLiked?: ResumeModel[];
  resumeViewed?: ResumeModel[];
  resumeResponded?: ResumeModel[];
  resumeComplainted?: ResumeModel[];
  resumeCommented?: ResumeModel[];

  CompanyRatings?: CompanyRatingsModel;
}

export interface UserReactionWithDocument {
  user: UserModel;
  document: VacancyModel | ResumeModel;
  updatedAt: Date;
}
