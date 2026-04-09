import { ApiResponse } from "@/interfaces/api-response";
import {
  BlogPost,
  CreateBlogPostData,
  UpdateBlogPostData,
} from "@/types/blog";
import { HttpClient } from "./http-client";

export class BlogService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/blog";

  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<ApiResponse<BlogPost[]>> {
    return this.httpClient.get<BlogPost[]>(`${this.baseUrl}/all`);
  }

  async getById(id: string): Promise<ApiResponse<BlogPost>> {
    return this.httpClient.get<BlogPost>(`${this.baseUrl}/${id}`);
  }

  async create(data: CreateBlogPostData): Promise<ApiResponse<BlogPost>> {
    return this.httpClient.post<BlogPost>(this.baseUrl, data);
  }

  async update(
    id: string,
    data: UpdateBlogPostData
  ): Promise<ApiResponse<BlogPost>> {
    return this.httpClient.put<BlogPost>(`${this.baseUrl}/${id}`, data);
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async publish(id: string): Promise<ApiResponse<BlogPost>> {
    return this.httpClient.put<BlogPost>(`${this.baseUrl}/${id}/publish`, null);
  }

  async unpublish(id: string): Promise<ApiResponse<BlogPost>> {
    return this.httpClient.put<BlogPost>(
      `${this.baseUrl}/${id}/unpublish`,
      null
    );
  }
}
