import { BaseEntity } from "./baseEntity";

export interface Site extends BaseEntity {
  name: string;
  address?: string | null;
  companyId: string;
  companyName?: string | null;
  isDefault: boolean;
}

export interface CreateSiteRequest {
  name: string;
  address?: string | null;
  companyId: string;
  isDefault?: boolean;
}

export interface UpdateSiteRequest {
  name?: string;
  address?: string | null;
}
