import { BaseEntity } from "./baseEntity";
import { PagedResult } from "./pagination";

export enum QuoteLanguage {
  Es = 0,
  Ca = 1,
}

export enum QuoteStatus {
  Draft = 0,
  Sent = 1,
  Accepted = 2,
  Rejected = 3,
  Expired = 4,
}

export enum QuoteBillingType {
  Annual = 0,
  OneTime = 1,
}

// ===== Quote module catalog =====

export interface QuoteModule extends BaseEntity {
  code: string;
  nameEs: string;
  nameCa: string;
  descriptionEs?: string | null;
  descriptionCa?: string | null;
  defaultPrice: number;
  billingType: QuoteBillingType;
  isActive: boolean;
  sortOrder: number;
  iconKey?: string | null;
}

export interface QuoteModuleListQuery {
  isActive?: boolean;
  search?: string;
}

export interface CreateQuoteModuleRequest {
  code: string;
  nameEs: string;
  nameCa: string;
  descriptionEs?: string | null;
  descriptionCa?: string | null;
  defaultPrice: number;
  billingType: QuoteBillingType;
  isActive: boolean;
  sortOrder: number;
  iconKey?: string | null;
}

export type UpdateQuoteModuleRequest = Partial<CreateQuoteModuleRequest>;

// ===== Quote =====

export interface QuoteLine extends BaseEntity {
  quoteId: string;
  quoteModuleId?: string | null;
  nameSnapshot: string;
  descriptionSnapshot?: string | null;
  unitPrice: number;
  quantity: number;
  billingType: QuoteBillingType;
  isOptional: boolean;
  sortOrder: number;
}

export interface QuoteCompanyDocumentSpec extends BaseEntity {
  quoteId: string;
  documentTypeId?: string | null;
  documentTypeName?: string | null;
  customName?: string | null;
  isTemplate: boolean;
  sortOrder: number;
}

export interface QuoteWorkerProfileDocumentSpec extends BaseEntity {
  profileSpecId: string;
  documentTypeId?: string | null;
  documentTypeName?: string | null;
  customName?: string | null;
  sortOrder: number;
}

export interface QuoteWorkerProfileSpec extends BaseEntity {
  quoteId: string;
  name: string;
  description?: string | null;
  workerCount: number;
  documentCount: number;
  sortOrder: number;
  documents: QuoteWorkerProfileDocumentSpec[];
}

export interface QuoteCompanyProfileSpec extends BaseEntity {
  quoteId: string;
  name: string;
  description?: string | null;
  companyCount: number;
  documentCount: number;
  sortOrder: number;
}

export interface QuoteSimple extends BaseEntity {
  reference: string;
  leadId: string;
  clientCompanyName: string;
  language: QuoteLanguage;
  status: QuoteStatus;
  issueDate: string;
  validUntil: string;
  acceptedAt?: string | null;
  annualSubtotal: number;
  oneTimeSubtotal: number;
  firstYearTotal: number;
}

export interface Quote extends BaseEntity {
  reference: string;
  leadId: string;
  language: QuoteLanguage;
  status: QuoteStatus;
  issueDate: string;
  validUntil: string;
  acceptedAt?: string | null;
  acceptedByName?: string | null;
  acceptedByDni?: string | null;
  acceptedFromIp?: string | null;
  clientCompanyName: string;
  clientLogoUrl?: string | null;
  scope?: string | null;
  externalCompaniesCount: number;
  externalWorkersCount: number;
  internalWorkersCount: number;
  activeDocumentsApprox: number;
  usersCount: number;
  sitesCount: number;
  maxContractors?: number | null;
  hasWorksModule: boolean;
  simultaneousWorksCount: number;
  hasInternalWorkersModule: boolean;
  publicToken: string;
  tenantUserId?: string | null;
  lines: QuoteLine[];
  companyDocumentSpecs: QuoteCompanyDocumentSpec[];
  workerProfileSpecs: QuoteWorkerProfileSpec[];
  companyProfileSpecs: QuoteCompanyProfileSpec[];
  annualSubtotal: number;
  oneTimeSubtotal: number;
  firstYearTotal: number;
}

export type QuotePagedResult = PagedResult<QuoteSimple>;

export interface QuoteListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: QuoteStatus;
  language?: QuoteLanguage;
  leadId?: string;
}

export interface CreateQuoteRequest {
  leadId: string;
  language: QuoteLanguage;
  scope?: string | null;
  externalCompaniesCount: number;
  externalWorkersCount: number;
  internalWorkersCount: number;
  activeDocumentsApprox: number;
  usersCount: number;
  sitesCount: number;
  hasWorksModule: boolean;
  simultaneousWorksCount: number;
  hasInternalWorkersModule: boolean;
  validUntil?: string | null;
  workerProfiles?: CreateQuoteWorkerProfileSpecRequest[];
  companyProfiles?: CreateQuoteCompanyProfileSpecRequest[];
}

export interface UpdateQuoteRequest {
  reference?: string;
  language?: QuoteLanguage;
  status?: QuoteStatus;
  clientCompanyName?: string;
  scope?: string | null;
  externalCompaniesCount?: number;
  externalWorkersCount?: number;
  internalWorkersCount?: number;
  activeDocumentsApprox?: number;
  usersCount?: number;
  sitesCount?: number;
  maxContractors?: number | null;
  hasWorksModule?: boolean;
  simultaneousWorksCount?: number;
  hasInternalWorkersModule?: boolean;
  validUntil?: string;
}

export interface CreateQuoteLineRequest {
  quoteModuleId?: string | null;
  nameSnapshot: string;
  descriptionSnapshot?: string | null;
  unitPrice: number;
  quantity: number;
  billingType: QuoteBillingType;
  isOptional: boolean;
  sortOrder: number;
}

export type UpdateQuoteLineRequest = Partial<CreateQuoteLineRequest>;

export interface CreateQuoteCompanyDocumentSpecRequest {
  documentTypeId?: string | null;
  customName?: string | null;
  isTemplate: boolean;
  sortOrder: number;
}

export interface CreateQuoteWorkerProfileDocumentSpecRequest {
  documentTypeId?: string | null;
  customName?: string | null;
  sortOrder: number;
}

export interface CreateQuoteWorkerProfileSpecRequest {
  name: string;
  description?: string | null;
  workerCount: number;
  documentCount: number;
  sortOrder: number;
  documents: CreateQuoteWorkerProfileDocumentSpecRequest[];
}

export interface UpdateQuoteWorkerProfileSpecRequest {
  name?: string;
  description?: string | null;
  workerCount?: number;
  documentCount?: number;
  sortOrder?: number;
}

export interface QuoteCompanyProfileSpecCreate {
  name: string;
  description?: string | null;
  companyCount: number;
  documentCount: number;
}

export interface CreateQuoteCompanyProfileSpecRequest {
  name: string;
  description?: string | null;
  companyCount: number;
  documentCount: number;
  sortOrder: number;
}

export type UpdateQuoteCompanyProfileSpecRequest = Partial<CreateQuoteCompanyProfileSpecRequest>;
