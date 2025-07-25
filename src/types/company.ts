import { BaseEntity } from "./baseEntity";
import { EntityStatus } from "./document";

export interface Company extends BaseEntity {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
  status: EntityStatus;
  userId: string;
}

export interface CompanyFormData {
  name: string;
  taxId: string;
  contactPerson: string;
  email: string;
  phone?: string;
}
