import { BaseEntity } from "./baseEntity";

export interface UserLoginResponse extends User {
  refreshTokenExpiryTime: string;
  refreshToken: string;
  companyId: string;
  isNew: boolean;
  token?: string;
  userId: string;
  role: UserRole;
  userName: string;
}

export interface User extends BaseEntity {
  userName: string;
  role: UserRole;
}

export enum UserRole {
  SuperAdmin,
  Admin,
  Company,
}
