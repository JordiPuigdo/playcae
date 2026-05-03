import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  CreateQuoteCompanyDocumentSpecRequest,
  CreateQuoteLineRequest,
  CreateQuoteRequest,
  CreateQuoteWorkerProfileDocumentSpecRequest,
  CreateQuoteWorkerProfileSpecRequest,
  Quote,
  QuoteCompanyDocumentSpec,
  QuoteLine,
  QuoteListQuery,
  QuotePagedResult,
  QuoteWorkerProfileDocumentSpec,
  QuoteWorkerProfileSpec,
  UpdateQuoteLineRequest,
  UpdateQuoteRequest,
  UpdateQuoteWorkerProfileSpecRequest,
} from "@/types/quote";

export class QuoteService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/quotes";
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAll(query?: QuoteListQuery): Promise<ApiResponse<QuotePagedResult>> {
    const params = new URLSearchParams();
    if (query?.page) params.set("page", String(query.page));
    if (query?.pageSize) params.set("pageSize", String(query.pageSize));
    if (query?.search) params.set("search", query.search);
    if (query?.status !== undefined) params.set("status", String(query.status));
    if (query?.language !== undefined) params.set("language", String(query.language));
    if (query?.leadId) params.set("leadId", query.leadId);
    const qs = params.toString();
    return this.httpClient.get<QuotePagedResult>(
      `${this.baseUrl}${qs ? `?${qs}` : ""}`
    );
  }

  async getById(id: string): Promise<ApiResponse<Quote>> {
    return this.httpClient.get<Quote>(`${this.baseUrl}/${id}`);
  }

  async create(request: CreateQuoteRequest): Promise<ApiResponse<Quote>> {
    return this.httpClient.post<Quote>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateQuoteRequest): Promise<ApiResponse<Quote>> {
    return this.httpClient.put<Quote>(`${this.baseUrl}/${id}`, request);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async send(id: string): Promise<ApiResponse<Quote>> {
    return this.httpClient.post<Quote>(`${this.baseUrl}/${id}/send`, {});
  }

  // ===== Lines =====
  async addLine(id: string, request: CreateQuoteLineRequest): Promise<ApiResponse<QuoteLine>> {
    return this.httpClient.post<QuoteLine>(`${this.baseUrl}/${id}/lines`, request);
  }

  async updateLine(id: string, lineId: string, request: UpdateQuoteLineRequest): Promise<ApiResponse<QuoteLine>> {
    return this.httpClient.put<QuoteLine>(`${this.baseUrl}/${id}/lines/${lineId}`, request);
  }

  async removeLine(id: string, lineId: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}/lines/${lineId}`);
  }

  // ===== Company document specs =====
  async addCompanyDocument(
    id: string,
    request: CreateQuoteCompanyDocumentSpecRequest
  ): Promise<ApiResponse<QuoteCompanyDocumentSpec>> {
    return this.httpClient.post<QuoteCompanyDocumentSpec>(
      `${this.baseUrl}/${id}/company-documents`,
      request
    );
  }

  async removeCompanyDocument(id: string, specId: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}/company-documents/${specId}`);
  }

  // ===== Worker profile specs =====
  async addWorkerProfile(
    id: string,
    request: CreateQuoteWorkerProfileSpecRequest
  ): Promise<ApiResponse<QuoteWorkerProfileSpec>> {
    return this.httpClient.post<QuoteWorkerProfileSpec>(
      `${this.baseUrl}/${id}/worker-profiles`,
      request
    );
  }

  async updateWorkerProfile(
    id: string,
    specId: string,
    request: UpdateQuoteWorkerProfileSpecRequest
  ): Promise<ApiResponse<QuoteWorkerProfileSpec>> {
    return this.httpClient.put<QuoteWorkerProfileSpec>(
      `${this.baseUrl}/${id}/worker-profiles/${specId}`,
      request
    );
  }

  async removeWorkerProfile(id: string, specId: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}/worker-profiles/${specId}`);
  }

  async addWorkerProfileDocument(
    id: string,
    specId: string,
    request: CreateQuoteWorkerProfileDocumentSpecRequest
  ): Promise<ApiResponse<QuoteWorkerProfileDocumentSpec>> {
    return this.httpClient.post<QuoteWorkerProfileDocumentSpec>(
      `${this.baseUrl}/${id}/worker-profiles/${specId}/documents`,
      request
    );
  }

  async removeWorkerProfileDocument(
    id: string,
    specId: string,
    docId: string
  ): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/${id}/worker-profiles/${specId}/documents/${docId}`
    );
  }

  /**
   * Public-facing endpoint (anonymous). Used by the recipient of a sent quote
   * to render the proposal at /presupuesto/[token].
   */
  async getByPublicToken(token: string): Promise<ApiResponse<Quote>> {
    return this.httpClient.get<Quote>(
      `${process.env.NEXT_PUBLIC_PLAYCAE_API}/api/public/quotes/${token}`
    );
  }
}
