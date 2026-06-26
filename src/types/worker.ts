import { BaseEntity } from "./baseEntity";
import { Document } from "./document";

export interface Worker extends BaseEntity {
  companyId: string;
  tenantAdminUserId?: string | null;
  firstName: string;
  lastName: string;
  cardId: string;
  position?: string;
  email?: string;
  status: WorkerStatus;
  ssn: string;
  documents?: Document[];
}

export enum WorkerStatus {
  Approved,
  Rejected,
}

export interface DocumentType extends BaseEntity {
  code: string;
  name: string;
  legalPeriod?: number;
}

export interface WorkerFormData {
  firstName: string;
  lastName: string;
  cardId: string;
  position?: string;
  email?: string;
  companyId: string;
  tenantAdminUserId?: string | null;
  ssn: string;
}

export interface WorkerDocumentFormData {
  file: File;
  issueDate?: string;
  expiryDate?: string;
  forceValidation: boolean;
}
