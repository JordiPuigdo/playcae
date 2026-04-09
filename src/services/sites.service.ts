import { ApiResponse } from "@/interfaces/api-response";
import { CreateSiteRequest, Site, UpdateSiteRequest } from "@/types/site";
import { HttpClient } from "./http-client";

export interface ISitesService {
  getByCompanyId(companyId: string): Promise<ApiResponse<Site[]>>;
  create(request: CreateSiteRequest): Promise<ApiResponse<Site>>;
  update(id: string, request: UpdateSiteRequest): Promise<ApiResponse<Site>>;
  remove(id: string): Promise<ApiResponse<void>>;
}

export class SitesService implements ISitesService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/sites";

  constructor(private readonly httpClient: HttpClient) {}

  async getByCompanyId(companyId: string): Promise<ApiResponse<Site[]>> {
    return this.httpClient.get<Site[]>(`${this.baseUrl}/company/${companyId}`);
  }

  async create(request: CreateSiteRequest): Promise<ApiResponse<Site>> {
    return this.httpClient.post<Site>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateSiteRequest): Promise<ApiResponse<Site>> {
    return this.httpClient.put<Site>(`${this.baseUrl}/${id}`, request);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
