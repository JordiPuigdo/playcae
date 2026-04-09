import { ApiResponse } from "@/interfaces/api-response";
import {
  BlogPost,
  BlogStatus,
  CreateBlogPostData,
  UpdateBlogPostData,
} from "@/types/blog";
import { HttpClient } from "./http-client";

interface BlogApiPostDto {
  id?: string;
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  author?: string;
  tags?: string | string[] | null;
  coverImageUrl?: string | null;
  coverImage?: string | null;
  published?: boolean;
  active?: boolean | null;
  publishedAt?: string | null;
  creationDate?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

interface BlogApiPagedResult<T> {
  items?: T[];
  Items?: T[];
}

export class BlogService {
  private readonly baseUrl =
    process.env.NEXT_PUBLIC_PLAYCAE_API + "/api/blog";

  constructor(private readonly httpClient: HttpClient) {}

  async getAll(): Promise<ApiResponse<BlogPost[]>> {
    const response = await this.httpClient.get<
      BlogApiPagedResult<BlogApiPostDto> | BlogApiPostDto[]
    >(`${this.baseUrl}/all`);

    const items = this.extractItems(response.data).map((post) =>
      this.mapApiPostToBlogPost(post)
    );

    return {
      status: response.status,
      data: items,
    };
  }

  async getById(id: string): Promise<ApiResponse<BlogPost>> {
    const response = await this.httpClient.get<BlogApiPostDto>(
      `${this.baseUrl}/admin/${id}`
    );

    return {
      status: response.status,
      data: this.mapApiPostToBlogPost(response.data),
    };
  }

  async create(data: CreateBlogPostData): Promise<ApiResponse<BlogPost>> {
    const response = await this.httpClient.post<BlogApiPostDto>(
      this.baseUrl,
      this.toApiPayload(data)
    );

    return {
      status: response.status,
      data: this.mapApiPostToBlogPost(response.data),
    };
  }

  async update(
    id: string,
    data: UpdateBlogPostData
  ): Promise<ApiResponse<BlogPost>> {
    const response = await this.httpClient.put<BlogApiPostDto>(
      `${this.baseUrl}/${id}`,
      this.toApiPayload(data)
    );

    return {
      status: response.status,
      data: this.mapApiPostToBlogPost(response.data),
    };
  }

  async delete(id: string): Promise<ApiResponse<void>> {
    return this.httpClient.delete(`${this.baseUrl}/${id}`);
  }

  async publish(id: string): Promise<ApiResponse<BlogPost>> {
    const response = await this.httpClient.put<BlogApiPostDto>(
      `${this.baseUrl}/${id}/publish`,
      null
    );

    return {
      status: response.status,
      data: this.mapApiPostToBlogPost(response.data),
    };
  }

  async unpublish(id: string): Promise<ApiResponse<BlogPost>> {
    const response = await this.httpClient.put<BlogApiPostDto>(
      `${this.baseUrl}/${id}/unpublish`,
      null
    );

    return {
      status: response.status,
      data: this.mapApiPostToBlogPost(response.data),
    };
  }

  private extractItems(
    data: BlogApiPagedResult<BlogApiPostDto> | BlogApiPostDto[]
  ): BlogApiPostDto[] {
    if (Array.isArray(data)) {
      return data;
    }

    if (!data || typeof data !== "object") {
      return [];
    }

    const items = data.items ?? data.Items;
    return Array.isArray(items) ? items : [];
  }

  private mapApiPostToBlogPost(post: BlogApiPostDto): BlogPost {
    const createdAt =
      post.creationDate ??
      post.createdAt ??
      post.updatedAt ??
      new Date().toISOString();

    const updatedAt = post.updatedAt ?? createdAt;

    return {
      id: post.id ?? "",
      title: post.title ?? "",
      slug: post.slug ?? "",
      description: post.description ?? "",
      content: post.content ?? "",
      author: post.author ?? "PlayCAE",
      tags: this.parseTags(post.tags),
      coverImage: post.coverImageUrl ?? post.coverImage ?? undefined,
      status: this.resolveStatus(post.published, post.active),
      publishedAt: post.publishedAt ?? undefined,
      createdAt,
      updatedAt,
    };
  }

  private parseTags(tags: string | string[] | null | undefined): string[] {
    if (Array.isArray(tags)) {
      return tags
        .map((tag) => tag?.trim())
        .filter((tag): tag is string => Boolean(tag));
    }

    if (typeof tags !== "string") {
      return [];
    }

    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  private resolveStatus(
    published: boolean | undefined,
    active: boolean | null | undefined
  ): BlogStatus {
    if (active === false) return "Archived";
    return published ? "Published" : "Draft";
  }

  private toApiPayload(
    data: Partial<CreateBlogPostData>
  ): Record<string, unknown> {
    const payload: Record<string, unknown> = {};

    if (typeof data.title === "string") payload.title = data.title;
    if (typeof data.slug === "string") payload.slug = data.slug;
    if (typeof data.description === "string")
      payload.description = data.description;
    if (typeof data.content === "string") payload.content = data.content;
    if (typeof data.author === "string") payload.author = data.author;
    if (Array.isArray(data.tags)) payload.tags = data.tags.join(",");
    if (typeof data.coverImage === "string")
      payload.coverImageUrl = data.coverImage;

    return payload;
  }
}
