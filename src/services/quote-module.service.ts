import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  CreateQuoteModuleRequest,
  QuoteModule,
  QuoteModuleListQuery,
  UpdateQuoteModuleRequest,
} from "@/types/quote";

export interface IQuoteModuleService {
  getAll(query?: QuoteModuleListQuery): Promise<ApiResponse<QuoteModule[]>>;
  getById(id: string): Promise<ApiResponse<QuoteModule>>;
  create(request: CreateQuoteModuleRequest): Promise<ApiResponse<QuoteModule>>;
  update(id: string, request: UpdateQuoteModuleRequest): Promise<ApiResponse<QuoteModule>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export class QuoteModuleService implements IQuoteModuleService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/quote-modules";
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAll(query?: QuoteModuleListQuery): Promise<ApiResponse<QuoteModule[]>> {
    const params = new URLSearchParams();
    if (query?.isActive !== undefined) params.set("isActive", String(query.isActive));
    if (query?.search) params.set("search", query.search);
    const qs = params.toString();
    return this.httpClient.get<QuoteModule[]>(
      `${this.baseUrl}${qs ? `?${qs}` : ""}`
    );
  }

  async getById(id: string): Promise<ApiResponse<QuoteModule>> {
    return this.httpClient.get<QuoteModule>(`${this.baseUrl}/${id}`);
  }

  async create(request: CreateQuoteModuleRequest): Promise<ApiResponse<QuoteModule>> {
    return this.httpClient.post<QuoteModule>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateQuoteModuleRequest): Promise<ApiResponse<QuoteModule>> {
    return this.httpClient.put<QuoteModule>(`${this.baseUrl}/${id}`, request);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
