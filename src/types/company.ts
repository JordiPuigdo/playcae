import { BaseEntity } from "./baseEntity";

export interface Company extends BaseEntity {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: CompanyStatus;
  userId: string;
}

export enum CompanyStatus {
  Approved,
  Rejected,
  Pending,
}

export interface CompanyFormData {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
}
