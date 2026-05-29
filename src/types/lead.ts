import { BaseEntity } from "./baseEntity";
import { PagedResult } from "./pagination";

export enum LeadOrigin {
  Web = 0,
  Landing = 1,
  Phone = 2,
  SocialMedia = 3,
  Event = 4,
  Referral = 5,
}

export enum LeadStatus {
  New = 0,
  Contacted = 1,
  QuoteSent = 2,
  PendingClaim = 3,
  Converted = 4,
  Rejected = 5,
  Lost = 6,
}

export enum LeadEventType {
  StatusChanged = 0,
  NoteAdded = 1,
  QuoteSent = 2,
  EmailSent = 3,
  CallMade = 4,
}

export interface Lead extends BaseEntity {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  origin: LeadOrigin;
  emailVerified: boolean;
  status: LeadStatus;
  userId?: string;
}

export interface LeadListItem extends BaseEntity {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  origin: LeadOrigin;
  emailVerified: boolean;
  status: LeadStatus;
  userId?: string;
  lastEventType?: LeadEventType;
  lastEventDate?: string;
  lastEventPreviousStatus?: LeadStatus;
  lastEventNewStatus?: LeadStatus;
  lastNote?: string;
}

export interface LeadEvent extends BaseEntity {
  leadId: string;
  eventType: LeadEventType;
  notes?: string;
  previousStatus?: LeadStatus;
  newStatus?: LeadStatus;
  createdByUserId?: string;
  createdByUserEmail?: string;
}

export interface LeadListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  origin?: LeadOrigin;
  status?: LeadStatus;
  statuses?: LeadStatus[];
  hideRegistered?: boolean;
}

export type LeadPagedResult = PagedResult<LeadListItem>;

export interface CreateLeadRequest {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  origin: LeadOrigin;
  sourceInquiryId?: string;
}

export interface UpdateLeadStatusRequest {
  status: LeadStatus;
  notes?: string;
}

export interface UpdateLeadRequest {
  companyName: string;
  email: string;
  phone: string;
  taxId: string;
  contactPerson: string;
  address: string;
  origin: LeadOrigin;
}

export interface CreateLeadEventRequest {
  eventType: LeadEventType;
  notes?: string;
}
