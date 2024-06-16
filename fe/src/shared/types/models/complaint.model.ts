import { ResumeModel } from './resume.model';
import { UserModel } from './user.model';
import { VacancyModel } from './vacancy.model';

interface ComplaintModel {
  id: number;
  isViewed: boolean;
  userId: number;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserModel;
}

export interface VacancyComplaintModel extends ComplaintModel {
  vacancyId: number;
  vacancy: VacancyModel;
}

export interface ResumeComplaintModel extends ComplaintModel {
  resumeId: number;
  resume: ResumeModel;
}
