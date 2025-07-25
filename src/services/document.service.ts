import { ApiResponse } from "@/interfaces/api-response";

import { HttpClient } from "./http-client";
import { Document, EntityStatus } from "@/types/document";

export interface IDocumentService {
  getById(id: string): Promise<ApiResponse<Document>>;
  getAll(): Promise<ApiResponse<Document[]>>;
  getByCompanyId(companyId: string): Promise<ApiResponse<Document[]>>;
  getByUserId(userId: string): Promise<ApiResponse<Document[]>>;
  create(document: Omit<Document, "id">): Promise<ApiResponse<Document>>;
  update(
    id: string,
    document: Partial<Document>
  ): Promise<ApiResponse<Document>>;
  updateStatus(
    id: string,
    status: EntityStatus
  ): Promise<ApiResponse<Document>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export class DocumentService implements IDocumentService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/documents";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getById(id: string): Promise<ApiResponse<Document>> {
    return this.httpClient.get<Document>(`${this.baseUrl}/${id}`);
  }

  async getAll(): Promise<ApiResponse<Document[]>> {
    return this.httpClient.get<Document[]>(this.baseUrl);
  }

  async getByCompanyId(companyId: string): Promise<ApiResponse<Document[]>> {
    return this.httpClient.get<Document[]>(
      `${this.baseUrl}/company/${companyId}`
    );
  }

  async getByUserId(userId: string): Promise<ApiResponse<Document[]>> {
    return this.httpClient.get<Document[]>(`${this.baseUrl}/user/${userId}`);
  }

  async create(document: Omit<Document, "id">): Promise<ApiResponse<Document>> {
    return this.httpClient.post<Document>(this.baseUrl, document);
  }

  async update(
    id: string,
    document: Partial<Document>
  ): Promise<ApiResponse<Document>> {
    return this.httpClient.put<Document>(`${this.baseUrl}/${id}`, document);
  }

  async updateStatus(
    id: string,
    status: EntityStatus
  ): Promise<ApiResponse<Document>> {
    return this.httpClient.put<Document>(`${this.baseUrl}/${id}/status`, {
      status,
    });
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
