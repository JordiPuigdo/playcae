import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";

export interface RefreshTokenResponse {
  accessToken: string;
  refreshTokenExpiryTime: string;
}

export class RefreshService {
  private readonly url =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/auth/refresh";
  private readonly httpClient = new HttpClient("", true);

  async refresh(): Promise<ApiResponse<RefreshTokenResponse> | undefined> {
    try {
      return await this.httpClient.post<RefreshTokenResponse>(this.url, {});
    } catch {
      return undefined;
    }
  }
}
