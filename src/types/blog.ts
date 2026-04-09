export type BlogStatus = "Draft" | "Published" | "Archived";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  coverImage?: string;
  status: BlogStatus;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateBlogPostData = Omit<
  BlogPost,
  "id" | "createdAt" | "updatedAt" | "publishedAt"
>;

export type UpdateBlogPostData = Partial<CreateBlogPostData>;
