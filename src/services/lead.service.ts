import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import { CreateLeadRequest, Lead } from "@/types/lead";

export interface ILeadService {
  create(request: CreateLeadRequest): Promise<ApiResponse<Lead>>;
}

export class LeadService implements ILeadService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/leads";
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async create(request: CreateLeadRequest): Promise<ApiResponse<Lead>> {
    return this.httpClient.post<Lead>(this.baseUrl, request);
  }
}
