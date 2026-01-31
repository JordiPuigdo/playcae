import { ApiResponse } from "@/interfaces/api-response";
import { AuditLog, DocumentNotification, EmailRegistry } from "@/types/audit";
import { HttpClient } from "./http-client";

export interface AuditLogsParams {
  from?: string;
  to?: string;
  userId?: string;
}

export interface IAdminAuditService {
  getAuditLogs(params: AuditLogsParams): Promise<ApiResponse<AuditLog[]>>;
  getDocumentNotifications(params: AuditLogsParams): Promise<ApiResponse<DocumentNotification[]>>;
  getEmailRegistry(params: AuditLogsParams): Promise<ApiResponse<EmailRegistry[]>>;
}

export class AdminAuditService implements IAdminAuditService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/admin";

  constructor(private readonly httpClient: HttpClient) {}

  private buildQueryString(params: AuditLogsParams): string {
    const searchParams = new URLSearchParams();
    if (params.from) {
      searchParams.append("from", params.from);
    }
    if (params.to) {
      searchParams.append("to", params.to);
    }
    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  async getAuditLogs(params: AuditLogsParams = {}): Promise<ApiResponse<AuditLog[]>> {
    const queryString = this.buildQueryString(params);
    return this.httpClient.get<AuditLog[]>(`${this.baseUrl}/audit-logs${queryString}`);
  }

  async getDocumentNotifications(params: AuditLogsParams = {}): Promise<ApiResponse<DocumentNotification[]>> {
    const queryString = this.buildQueryString(params);
    if (!params.userId) {
      throw new Error("userId is required for getDocumentNotifications");
    }
    return this.httpClient.get<DocumentNotification[]>(`${this.baseUrl}/document-notifications/by-affected-user/${params.userId}${queryString}`);
  }

  async getEmailRegistry(params: AuditLogsParams = {}): Promise<ApiResponse<EmailRegistry[]>> {
    const queryString = this.buildQueryString(params);
    return this.httpClient.get<EmailRegistry[]>(`${this.baseUrl}/email-registry${queryString}`);
  }
}
