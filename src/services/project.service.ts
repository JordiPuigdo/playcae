import { ApiResponse } from "@/interfaces/api-response";
import {
  AssignCompanyToProjectData,
  CreateProjectData,
  Project,
  ProjectCompanyAssignment,
  ProjectList,
  UpdateProjectData,
} from "@/types/project";
import { HttpClient } from "./http-client";

export class ProjectService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/projects";

  constructor(private readonly httpClient: HttpClient) {}

  async getById(id: string): Promise<ApiResponse<Project>> {
    return this.httpClient.get<Project>(`${this.baseUrl}/${id}`);
  }

  async getAllByAdmin(adminUserId: string): Promise<ApiResponse<ProjectList[]>> {
    return this.httpClient.get<ProjectList[]>(
      `${this.baseUrl}/admin/${adminUserId}`
    );
  }

  async create(data: CreateProjectData): Promise<ApiResponse<Project>> {
    return this.httpClient.post<Project>(this.baseUrl, data);
  }

  async update(id: string, data: UpdateProjectData): Promise<ApiResponse<Project>> {
    return this.httpClient.put<Project>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async close(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}/close`, null);
  }

  async cancel(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}/cancel`, null);
  }

  async getAssignments(projectId: string): Promise<ApiResponse<ProjectCompanyAssignment[]>> {
    return this.httpClient.get<ProjectCompanyAssignment[]>(
      `${this.baseUrl}/${projectId}/assignments`
    );
  }

  async assignCompany(
    projectId: string,
    data: AssignCompanyToProjectData
  ): Promise<ApiResponse<ProjectCompanyAssignment[]>> {
    return this.httpClient.post<ProjectCompanyAssignment[]>(
      `${this.baseUrl}/${projectId}/assignments`,
      data
    );
  }

  async removeCompany(
    projectId: string,
    companyId: string
  ): Promise<ApiResponse<void>> {
    return this.httpClient.delete(
      `${this.baseUrl}/${projectId}/assignments/${companyId}`
    );
  }

  async countCompaniesToRelease(projectId: string): Promise<ApiResponse<number>> {
    return this.httpClient.get<number>(
      `${this.baseUrl}/${projectId}/companies-to-release`
    );
  }

  async getActiveByCompany(
    adminUserId: string,
    companyId: string
  ): Promise<ApiResponse<ProjectList[]>> {
    return this.httpClient.get<ProjectList[]>(
      `${this.baseUrl}/company/${companyId}/active?adminUserId=${adminUserId}`
    );
  }
}
