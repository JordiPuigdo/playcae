import { BaseEntity } from "./baseEntity";

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
