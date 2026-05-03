import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import { DocumentType, CreateDocumentTypeRequest, UpdateDocumentTypeRequest } from "@/types/documentType";

export class DocumentTypeService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/document-types";
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAll(): Promise<ApiResponse<DocumentType[]>> {
    return this.httpClient.get<DocumentType[]>(this.baseUrl);
  }

  async getById(id: string): Promise<ApiResponse<DocumentType>> {
    return this.httpClient.get<DocumentType>(`${this.baseUrl}/${id}`);
  }

  async create(request: CreateDocumentTypeRequest): Promise<ApiResponse<DocumentType>> {
    return this.httpClient.post<DocumentType>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateDocumentTypeRequest): Promise<ApiResponse<DocumentType>> {
    return this.httpClient.put<DocumentType>(`${this.baseUrl}/${id}`, request);
  }

  async deactivate(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }
}
