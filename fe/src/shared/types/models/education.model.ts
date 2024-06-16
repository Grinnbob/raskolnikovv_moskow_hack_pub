import { EducationOrganizationType, EducationType } from '../enums/education';

export interface EducationModel {
  id?: number;
  resumeId: number;
  qualificationName: string;
  qualificationType: EducationType;
  startDate?: Date | null;
  endDate?: Date | null;
  diplomaNumber?: string;
  isVerified?: boolean;
  educationOrganizationId?: number;
  educationOrganization?: EducationOrganizationModel;
}

export interface EducationOrganizationModel {
  id?: number;
  name: string;
  shortName?: string;
  description?: string;
  website?: string;
  type?: EducationOrganizationType;
  isVerified?: boolean;
  imageName?: string;
}
