export interface PendingDocumentValidationItem {
  adminUserId: string;
  adminLeadCompanyName?: string | null;
  companyId: string;
  companyName: string;
  companyActive: boolean;
  workerId?: string | null;
  workerFullName?: string | null;
  workerActive?: boolean | null;
  documentId: string;
  documentTypeName: string;
  status: number;
  uploadedDate?: string | null;
  expirationDate?: string | null;
  isCompanyDocument: boolean;
}

export enum PendingValidationOwnerType {
  Company = "company",
  Worker = "worker",
}
