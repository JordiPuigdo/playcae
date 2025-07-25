import { ApiResponse } from "@/interfaces/api-response";
import { User } from "@/types/user";
import { HttpClient } from "./http-client";

export interface IUserService {
  create(user: Omit<User, "id">): Promise<ApiResponse<User>>;
}

export class UserService implements IUserService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/workers";
  private httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }

  async create(user: Omit<User, "id">): Promise<ApiResponse<User>> {
    return this.httpClient.post<User>(this.baseUrl, user);
  }
}
