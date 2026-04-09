import { ApiResponse } from "@/interfaces/api-response";
import {
  CompanySiteAssignmentBulkCreateResult,
  CompanySiteAssignment,
  CreateBulkCompanySiteAssignmentsRequest,
  CreateCompanySiteAssignmentRequest,
} from "@/types/companySiteAssignment";
import { Site } from "@/types/site";
import { HttpClient } from "./http-client";

export interface ICompanySiteAssignmentsService {
  create(
    request: CreateCompanySiteAssignmentRequest
  ): Promise<ApiResponse<CompanySiteAssignment>>;
  createBulk(
    request: CreateBulkCompanySiteAssignmentsRequest
  ): Promise<ApiResponse<CompanySiteAssignmentBulkCreateResult>>;
  remove(id: string): Promise<ApiResponse<void>>;
  getByCompanyId(companyId: string): Promise<ApiResponse<CompanySiteAssignment[]>>;
  getBySiteId(siteId: string): Promise<ApiResponse<CompanySiteAssignment[]>>;
  getSitesByCompanyId(companyId: string): Promise<ApiResponse<Site[]>>;
}

export class CompanySiteAssignmentsService implements ICompanySiteAssignmentsService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/company-site-assignments";
  private readonly companiesBaseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/companies";

  constructor(private readonly httpClient: HttpClient) {}

  async create(
    request: CreateCompanySiteAssignmentRequest
  ): Promise<ApiResponse<CompanySiteAssignment>> {
    return this.httpClient.post<CompanySiteAssignment>(this.baseUrl, request);
  }

  async createBulk(
    request: CreateBulkCompanySiteAssignmentsRequest
  ): Promise<ApiResponse<CompanySiteAssignmentBulkCreateResult>> {
    return this.httpClient.post<CompanySiteAssignmentBulkCreateResult>(
      `${this.baseUrl}/bulk`,
      request
    );
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getByCompanyId(companyId: string): Promise<ApiResponse<CompanySiteAssignment[]>> {
    return this.httpClient.get<CompanySiteAssignment[]>(
      `${this.baseUrl}/company/${companyId}`
    );
  }

  async getBySiteId(siteId: string): Promise<ApiResponse<CompanySiteAssignment[]>> {
    return this.httpClient.get<CompanySiteAssignment[]>(`${this.baseUrl}/site/${siteId}`);
  }

  async getSitesByCompanyId(companyId: string): Promise<ApiResponse<Site[]>> {
    return this.httpClient.get<Site[]>(`${this.companiesBaseUrl}/${companyId}/sites`);
  }
}
