export type UserShort = {
  id: number;
  email: string;
  fname: string;
  lname: string;
  role: string;
};

export type BackendTokens = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
};

export type UserAuthData = {
  user: UserShort;
  backendTokens: BackendTokens;
};

export type LoginDTO = { email: string; password: string };
export type SignUpDTO = LoginDTO & {
  fname: string;
  lname?: string;
  phone?: string;
};

export const isSignupData = (data: object): data is SignUpDTO =>
  'fname' in data;
