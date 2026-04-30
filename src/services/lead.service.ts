import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  CreateLeadRequest,
  Lead,
  LeadListQuery,
  LeadPagedResult,
} from "@/types/lead";

export interface ILeadService {
  getAll(query?: LeadListQuery): Promise<ApiResponse<LeadPagedResult>>;
  create(request: CreateLeadRequest): Promise<ApiResponse<Lead>>;
}

export class LeadService implements ILeadService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/leads";
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAll(query?: LeadListQuery): Promise<ApiResponse<LeadPagedResult>> {
    const params = new URLSearchParams();

    if (query?.page) params.set("page", String(query.page));
    if (query?.pageSize) params.set("pageSize", String(query.pageSize));
    if (query?.search) params.set("search", query.search);
    if (query?.origin !== undefined) params.set("origin", String(query.origin));

    const queryString = params.toString();
    return this.httpClient.get<LeadPagedResult>(
      `${this.baseUrl}${queryString ? `?${queryString}` : ""}`
    );
  }

  async create(request: CreateLeadRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.post<Lead>(this.baseUrl, request);
  }
}
