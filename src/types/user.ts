import { BaseEntity } from "./baseEntity";

export interface UserLoginResponse extends User {
  refreshTokenExpiryTime: string;
  companyId: string;
  isNew: boolean;
  token?: string;
  userId: string;
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
