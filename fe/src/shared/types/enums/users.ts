import { UserModel } from '../models/user.model';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum CandidateStatus { // only for role = CANDIDATE
  NOT_LOOKING_OFFERS = 'NOT_LOOKING_OFFERS',
  CONSIDERING_OFFERS = 'CONSIDERING_OFFERS',
  ACTIVELY_CONSIDERING_OFFERS = 'ACTIVELY_CONSIDERING_OFFERS',
  HAVE_AN_OFFER = 'HAVE_AN_OFFER',
  WORKING = 'WORKING',
}

export const RECRUITER_TYPE = {
  AGENCY: 'AGENCY',
  ORGANIZATION: 'ORGANIZATION',
  FREELANCE: 'FREELANCE',
  SMALL_ORGANIZATION: 'SMALL_ORGANIZATION',
};

// states
interface IState {
  isLoading: boolean;
  error?: null | string;
}

export interface IUsersState extends IState {
  users: UserModel[];
}

export interface IMeState extends IState {
  me: UserModel | null;
}
