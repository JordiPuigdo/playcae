import { BaseEntity } from "./baseEntity";
import { EntityStatus } from "./document";

export interface Worker extends BaseEntity {
  companyId: string;
  firstName: string;
  lastName: string;
  cardId: string;
  position?: string;
  status: EntityStatus;
  documents?: WorkerDocument[];
}

export interface WorkerDocument {
  id: string;
  workerId: string;
  documentType: DocumentType;
  name: string;
  fileName?: string;
  uploadDate?: string;
  issueDate?: string;
  expiryDate?: string;
  status: EntityStatus;
  validatorComment?: string;
  validatedBy?: string;
  validatedAt?: string;
}

export interface DocumentType {
  code: string;
  name: string;
}

export interface WorkerFormData {
  firstName: string;
  lastName: string;
  cardId: string;
  position?: string;
  companyId: string;
}

export interface WorkerDocumentFormData {
  file: File;
  issueDate?: string;
  expiryDate?: string;
}
