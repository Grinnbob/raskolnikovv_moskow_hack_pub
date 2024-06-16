import { UserModel } from '../user.model';

export interface IAuthResponse {
  token: string;
  user: UserModel;
}
