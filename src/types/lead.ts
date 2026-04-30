import { BaseEntity } from "./baseEntity";
import { PagedResult } from "./pagination";

export enum LeadOrigin {
  Web = 0,
  Landing = 1,
}

export interface Lead extends BaseEntity {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  password: string;
  origin: LeadOrigin;
  userId: string;
}

export interface LeadListItem extends BaseEntity {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  origin: LeadOrigin;
  emailVerified: boolean;
  userId?: string;
}

export interface LeadListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  origin?: LeadOrigin;
}

export type LeadPagedResult = PagedResult<LeadListItem>;

export interface CreateLeadRequest {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  password: string;
  origin: LeadOrigin;
}
