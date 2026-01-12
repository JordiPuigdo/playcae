import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";
import {
  AccessValidationRequest,
  AccessValidationResult,
  CheckInRequest,
  CheckOutRequest,
  AccessRecord,
  AccessRecordFilter,
  AccessRecordPagedResult,
} from "@/types/accessHistory";

export interface IAccessService {
  validateAccess(
    request: AccessValidationRequest
  ): Promise<ApiResponse<AccessValidationResult>>;
  checkIn(request: CheckInRequest): Promise<ApiResponse<AccessRecord>>;
  checkOut(request: CheckOutRequest): Promise<ApiResponse<AccessRecord>>;
  getById(id: string): Promise<ApiResponse<AccessRecord>>;
  getFiltered(
    filter: AccessRecordFilter
  ): Promise<ApiResponse<AccessRecordPagedResult>>;
  getWorkerHistory(
    workerId: string,
    limit?: number
  ): Promise<ApiResponse<AccessRecord[]>>;
  getDeniedAccess(
    filter: AccessRecordFilter
  ): Promise<ApiResponse<AccessRecordPagedResult>>;
  getByAccessCompany(
    accessCompanyId: string,
    fromDate?: string,
    toDate?: string,
    page?: number,
    pageSize?: number
  ): Promise<ApiResponse<AccessRecordPagedResult>>;
}

export class AccessService implements IAccessService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/access";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async validateAccess(
    request: AccessValidationRequest
  ): Promise<ApiResponse<AccessValidationResult>> {
    return this.httpClient.post<AccessValidationResult>(
      `${this.baseUrl}/validate`,
      request
    );
  }

  async checkIn(request: CheckInRequest): Promise<ApiResponse<AccessRecord>> {
    return this.httpClient.post<AccessRecord>(
      `${this.baseUrl}/checkin`,
      request
    );
  }

  async checkOut(request: CheckOutRequest): Promise<ApiResponse<AccessRecord>> {
    return this.httpClient.post<AccessRecord>(
      `${this.baseUrl}/checkout`,
      request
    );
  }

  async getById(id: string): Promise<ApiResponse<AccessRecord>> {
    return this.httpClient.get<AccessRecord>(`${this.baseUrl}/${id}`);
  }

  async getFiltered(
    filter: AccessRecordFilter
  ): Promise<ApiResponse<AccessRecordPagedResult>> {
    const params = new URLSearchParams();

    if (filter.accessCompanyId)
      params.append("accessCompanyId", filter.accessCompanyId);
    if (filter.workerCompanyId)
      params.append("workerCompanyId", filter.workerCompanyId);
    if (filter.workerId) params.append("workerId", filter.workerId);
    if (filter.searchTerm) params.append("searchTerm", filter.searchTerm);
    if (filter.fromDate) params.append("fromDate", filter.fromDate);
    if (filter.toDate) params.append("toDate", filter.toDate);
    if (filter.onlyDenied !== undefined)
      params.append("onlyDenied", String(filter.onlyDenied));
    if (filter.onlyActive !== undefined)
      params.append("onlyActive", String(filter.onlyActive));
    if (filter.page) params.append("page", String(filter.page));
    if (filter.pageSize) params.append("pageSize", String(filter.pageSize));

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

    return this.httpClient.get<AccessRecordPagedResult>(url);
  }

  async getWorkerHistory(
    workerId: string,
    limit: number = 50
  ): Promise<ApiResponse<AccessRecord[]>> {
    return this.httpClient.get<AccessRecord[]>(
      `${this.baseUrl}/worker/${workerId}/history?limit=${limit}`
    );
  }

  async getDeniedAccess(
    filter: AccessRecordFilter
  ): Promise<ApiResponse<AccessRecordPagedResult>> {
    return this.getFiltered({ ...filter, onlyDenied: true });
  }

  async getByAccessCompany(
    accessCompanyId: string,
    fromDate?: string,
    toDate?: string,
    page: number = 1,
    pageSize: number = 50
  ): Promise<ApiResponse<AccessRecordPagedResult>> {
    const params = new URLSearchParams();
    if (fromDate) params.append("fromDate", fromDate);
    if (toDate) params.append("toDate", toDate);
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    return this.httpClient.get<AccessRecordPagedResult>(
      `${this.baseUrl}/company/${accessCompanyId}?${params.toString()}`
    );
  }
}
