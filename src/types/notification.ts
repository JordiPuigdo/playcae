export enum UserNotificationSubtype {
  DocumentValidatedByAI = 1,
  DocumentPendingManual = 2,
  DocumentRejected = 3,
  DocumentExpiredOnUpload = 4,
}

export interface UserNotification {
  id: string;
  userId: string;
  documentId: string;
  documentTypeName: string | null;
  companyId: string | null;
  companyName: string | null;
  workerId: string | null;
  workerName: string | null;
  supplierId: string | null;
  supplierName: string | null;
  subtype: UserNotificationSubtype;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface UnreadCountResponse {
  count: number;
}
