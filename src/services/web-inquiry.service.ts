import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  WebInquiryListQuery,
  WebInquiryPagedResult,
} from "@/types/web-inquiry";

export class WebInquiryService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/web-inquiries";

  constructor(private readonly httpClient: HttpClient = new HttpClient()) {}

  async checkEmail(email: string): Promise<ApiResponse<{ exists: boolean }>> {
    return this.httpClient.get<{ exists: boolean }>(
      `${this.baseUrl}/check-email?email=${encodeURIComponent(email)}`
    );
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async getAll(
    query?: WebInquiryListQuery
  ): Promise<ApiResponse<WebInquiryPagedResult>> {
    const params = new URLSearchParams();

    if (query?.page) params.set("page", String(query.page));
    if (query?.pageSize) params.set("pageSize", String(query.pageSize));
    if (query?.search) params.set("search", query.search);
    if (query?.type !== undefined) params.set("type", String(query.type));

    const queryString = params.toString();
    return this.httpClient.get<WebInquiryPagedResult>(
      `${this.baseUrl}${queryString ? `?${queryString}` : ""}`
    );
  }
}
