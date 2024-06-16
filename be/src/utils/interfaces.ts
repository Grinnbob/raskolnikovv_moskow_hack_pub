import { Resume } from 'src/resume/resume.model';
import { User } from 'src/users/users.model';
import { Vacancy } from 'src/vacancy/vacancy.model';

export interface Info {
  prevPage: number;
  nextPage: number;
  pagesTotal: number;
}

export interface PaginatedResponse<T> {
  info: Info;
  results: T[];
}

export interface UserReactionWithDocument {
  user: User;
  document: Vacancy | Resume;
  updatedAt: Date;
}

export interface ValidationResponse {
  success: boolean;
  error?: string;
  errorCode?: 1 | 2 | 3; 
}


export interface UserReactionsCounts {
  likes: number;
  responds: number;
  views?: number;
}

export enum Currency {
  RUB = 'RUB',
  USD = 'USD',
  EUR = 'EUR',
  CNY = 'CNY',
  KZT = 'KZT',
  BYN = 'BYN',
  BTC = 'BTC',
  JPY = 'JPY', 
  OTHER = 'OTHER',
}

export enum CompanySize {
  SMALL = 'SMALL', 
  AVERAGE = 'AVERAGE', 
  BIG = 'BIG', 
  VERY_BIG = 'VERY_BIG', 
}

export enum TeamSize {
  SMALL = 'SMALL', 
  AVERAGE = 'AVERAGE', 
  BIG = 'BIG', 
  VERY_BIG = 'VERY_BIG', 
}

export enum TeamLeadTemper { 
  DICTATOR = 'DICTATOR',
  DEMOCRAT = 'DEMOCRAT',
  PESSIMIST = 'PESSIMIST',
  MANIPULATOR = 'MANIPULATOR',
  ORGANIZER = 'ORGANIZER',
  OTHER = 'OTHER',
}

export enum TeamMethodology {
  WATERFALL = 'WATERFALL',
  AGILE = 'AGILE',
  SCRUM = 'SCRUM',
  KANBAN = 'KANBAN',
  WEEK = 'WEEK',
  DAY = 'DAY',
  TWO_WEEKS = 'TWO_WEEKS',
  MONTH = 'MONTH',
  OTHER = 'OTHER',
}

export enum DriveLicense {
  A = 'A', 
  B = 'B', 
  C = 'C', 
  D = 'D', 
  E = 'E', 
}

export enum DisadvantagedGroup {
  REFUGEES = 'REFUGEES', 
  PRISONERS = 'PRISONERS', 
  SINGLE = 'SINGLE', 
  LARGE_FAMILIES = 'LARGE_FAMILIES', 
  MINORS = 'MINORS', 
  DISABLED_CHILDREN = 'DISABLED_CHILDREN', 
  NURSING_CARE = 'NURSING_CARE', 
}
