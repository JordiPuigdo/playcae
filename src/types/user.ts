import { BaseEntity } from "./baseEntity";
import { LicenseSummary } from "./license";

export interface UserLoginResponse extends User {
  refreshTokenExpiryTime: string;
  refreshToken: string;
  companyId: string;
  parentCompanyId: string | null;
  isNew: boolean;
  token?: string;
  userId: string;
  role: UserRole;
  userName: string;
  adminLogoUrl?: string | null;
  licenseSummary?: LicenseSummary | null;
  companies?: UserCompanyOption[];
}

export interface UserCompanyOption {
  id: string;
  name: string;
  isNew: boolean;
}

export interface ParentCompany {
  id: string;
  name: string;
  taxId?: string;
}

export interface UserSiteOption {
  id: string;
  name: string;
}

export interface User extends BaseEntity {
  userName: string;
  role: UserRole;
}

export enum UserRole {
  SuperAdmin,
  Admin,
  Company,
  Supplier,
  PRLManager,
  Marketing,
}

export interface UpdateUserRequest {
  email: string;
  role: UserRole;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.SuperAdmin]: "Super administrador",
  [UserRole.Admin]: "Administrador",
  [UserRole.Company]: "Empresa",
  [UserRole.Supplier]: "Proveedor",
  [UserRole.PRLManager]: "Técnico PRL",
  [UserRole.Marketing]: "Marketing",
};

export const getUserRoleLabel = (role: UserRole): string =>
  USER_ROLE_LABELS[role] ?? "Desconocido";
