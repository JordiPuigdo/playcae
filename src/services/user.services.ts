import { ApiResponse } from "@/interfaces/api-response";
import { User } from "@/types/user";
import { HttpClient } from "./http-client";
import { CreateUserRequest, CreateUserResponse } from "@/hooks/useUsers";

export interface IUserService {
  create(user: CreateUserRequest): Promise<ApiResponse<CreateUserResponse>>;
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
}
