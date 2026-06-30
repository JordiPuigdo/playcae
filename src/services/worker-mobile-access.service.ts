import { ApiResponse } from "@/interfaces/api-response";
import {
  SetWorkerMobileAccessRequest,
  WorkerMobileAccess,
} from "@/types/role";
import { HttpClient } from "./http-client";

export class WorkerMobileAccessService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/workers";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async get(workerId: string): Promise<ApiResponse<WorkerMobileAccess>> {
    return this.httpClient.get<WorkerMobileAccess>(
      `${this.baseUrl}/${workerId}/mobile-access`
    );
  }

  async set(
    workerId: string,
    request: SetWorkerMobileAccessRequest
  ): Promise<ApiResponse<void>> {
    return this.httpClient.put<void>(
      `${this.baseUrl}/${workerId}/mobile-access`,
      request
    );
  }
}
