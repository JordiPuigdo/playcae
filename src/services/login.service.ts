import { User, UserLoginResponse } from "@/types/user";
import { HttpClient } from "./http-client";
import { ApiResponse } from "@/interfaces/api-response";

export interface ILoginService {
  login(
    email: string,
    password: string
  ): Promise<ApiResponse<User> | undefined>;
}

export class LoginService implements ILoginService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/auth/login";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<UserLoginResponse> | undefined> {
    return this.httpClient.post<UserLoginResponse>(this.baseUrl, {
      email,
      password,
    });
  }
}
