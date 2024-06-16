import { ResumeModel } from './resume.model';
import { UserModel } from './user.model';
import { VacancyModel } from './vacancy.model';

interface CommentModel {
  id: number;
  isViewed: boolean;
  userId: number;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  user: UserModel;
  likes: UserModel[];
}

export interface VacancyCommentModel extends CommentModel {
  vacancyId: number;
  vacancy: VacancyModel;
}

export interface ResumeCommentModel extends CommentModel {
  resumeId: number;
  resume: ResumeModel;
}
