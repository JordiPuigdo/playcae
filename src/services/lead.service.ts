import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  CreateLeadEventRequest,
  CreateLeadRequest,
  Lead,
  LeadEvent,
  LeadListQuery,
  LeadPagedResult,
  UpdateLeadRequest,
  UpdateLeadStatusRequest,
} from "@/types/lead";

export interface ILeadService {
  getAll(query?: LeadListQuery): Promise<ApiResponse<LeadPagedResult>>;
  create(request: CreateLeadRequest): Promise<ApiResponse<Lead>>;
  update(id: string, request: UpdateLeadRequest): Promise<ApiResponse<Lead>>;
  delete(id: string, deleteUser?: boolean): Promise<ApiResponse<void>>;
  updateStatus(id: string, request: UpdateLeadStatusRequest): Promise<ApiResponse<Lead>>;
  onboardClient(id: string): Promise<ApiResponse<Lead>>;
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
    if (query?.statuses?.length) {
      query.statuses.forEach((s) => params.append("statuses", String(s)));
    } else if (query?.status !== undefined) {
      params.set("status", String(query.status));
    }
    if (query?.hideRegistered !== undefined) params.set("hideRegistered", String(query.hideRegistered));

    const queryString = params.toString();
    return this.httpClient.get<LeadPagedResult>(
      `${this.baseUrl}${queryString ? `?${queryString}` : ""}`
    );
  }

  async create(request: CreateLeadRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.post<Lead>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateLeadRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.put<Lead>(`${this.baseUrl}/${id}`, request);
  }

  async delete(id: string, deleteUser?: boolean): Promise<ApiResponse<void>> {
    const params = new URLSearchParams();
    if (deleteUser) params.set("deleteUser", "true");
    const queryString = params.toString();
    return this.httpClient.delete<void>(
      `${this.baseUrl}/${id}${queryString ? `?${queryString}` : ""}`
    );
  }

  async updateStatus(id: string, request: UpdateLeadStatusRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.patch<Lead>(`${this.baseUrl}/${id}/status`, request);
  }

  async onboardClient(id: string): Promise<ApiResponse<Lead>> {
    return this.httpClient.post<Lead>(`${this.baseUrl}/${id}/onboard`, {});
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
