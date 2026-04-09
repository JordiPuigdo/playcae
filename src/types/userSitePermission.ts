import { BaseEntity } from "./baseEntity";
import { UserRole } from "./user";

export interface UserSitePermission extends BaseEntity {
  userId: string;
  userEmail?: string | null;
  siteId: string;
  siteName?: string | null;
  permissionRole: string;
}

export interface CreateUserSitePermissionRequest {
  userId: string;
  siteId: string;
  permissionRole: string;
}

export interface UserManagementItem extends BaseEntity {
  email: string;
  role: UserRole;
}
