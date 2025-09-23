import { BaseEntity } from "./baseEntity";
import { DocumentType } from "./worker";

export interface Document extends BaseEntity {
  documentType: DocumentType;
  status: EntityStatus;
  originalName: string;
  storagePath: string;
  expirationDate?: string;
  uploadedDate: string;
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

export interface UploadDocument {
  file: File;
  expiryDate?: string;
  workerId?: string;
  companyId: string;
  documentId: string;
}
