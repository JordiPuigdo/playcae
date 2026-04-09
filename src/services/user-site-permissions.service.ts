import { ApiResponse } from "@/interfaces/api-response";
import { Site } from "@/types/site";
import {
  CreateUserSitePermissionRequest,
  UserSitePermission,
} from "@/types/userSitePermission";
import { HttpClient } from "./http-client";

export interface IUserSitePermissionsService {
  create(
    request: CreateUserSitePermissionRequest
  ): Promise<ApiResponse<UserSitePermission>>;
  remove(id: string): Promise<ApiResponse<void>>;
  getByUserId(userId: string): Promise<ApiResponse<UserSitePermission[]>>;
  getBySiteId(siteId: string): Promise<ApiResponse<UserSitePermission[]>>;
  getSitesByUserId(userId: string): Promise<ApiResponse<Site[]>>;
}

export class UserSitePermissionsService implements IUserSitePermissionsService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/user-site-permissions";
  private readonly usersBaseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/users";

  constructor(private readonly httpClient: HttpClient) {}

  async create(
    request: CreateUserSitePermissionRequest
  ): Promise<ApiResponse<UserSitePermission>> {
    return this.httpClient.post<UserSitePermission>(this.baseUrl, request);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getByUserId(userId: string): Promise<ApiResponse<UserSitePermission[]>> {
    return this.httpClient.get<UserSitePermission[]>(`${this.baseUrl}/user/${userId}`);
  }

  async getBySiteId(siteId: string): Promise<ApiResponse<UserSitePermission[]>> {
    return this.httpClient.get<UserSitePermission[]>(`${this.baseUrl}/site/${siteId}`);
  }

  async getSitesByUserId(userId: string): Promise<ApiResponse<Site[]>> {
    return this.httpClient.get<Site[]>(`${this.usersBaseUrl}/${userId}/sites`);
  }
}
