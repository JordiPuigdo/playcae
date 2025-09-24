import { ApiResponse } from "@/interfaces/api-response";
import { Worker } from "@/types/worker";
import { HttpClient } from "./http-client";

export interface IWorkerService {
  create(worker: Omit<Worker, "id">): Promise<ApiResponse<Worker>>;
  getByCompanyId(companyId: string): Promise<ApiResponse<Worker[]>>;
  createBulk(
    companyId: string,
    workers: Omit<Worker, "id">[]
  ): Promise<ApiResponse<Worker[]>>;
  getByCompanyId(companyId: string): Promise<ApiResponse<Worker[]>>;
  getById(id: string): Promise<ApiResponse<Worker>>;
  update(id: string, worker: Partial<Worker>): Promise<ApiResponse<Worker>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

export class WorkerService implements IWorkerService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/workers";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async create(worker: Omit<Worker, "id">): Promise<ApiResponse<Worker>> {
    return this.httpClient.post<Worker>(this.baseUrl, worker);
  }

  async getByCompanyId(companyId: string): Promise<ApiResponse<Worker[]>> {
    return this.httpClient.get<Worker[]>(
      `${this.baseUrl}/company/${companyId}`
    );
  }
  async createBulk(
    companyId: string,
    workers: Omit<Worker, "id">[]
  ): Promise<ApiResponse<Worker[]>> {
    return this.httpClient.post<Worker[]>(
      `${this.baseUrl}/bulk/${companyId}`,
      workers
    );
  }

  async getById(id: string): Promise<ApiResponse<Worker>> {
    return this.httpClient.get<Worker>(`${this.baseUrl}/${id}`);
  }

  async update(
    id: string,
    worker: Partial<Worker>
  ): Promise<ApiResponse<Worker>> {
    return this.httpClient.put<Worker>(`${this.baseUrl}/${id}`, worker);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async activate(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(`${this.baseUrl}/${id}/activate`, {});
  }
}
