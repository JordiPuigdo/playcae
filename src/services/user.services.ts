import { ApiResponse } from "@/interfaces/api-response";
import { Site } from "@/types/site";
import { UserManagementItem } from "@/types/userSitePermission";
import { HttpClient } from "./http-client";
import { CreateUserRequest, CreateUserResponse } from "@/hooks/useUsers";

export interface CreatePrlUserRequest {
  email: string;
  password: string;
}

export interface IUserService {
  create(user: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>>;
  getAll(): Promise<ApiResponse<UserManagementItem[]>>;
  getPrlByAdmin(adminUserId: string): Promise<ApiResponse<UserManagementItem[]>>;
  createPrl(
    adminUserId: string,
    request: CreatePrlUserRequest
  ): Promise<ApiResponse<UserManagementItem>>;
  getSitesByUserId(userId: string): Promise<ApiResponse<Site[]>>;
}

export class UserService implements IUserService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/Users";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async create(
    user: CreateUserRequest
  ): Promise<ApiResponse<CreateUserResponse>> {
    return this.httpClient.post<CreateUserResponse>(this.baseUrl, user);
  }

  async getAll(): Promise<ApiResponse<UserManagementItem[]>> {
    return this.httpClient.get<UserManagementItem[]>(this.baseUrl);
  }

  async getPrlByAdmin(adminUserId: string): Promise<ApiResponse<UserManagementItem[]>> {
    return this.httpClient.get<UserManagementItem[]>(
      `${this.baseUrl}/admin/${adminUserId}/prl`
    );
  }

  async createPrl(
    adminUserId: string,
    request: CreatePrlUserRequest
  ): Promise<ApiResponse<UserManagementItem>> {
    return this.httpClient.post<UserManagementItem>(
      `${this.baseUrl}/admin/${adminUserId}/prl`,
      request
    );
  }

  async getSitesByUserId(userId: string): Promise<ApiResponse<Site[]>> {
    return this.httpClient.get<Site[]>(`${this.baseUrl}/${userId}/sites`);
  }
}
