import { BaseEntity } from "./baseEntity";
import { DocumentType } from "./worker";

export interface Document extends BaseEntity {
  documentType: DocumentType;
  status: EntityStatus;
  originalName: string;
  storagePatg: string;
  expirationDate?: string;
  uploadDate: string;
}

export interface DocumentFormData {
  file: File;
  expiryDate?: string;
}

export interface CompanyObservation {
  id: string;
  companyId: string;
  observation: string;
  createdBy: string;
  createdAt: string;
}

export enum EntityStatus {
  Pending,
  Approved,
  Rejected,
  Expired,
}
