import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export class PasswordService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/auth";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient("", true);
  }

  async forgot(request: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(`${this.baseUrl}/forgot-password`, request);
  }

  async reset(request: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(`${this.baseUrl}/reset-password`, request);
  }
}
