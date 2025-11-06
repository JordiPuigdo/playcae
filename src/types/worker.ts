import { BaseEntity } from "./baseEntity";
import { Document } from "./document";

export interface Worker extends BaseEntity {
  companyId: string;
  firstName: string;
  lastName: string;
  cardId: string;
  position?: string;
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
}

export interface WorkerFormData {
  firstName: string;
  lastName: string;
  cardId: string;
  position?: string;
  companyId: string;
  ssn: string;
}

export interface WorkerDocumentFormData {
  file: File;
  issueDate?: string;
  expiryDate?: string;
}
