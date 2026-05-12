import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  CreateLeadEventRequest,
  CreateLeadRequest,
  Lead,
  LeadEvent,
  LeadListQuery,
  LeadPagedResult,
  UpdateLeadStatusRequest,
} from "@/types/lead";

export interface ILeadService {
  getAll(query?: LeadListQuery): Promise<ApiResponse<LeadPagedResult>>;
  create(request: CreateLeadRequest): Promise<ApiResponse<Lead>>;
  updateStatus(id: string, request: UpdateLeadStatusRequest): Promise<ApiResponse<Lead>>;
  activate(id: string): Promise<ApiResponse<Lead>>;
  deactivate(id: string): Promise<ApiResponse<Lead>>;
  getEvents(id: string): Promise<ApiResponse<LeadEvent[]>>;
  addEvent(id: string, request: CreateLeadEventRequest): Promise<ApiResponse<LeadEvent>>;
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
    if (query?.status !== undefined) params.set("status", String(query.status));
    if (query?.hideRegistered !== undefined) params.set("hideRegistered", String(query.hideRegistered));

    const queryString = params.toString();
    return this.httpClient.get<LeadPagedResult>(
      `${this.baseUrl}${queryString ? `?${queryString}` : ""}`
    );
  }

  async create(request: CreateLeadRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.post<Lead>(this.baseUrl, request);
  }

  async updateStatus(id: string, request: UpdateLeadStatusRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.patch<Lead>(`${this.baseUrl}/${id}/status`, request);
  }

  async activate(id: string): Promise<ApiResponse<Lead>> {
    return this.httpClient.patch<Lead>(`${this.baseUrl}/${id}/activate`, {});
  }

  async deactivate(id: string): Promise<ApiResponse<Lead>> {
    return this.httpClient.patch<Lead>(`${this.baseUrl}/${id}/deactivate`, {});
  }

  async getEvents(id: string): Promise<ApiResponse<LeadEvent[]>> {
    return this.httpClient.get<LeadEvent[]>(`${this.baseUrl}/${id}/events`);
  }

  async addEvent(id: string, request: CreateLeadEventRequest): Promise<ApiResponse<LeadEvent>> {
    return this.httpClient.post<LeadEvent>(`${this.baseUrl}/${id}/events`, request);
  }
}
