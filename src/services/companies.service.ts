import { ApiResponse } from "@/interfaces/api-response";
import {
  Company,
  CompanySimple,
  CompanyStatus,
  CompanyType,
  CreateSubcontractorData,
  ParentCompanyInfo,
} from "@/types/company";
import { HttpClient } from "./http-client";

export interface ICompanyService {
  getById(id: string): Promise<ApiResponse<Company>>;
  getAll(): Promise<ApiResponse<Company[]>>;
  create(company: Omit<Company, "id">): Promise<ApiResponse<Company>>;
  update(id: string, company: Partial<Company>): Promise<ApiResponse<Company>>;
  delete(id: string): Promise<ApiResponse<void>>;
  updateStatus(id: string, status: CompanyStatus): Promise<ApiResponse<void>>;
  activate(companyId: string, userId: string): Promise<ApiResponse<void>>;
  deactivate(companyId: string, userId: string): Promise<ApiResponse<void>>;
  updateType(id: string, type: CompanyType): Promise<ApiResponse<void>>;
  toggleInternalPrevention(id: string, hasInternalPrevention: boolean): Promise<ApiResponse<void>>;
  getByUserId(userId: string): Promise<ApiResponse<Company[]>>;
  // Subcontratas
  getSubcontractors(companyId: string): Promise<ApiResponse<CompanySimple[]>>;
  getAllSubcontractorsRecursive(
    companyId: string
  ): Promise<ApiResponse<CompanySimple[]>>;
  createSubcontractor(
    parentCompanyId: string,
    data: CreateSubcontractorData
  ): Promise<ApiResponse<Company>>;
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

  // ============ SUBCONTRATAS ============

  /**
   * Obtiene las subcontratas directas de una empresa
   */
  async getSubcontractors(
    companyId: string
  ): Promise<ApiResponse<CompanySimple[]>> {
    return this.httpClient.get<CompanySimple[]>(
      `${this.baseUrl}/${companyId}/subcontractors`
    );
  }

  /**
   * Obtiene todas las subcontratas de forma recursiva (multinivel)
   */
  async getAllSubcontractorsRecursive(
    companyId: string
  ): Promise<ApiResponse<CompanySimple[]>> {
    return this.httpClient.get<CompanySimple[]>(
      `${this.baseUrl}/${companyId}/subcontractors/all`
    );
  }

  /**
   * Crea una subcontrata para una empresa
   */
  async createSubcontractor(
    parentCompanyId: string,
    data: CreateSubcontractorData
  ): Promise<ApiResponse<Company>> {
    return this.httpClient.post<Company>(
      `${this.baseUrl}/${parentCompanyId}/subcontractors`,
      data
    );
  }

  /**
   * Obtiene las empresas padre de una empresa (para proveedores que trabajan con múltiples clientes)
   */
  async getParentCompanies(
    companyId: string
  ): Promise<ApiResponse<ParentCompanyInfo[]>> {
    return this.httpClient.get<ParentCompanyInfo[]>(
      `${this.baseUrl}/${companyId}/parent-companies`
    );
  }

  /**
   * Reenvía el correo de bienvenida a la empresa
   */
  async resendWelcomeEmail(companyId: string): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(
      `${this.baseUrl}/${companyId}/resend-welcome-email`,
      null
    );
  }

  /**
   * Actualiza el tipo de empresa (Empresa / Autónomo)
   */
  async updateType(id: string, type: CompanyType): Promise<ApiResponse<void>> {
    return this.httpClient.put(`${this.baseUrl}/${id}/type/${type}`, null);
  }

  /**
   * Activa o desactiva el servicio de prevención interna.
   * Reconcilia documentos automáticamente en el backend.
   */
  async toggleInternalPrevention(id: string, hasInternalPrevention: boolean): Promise<ApiResponse<void>> {
    return this.httpClient.put(
      `${this.baseUrl}/${id}/internal-prevention/${hasInternalPrevention}`,
      null
    );
  }
}
