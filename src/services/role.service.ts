import { ApiResponse } from "@/interfaces/api-response";
import {
  CreateRoleRequest,
  Role,
  UpdateRoleRequest,
  WorkerRoles,
} from "@/types/role";
import { HttpClient } from "./http-client";

export class RoleService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/roles";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async getAll(): Promise<ApiResponse<Role[]>> {
    return this.httpClient.get<Role[]>(this.baseUrl);
  }

  async getById(id: string): Promise<ApiResponse<Role>> {
    return this.httpClient.get<Role>(`${this.baseUrl}/${id}`);
  }

  async create(request: CreateRoleRequest): Promise<ApiResponse<Role>> {
    return this.httpClient.post<Role>(this.baseUrl, request);
  }

  async update(id: string, request: UpdateRoleRequest): Promise<ApiResponse<Role>> {
    return this.httpClient.put<Role>(`${this.baseUrl}/${id}`, request);
  }

  async remove(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async assign(workerId: string, roleId: string): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(`${this.baseUrl}/assign`, { workerId, roleId });
  }

  async unassign(workerId: string, roleId: string): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(`${this.baseUrl}/unassign`, { workerId, roleId });
  }

  async getWorkerRoles(workerId: string): Promise<ApiResponse<WorkerRoles>> {
    return this.httpClient.get<WorkerRoles>(`${this.baseUrl}/worker/${workerId}`);
  }
}
