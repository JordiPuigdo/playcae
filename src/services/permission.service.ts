import { ApiResponse } from "@/interfaces/api-response";
import { Permission } from "@/types/role";
import { HttpClient } from "./http-client";

export class PermissionService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/permissions";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAll(): Promise<ApiResponse<Permission[]>> {
    return this.httpClient.get<Permission[]>(this.baseUrl);
  }
}
