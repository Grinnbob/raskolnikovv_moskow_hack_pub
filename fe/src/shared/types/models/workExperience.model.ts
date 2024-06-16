import { QualificationLevel } from '../enums/resume-vacancy';
import { CompanyModel } from './company.model';

export interface WorkExperienceModel {
  id?: number;
  resumeId: number;
  jobTitle: string;
  description?: string;
  teamInfluence?: string;
  myInfluence?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isVerified?: boolean;
  companyId?: number;
  company?: CompanyModel;
  location?: string;
  qualificationLevel?: QualificationLevel;
}
