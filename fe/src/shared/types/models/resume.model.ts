import {
  Currency,
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
import { ResumeCommentModel } from './comment.model';
import { ContactsModel } from './contacts.model';
import { EducationModel } from './education.model';
import { IndustryModel } from './industry.model';
import { LanguageModel } from './language.model';
import { ResumeResumeRating, ResumeVacancyRating } from './rating.model';
import { SkillModel } from './skills.model';
import { UserModel } from './user.model';
import { WorkExperienceModel } from './workExperience.model';

export interface ResumeModel {
  id: number;
  title: string;
  userId?: number;
  description?: string;
  isActive: boolean;
  imageName?: string;
  qualificationLevel?: QualificationLevel;
  jobType?: JobType;
  workLocationType?: WorkLocationType;

  cityId?: number;
  city?: CityModel;
  contact?: ContactsModel;
  contactId?: number;
  category?: CategoryModel;
  categoryId?: number;
  industries?: IndustryModel[];
  languages?: LanguageModel[];
  citizenships?: CitizenshipModel[];
  skills?: SkillModel[];

  salaryCurrency: Currency;
  salaryMin?: number;
  salaryMax?: number;

  teamLeadTemper?: TeamLeadTemper;
  teamMethodology?: TeamMethodology;
  teamSize?: TeamSize;
  driveLicenses?: DriveLicense[];

  isPartTime?: boolean;
  isAllowedWithDisability?: boolean;
  isFlexibleSchedule?: boolean;
  isShiftWork?: boolean;
  isRatationalWork?: boolean;
  isDeferredMobilization?: boolean;
  isInternship?: boolean;
  isVolonteering?: boolean;
  isReadyForBusinessTrip?: boolean;

  likes?: UserModel[];
  views?: UserModel[];
  responds?: UserModel[];
  complaints?: UserModel[];
  comments?: ResumeCommentModel[];

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

  education?: EducationModel[];
  workExperience?: WorkExperienceModel[];
  educationYears?: string;
  workExperienceYears?: string;

  rating?: ResumeResumeRating | ResumeVacancyRating;

  updatedAt?: string;
  createdAt?: string;
}
