import { BaseEntity } from "./baseEntity";
import { DocumentType } from "./worker";

export interface Document extends BaseEntity {
  documentType: DocumentType;
  status: EntityStatus;
  originalName: string;
  storagePath: string;
  issueDate?: string;
  expirationDate?: string;
  uploadedDate: string;
}

export interface DocumentFormData {
  file: File;
  expiryDate?: string;
  forceValidation: boolean;
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
  ValidatedByAI,
  ExpiredByAI,
  PendingManualy,
}

export interface UploadDocument {
  file: File;
  expiryDate?: string;
  workerId?: string;
  companyId: string;
  documentId: string;
  forceValidation: boolean;
}

export interface DocumentUploadResponse {
  document: Document;
  errorMessage: string;
}

export interface WorkerDocumentHistoricalRequest {
  workerId?: string;
  companyId?: string;
  documentTypeId: string;
  startDate: string;
  endDate: string;
}

export interface ManualValidationRequest {
  status: EntityStatus;
  expirationDate: string;
  comment?: string;
}
