import { ApiResponse } from "@/interfaces/api-response";
import { UserConfiguration, UserLogoGetResponse } from "@/types/userConfiguration";
import { HttpClient } from "./http-client";

export interface IUserConfigurationService {
  getByUserId(userId: string): Promise<ApiResponse<UserConfiguration>>;
  uploadLogo(
    userId: string,
    file: File,
  ): Promise<ApiResponse<UserConfiguration>>;
  updateLogo(
    userId: string,
    file: File,
  ): Promise<ApiResponse<UserConfiguration>>;
  deleteLogo(userId: string): Promise<ApiResponse<void>>;
  getLogoUrl(userId: string): Promise<ApiResponse<UserLogoGetResponse>>;
}

export class UserConfigurationService implements IUserConfigurationService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/userconfiguration";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getByUserId(userId: string): Promise<ApiResponse<UserConfiguration>> {
    return this.httpClient.get<UserConfiguration>(`${this.baseUrl}/${userId}`);
  }

  async uploadLogo(
    userId: string,
    file: File,
  ): Promise<ApiResponse<UserConfiguration>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.httpClient.upload<UserConfiguration>(
      `${this.baseUrl}/${userId}/logo`,
      formData,
    );
  }

  async updateLogo(
    userId: string,
    file: File,
  ): Promise<ApiResponse<UserConfiguration>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.httpClient.put<UserConfiguration>(
      `${this.baseUrl}/${userId}/logo`,
      formData,
    );
  }

  async deleteLogo(userId: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${userId}/logo`);
  }

  async getLogoUrl(userId: string): Promise<ApiResponse<UserLogoGetResponse>> {
    return this.httpClient.get<UserLogoGetResponse>(`${this.baseUrl}/${userId}/logo`);
  }
}
