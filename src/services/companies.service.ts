import { ApiResponse } from "@/interfaces/api-response";
import {
  Company,
  CompanySimple,
  CompanyStatus,
  CreateSubcontractorData,
  ImportCompaniesRequest,
  ImportCompaniesResult,
  ParentCompanyInfo,
} from "@/types/company";
import { UserCompanyOption } from "@/types/user";
import { HttpClient } from "./http-client";

export interface ICompanyService {
  getById(id: string): Promise<ApiResponse<Company>>;
  getAll(): Promise<ApiResponse<Company[]>>;
  getMyCompanies(): Promise<ApiResponse<UserCompanyOption[]>>;
  create(company: Omit<Company, "id">): Promise<ApiResponse<Company>>;
  update(id: string, company: Partial<Company>): Promise<ApiResponse<Company>>;
  delete(id: string): Promise<ApiResponse<void>>;
  updateStatus(id: string, status: CompanyStatus): Promise<ApiResponse<void>>;
  activate(companyId: string, userId: string): Promise<ApiResponse<void>>;
  deactivate(companyId: string, userId: string): Promise<ApiResponse<void>>;
  toggleInternalPrevention(id: string, hasInternalPrevention: boolean): Promise<ApiResponse<void>>;
  getByUserId(userId: string): Promise<ApiResponse<Company[]>>;
  getSubcontractors(companyId: string): Promise<ApiResponse<CompanySimple[]>>;
  getAllSubcontractorsRecursive(
    companyId: string
  ): Promise<ApiResponse<CompanySimple[]>>;
  createSubcontractor(
    parentCompanyId: string,
    data: CreateSubcontractorData
  ): Promise<ApiResponse<Company>>;
  importBulk(
    request: ImportCompaniesRequest
  ): Promise<ApiResponse<ImportCompaniesResult>>;
}

export class CompanyService implements ICompanyService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/companies";

  constructor(private readonly httpClient: HttpClient) {}

  async getById(id: string): Promise<ApiResponse<Company>> {
    return this.httpClient.get<Company>(`${this.baseUrl}/${id}`);
  }

  async getAll(): Promise<ApiResponse<Company[]>> {
    return this.httpClient.get<Company[]>(this.baseUrl);
  }

  async getMyCompanies(): Promise<ApiResponse<UserCompanyOption[]>> {
    return this.httpClient.get<UserCompanyOption[]>(
      `${this.baseUrl}/my-companies`
    );
  }

  async create(company: Omit<Company, "id">): Promise<ApiResponse<Company>> {
    return this.httpClient.post<Company>(this.baseUrl, company);
  }

  async update(
    id: string,
    company: Partial<Company>
  ): Promise<ApiResponse<Company>> {
    return this.httpClient.put(`${this.baseUrl}/${id}`, company);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async updateStatus(
    id: string,
    status: CompanyStatus
  ): Promise<ApiResponse<void>> {
    return this.httpClient.put(`${this.baseUrl}/${id}/status/${status}`, null);
  }

  async activate(companyId: string, userId: string): Promise<ApiResponse<void>> {
    return this.httpClient.put(`${this.baseUrl}/${companyId}/activate-relation/${userId}`, null);
  }

  async deactivate(companyId: string, userId: string): Promise<ApiResponse<void>> {
    return this.httpClient.put(`${this.baseUrl}/${companyId}/deactivate-relation/${userId}`, null);
  }

  async getByUserId(userId: string): Promise<ApiResponse<Company[]>> {
    return this.httpClient.get<Company[]>(`${this.baseUrl}/user/${userId}`);
  }

  async getSubcontractors(
    companyId: string
  ): Promise<ApiResponse<CompanySimple[]>> {
    return this.httpClient.get<CompanySimple[]>(
      `${this.baseUrl}/${companyId}/subcontractors`
    );
  }

  async getAllSubcontractorsRecursive(
    companyId: string
  ): Promise<ApiResponse<CompanySimple[]>> {
    return this.httpClient.get<CompanySimple[]>(
      `${this.baseUrl}/${companyId}/subcontractors/all`
    );
  }

  async createSubcontractor(
    parentCompanyId: string,
    data: CreateSubcontractorData
  ): Promise<ApiResponse<Company>> {
    return this.httpClient.post<Company>(
      `${this.baseUrl}/${parentCompanyId}/subcontractors`,
      data
    );
  }

  async importBulk(
    request: ImportCompaniesRequest
  ): Promise<ApiResponse<ImportCompaniesResult>> {
    return this.httpClient.post<ImportCompaniesResult>(
      `${this.baseUrl}/bulk`,
      request
    );
  }

  async getParentCompanies(
    companyId: string
  ): Promise<ApiResponse<ParentCompanyInfo[]>> {
    return this.httpClient.get<ParentCompanyInfo[]>(
      `${this.baseUrl}/${companyId}/parent-companies`
    );
  }

  async resendWelcomeEmail(companyId: string): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(
      `${this.baseUrl}/${companyId}/resend-welcome-email`,
      null
    );
  }

  async toggleInternalPrevention(id: string, hasInternalPrevention: boolean): Promise<ApiResponse<void>> {
    return this.httpClient.put(
      `${this.baseUrl}/${id}/internal-prevention/${hasInternalPrevention}`,
      null
    );
  }
}
