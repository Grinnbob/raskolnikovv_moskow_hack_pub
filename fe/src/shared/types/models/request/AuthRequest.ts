import { Roles } from '../role.model';

export interface IAuthRequest {
  email: string;
  password: string;
  role?: Roles | null;
}

export interface ISignupRequest {
  email: string;
  password: string;
  role: Roles;
}
