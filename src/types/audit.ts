import { BaseEntity } from "./baseEntity";

// ============ AUDIT LOGS ============

export enum AuditActionType {
  Create = 0,
  Update = 1,
  Delete = 2,
  Login = 3,
  Logout = 4,
  Upload = 5,
  Download = 6,
  Validate = 7,
  Reject = 8,
  Export = 9,
  Import = 10,
  SendEmail = 11,
  ChangeStatus = 12,
  AccessGranted = 13,
  AccessDenied = 14,
}

export enum AuditResultType {
  Success = 0,
  Failure = 1,
  PartialSuccess = 2,
}

export interface AuditLog extends BaseEntity {
  userId?: string;
  userName?: string;
  actionType: AuditActionType;
  entityType: string;
  entityId?: string;
  entityName?: string;
  oldValues?: string;
  newValues?: string;
  additionalData?: string;
  result: AuditResultType;
  errorMessage?: string;
  ipAddress?: string;
  timestamp: string;
}

// ============ DOCUMENT NOTIFICATION ============

export enum NotificationType {
  SevenDaysWarning = 1,
  Expired = 2,
}

export interface DocumentNotification extends BaseEntity {
  documentId: string;
  documentName?: string;
  notificationType: NotificationType;
  sentDate: string;
  emailSent: boolean;
  recipientEmail?: string;
  errorMessage?: string;
}

// ============ EMAIL REGISTRY ============

export enum EmailType {
  Welcome = 0,
  PasswordReset = 1,
  DocumentExpiring = 2,
  DocumentExpired = 3,
  DocumentValidated = 4,
  DocumentRejected = 5,
  AccessGranted = 6,
  AccessDenied = 7,
  Notification = 8,
}

export enum EmailSendStatus {
  Pending = 0,
  Sent = 1,
  Failed = 2,
  Retrying = 3,
}

export interface EmailRegistry extends BaseEntity {
  idempotencyKey: string;
  emailType: EmailType;
  entityType?: string;
  entityId?: string;
  recipientEmail: string;
  recipientName?: string;
  subject?: string;
  sentAt: string;
  status: EmailSendStatus;
  errorMessage?: string;
  retryCount: number;
  additionalData?: string;
}
