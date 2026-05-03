import { BaseEntity } from "./baseEntity";

export interface ProfileDocumentRequirement extends BaseEntity {
  profileId: string;
  documentTypeId: string;
  documentTypeName?: string | null;
}

// ScopeType: 0 = Global, 1 = Tenant
// TargetType: 0 = Company, 1 = Worker
export const ProfileScopeType = { Global: 0, Tenant: 1 } as const;
export const ProfileTargetType = { Company: 0, Worker: 1 } as const;

export interface Profile extends BaseEntity {
  adminUserId?: string | null;
  companyId?: string | null;
  scopeType: number;
  targetType: number;
  isDefaultOnCompanyCreation: boolean;
  isDefaultOnWorkerCreation: boolean;
  name: string;
  description?: string | null;
  sortOrder: number;
  documentRequirements: ProfileDocumentRequirement[];
}

export interface CreateProfileRequest {
  name: string;
  description?: string | null;
  scopeType: number;
  targetType: number;
  isDefaultOnCompanyCreation: boolean;
  isDefaultOnWorkerCreation: boolean;
  sortOrder: number;
  documentRequirements: { documentTypeId: string }[];
}

export interface UpdateProfileRequest {
  name: string;
  description?: string | null;
  sortOrder: number;
  scopeType: number;
  targetType: number;
  isDefaultOnCompanyCreation: boolean;
  isDefaultOnWorkerCreation: boolean;
}
