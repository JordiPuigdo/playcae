import { BaseEntity } from "./baseEntity";

export interface CompanySiteAssignment extends BaseEntity {
  companyId: string;
  companyName?: string | null;
  siteId: string;
  siteName?: string | null;
  createdByUserId: string;
}

export interface CreateCompanySiteAssignmentRequest {
  companyId: string;
  siteId: string;
  createdByUserId: string;
}

export interface CreateBulkCompanySiteAssignmentsRequest {
  siteId: string;
  createdByUserId: string;
  companyIds: string[];
}

export interface CompanySiteAssignmentBulkCreateResult {
  siteId: string;
  requestedCount: number;
  uniqueRequestedCount: number;
  duplicateRequestedCount: number;
  createdCount: number;
  alreadyAssignedCount: number;
  invalidCompanyCount: number;
  createdCompanyIds: string[];
  alreadyAssignedCompanyIds: string[];
  invalidCompanyIds: string[];
}
