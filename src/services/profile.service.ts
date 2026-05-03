import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  CreateProfileRequest,
  Profile,
  UpdateProfileRequest,
} from "@/types/profile";

export class ProfileService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/profiles";
  private readonly httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getGlobal(): Promise<ApiResponse<Profile[]>> {
    return this.httpClient.get<Profile[]>(`${this.baseUrl}/global`);
  }

  async getGlobalCompanyProfiles(): Promise<ApiResponse<Profile[]>> {
    return this.httpClient.get<Profile[]>(`${this.baseUrl}/global/company`);
  }

  async getAccessible(companyId: string): Promise<ApiResponse<Profile[]>> {
    return this.httpClient.get<Profile[]>(`${this.baseUrl}?companyId=${companyId}`);
  }

  async getCompanyProfiles(companyId: string): Promise<ApiResponse<Profile[]>> {
    return this.httpClient.get<Profile[]>(`${this.baseUrl}/companies/${companyId}`);
  }

  async selfAssignToCompany(companyId: string, profileId: string): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(
      `${this.baseUrl}/companies/${companyId}/self-assign/${profileId}`,
      {}
    );
  }

  async switchGlobalProfile(companyId: string, profileId: string): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(
      `${this.baseUrl}/companies/${companyId}/global-profile/${profileId}`,
      {}
    );
  }

  async getById(id: string): Promise<ApiResponse<Profile>> {
    return this.httpClient.get<Profile>(`${this.baseUrl}/${id}`);
  }

  async create(request: CreateProfileRequest): Promise<ApiResponse<Profile>> {
    return this.httpClient.post<Profile>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateProfileRequest): Promise<ApiResponse<Profile>> {
    return this.httpClient.put<Profile>(`${this.baseUrl}/${id}`, request);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async addDocumentType(profileId: string, documentTypeId: string): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(
      `${this.baseUrl}/${profileId}/document-types/${documentTypeId}`,
      {}
    );
  }

  async removeDocumentType(profileId: string, documentTypeId: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(
      `${this.baseUrl}/${profileId}/document-types/${documentTypeId}`
    );
  }
}
