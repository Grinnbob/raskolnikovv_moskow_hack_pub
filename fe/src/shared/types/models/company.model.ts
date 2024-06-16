import { Currency } from '../enums/resume-vacancy';
import { IndustryModel } from './industry.model';
import { UserModel } from './user.model';
import { BenefitModel, VacancyModel } from './vacancy.model';
import { WorkExperienceModel } from './workExperience.model';

export interface CompanyModel {
  id?: number;
  name: string;
  website?: string;
  description?: string;
  status?: string;
  companySize?: CompanySize;
  imageName?: string;
  isStartup?: boolean;
  isVerified?: boolean;
  address?: string;
  INN?: string;
  KPP?: string;
  OGRN?: string;

  ratings?: UserModel[];
  owners?: UserModel[];
  workExperiences?: WorkExperienceModel[];
  vacancies?: VacancyModel[];
  industries?: IndustryModel[];

  recommended?: string;
  rating?: number;
  workConditionsRating?: number;
  teamRating?: number;
  managementRating?: number;
  professionalGrowConditionsRating?: number;
  restConditionsRating?: number;
  salaryRating?: number;

  emplyeesCount?: string;
  vacanciesCount?: string;

  updatedAt?: Date;
  createdAt?: Date;
}

export type CompanyRatingsModel = {
  id: number;
  userId: number;
  companyId: number;
  isRecommended?: boolean;

  rating?: number;
  workConditionsRating?: number;
  teamRating?: number;
  managementRating?: number;
  professionalGrowConditionsRating?: number;
  restConditionsRating?: number;
  salaryRating?: number;

  recallGood?: string | null;
  recallBad?: string | null;

  salary?: number | null;
  salaryCurrency?: Currency | null;

  benefits?: BenefitModel[];

  updatedAt?: Date;
  createdAt?: Date;
};

export enum CompanySize {
  SMALL = 'SMALL', // 1-10
  AVERAGE = 'AVERAGE', // 10-100
  BIG = 'BIG', // 100-1000
  VERY_BIG = 'VERY_BIG', // >1000
}
