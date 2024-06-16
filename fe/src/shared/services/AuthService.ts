import $api from '../http';
import { ApiAuth } from '../lib/next-auth';
import { IAuthResponse } from '../types/models/response/AuthResponse';
import { Roles } from '../types/models/role.model';

export default class AuthService {
  constructor() {}

  static async login(
    email: string,
    password: string,
    role?: string | null,
  ): Promise<IAuthResponse> {
    return await $api
      .post('auth/login', {
        json: {
          email,
          password,
          role,
        },
      })
      .json();
  }

  static async signup(
    email: string,
    password: string,
    role: string,
  ): Promise<IAuthResponse> {
    return await $api
      .post('auth/signup', {
        json: {
          email,
          password,
          role,
        },
      })
      .json();
  }

  static async googleByToken(
    idToken: string,
    role: Roles,
  ): Promise<IAuthResponse> {
    const res: IAuthResponse = await $api
      .get('auth/google', {
        headers: { ['x-id-token']: idToken, ['x-auth-role']: role },
      })
      .json();
    return res;
  }

  static toNextAuth({ user, token }: IAuthResponse): ApiAuth {
    return {
      apiUser: {
        id: user.id!,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role?.value || '',
      },
      apiTokens: {
        accessToken: token,
      },
    };
  }

  // static async logout(): Promise<void> {
  //     await $api.get("/auth/logout")
  // }

  // async checkAuth(params: type) {}
}
