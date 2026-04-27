import { ApiResponse } from "@/interfaces/api-response";
import { UserNotification } from "@/types/notification";
import { HttpClient } from "./http-client";

export interface INotificationService {
  getNotifications(onlyUnread?: boolean, page?: number, size?: number): Promise<ApiResponse<UserNotification[]>>;
  getUnreadCount(): Promise<ApiResponse<number>>;
  markAsRead(id: string): Promise<ApiResponse<void>>;
  markAllAsRead(): Promise<ApiResponse<void>>;
}

export class NotificationService implements INotificationService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/notifications";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getNotifications(
    onlyUnread = false,
    page = 1,
    size = 20
  ): Promise<ApiResponse<UserNotification[]>> {
    return this.httpClient.get<UserNotification[]>(
      `${this.baseUrl}?onlyUnread=${onlyUnread}&page=${page}&size=${size}`
    );
  }

  async getUnreadCount(): Promise<ApiResponse<number>> {
    return this.httpClient.get<number>(`${this.baseUrl}/unread-count`);
  }

  async markAsRead(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}/read`, {});
  }

  async markAllAsRead(): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(`${this.baseUrl}/read-all`, {});
  }
}
