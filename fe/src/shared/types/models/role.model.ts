export enum Roles {
  admin = 'ADMIN',
  recruiter = 'RECRUITER',
  candidate = 'CANDIDATE',
}

export interface UserRole {
  id: number;
  value: Roles;
  description: string;
}
