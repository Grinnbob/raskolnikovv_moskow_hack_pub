import { EducationType } from '../enums/education';
import {
  Currency,
  DisadvantagedGroup,
  DriveLicense,
  QualificationLevel,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
  JobType,
  WorkLocationType,
} from '../enums/resume-vacancy';
import { CategoryModel } from './category.model';
import { CitizenshipModel } from './citizenship.model';
import { CityModel } from './city.model';
import { VacancyCommentModel } from './comment.model';
import { CompanyModel } from './company.model';
import { ContactsModel } from './contacts.model';
import { LanguageModel } from './language.model';
import { ResumeVacancyRating, VacancyVacancyRating } from './rating.model';
import { SkillModel } from './skills.model';
import { UserModel } from './user.model';

export interface VacancyModel {
  id: number;
  title: string;
  userId?: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  conditions?: string;
  imageName?: string;
  locationMapLink?: string;
  qualificationLevel?: QualificationLevel;
  responseRate?: number;
  temporaryTermMonths?: number;
  referralFee?: string;
  jobType?: JobType;
  workLocationType?: WorkLocationType;

  isActive?: boolean;
  isMain?: boolean;
  isModerated?: boolean;
  isBanned?: boolean;
  banReason?: string;

  cityId?: number;
  city?: CityModel;
  companyId?: number;
  company?: CompanyModel;
  contactId?: number;
  contact?: ContactsModel;
  categoryId?: number;
  category?: CategoryModel;
  benefits?: BenefitModel[];
  languages?: LanguageModel[];
  citizenships?: CitizenshipModel[];
  skills?: SkillModel[];

  salaryCurrency: Currency;
  salaryMin?: number;
  salaryMax?: number;

  workExperienceYearsMin?: number;
  workExperienceYearsMax?: number;

  teamLeadTemper?: TeamLeadTemper;
  teamMethodology?: TeamMethodology;
  teamSize?: TeamSize;

  driveLicenses?: DriveLicense[];
  disadvantagedGroups?: DisadvantagedGroup[];
  educationTypes?: EducationType[];

  isPartTime?: boolean;
  isAllowedWithDisability?: boolean;
  isDeferredMobilization?: boolean;
  isInternship?: boolean;
  isVolonteering?: boolean;
  isReadyForBusinessTrip?: boolean;
  isSelfEmployed?: boolean;
  isReferral?: boolean;

  isFlexibleSchedule?: boolean;
  isShiftWork?: boolean;
  isRatationalWork?: boolean;

  isForStudents?: boolean;
  isForPensioners?: boolean;
  isForYoung?: boolean;

  likes?: UserModel[];
  views?: UserModel[];
  responds?: UserModel[];
  complaints?: UserModel[];
  comments?: VacancyCommentModel[];

  isLiked?: boolean;
  isViewed?: boolean;
  isResponded?: boolean;
  isShared?: boolean;
  isCommented?: boolean;

  likesCount?: number;
  viewsCount?: number;
  respondsCount?: number;
  sharesCount?: number;
  commentsCount?: number;

  rating?: VacancyVacancyRating | ResumeVacancyRating;

  expirationDate: Date;

  updatedAt?: string;
  createdAt?: string;
}

export interface BenefitModel {
  id: number;
  title: string;
  description?: string;
  imageName?: string;
}
