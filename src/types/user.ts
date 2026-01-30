import { BaseEntity } from "./baseEntity";

export interface UserLoginResponse extends User {
  refreshTokenExpiryTime: string;
  refreshToken: string;
  companyId: string;
  parentCompanyId: string | null; // ID de empresa padre (si solo hay una)
  isNew: boolean;
  token?: string;
  userId: string;
  role: UserRole;
  userName: string;
  adminLogoUrl?: string | null; // Logo personalizado del admin
}

export interface ParentCompany {
  id: string;
  name: string;
  taxId?: string;
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
