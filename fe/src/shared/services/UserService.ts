import $api from '../http';
import { AxiosResponse } from 'axios';
import { UserModel } from '../types/models/user.model';

export default class UserService {
  constructor() {}

  static async getMe(): Promise<AxiosResponse<UserModel>> {
    return $api.get<UserModel>('/me');
  }

  static async getUsers(): Promise<AxiosResponse<UserModel[]>> {
    return $api.get<UserModel[]>('/users');
  }

  // static async addMainInfo(values: IUserMainInfo): Promise<UserModel> {
  //     const result = await $api.post<AxiosResponse<UserModel>>(
  //         "/users/add/mainInfo",
  //         {
  //             ...values,
  //             birthDate: values.birthDate.toISOString(),
  //         }
  //     )

  //     return result.data as any
  // }
}
