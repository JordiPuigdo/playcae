import { ApiResponse } from "@/interfaces/api-response";
import { Company } from "@/types/company";
import { EntityStatus } from "@/types/document";
import { HttpClient } from "./http-client";

export interface ICompanyService {
  getById(id: string): Promise<ApiResponse<Company>>;
  getAll(): Promise<ApiResponse<Company[]>>;
  create(company: Omit<Company, "id">): Promise<ApiResponse<Company>>;
  update(id: string, company: Partial<Company>): Promise<ApiResponse<Company>>;
  delete(id: string): Promise<ApiResponse<void>>;
  updateStatus(id: string, status: EntityStatus): Promise<ApiResponse<void>>;
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
    status: EntityStatus
  ): Promise<ApiResponse<void>> {
    return this.httpClient.put(`${this.baseUrl}/${id}/status/${status}`, null);
  }
}
