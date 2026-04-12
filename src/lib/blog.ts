const API_BASE = process.env.NEXT_PUBLIC_PLAYCAE_API ?? "";

// Shapes del JSON devuelto por el backend (camelCase)
interface BlogPostListDto {
  id?: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  tags: string;           // comma-separated
  coverImageUrl?: string | null;
  published: boolean;
  publishedAt?: string | null;
  readingTimeMinutes: number;
  active?: boolean | null;
  creationDate?: string | null;
}

interface BlogPostDto extends BlogPostListDto {
  content: string;
}

interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface WebBlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  content: string;
}

export type WebBlogPostMeta = Omit<WebBlogPost, "content">;

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

function toMeta(p: BlogPostListDto): WebBlogPostMeta {
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    date: p.publishedAt ?? p.creationDate ?? "",
    author: p.author || "PlayCAE",
    tags: parseTags(p.tags),
    coverImage: p.coverImageUrl ?? undefined,
    readingTime: p.readingTimeMinutes,
  };
}

export async function getAllPublishedPosts(): Promise<WebBlogPostMeta[]> {
  try {
    const res = await fetch(`${API_BASE}/api/blog`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];

    const data: PagedResult<BlogPostListDto> = await res.json();
    return (data.items ?? [])
      .map(toMeta)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getPostBySlug(
  slug: string
): Promise<WebBlogPost | null> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const p: BlogPostDto = await res.json();
    return { ...toMeta(p), content: p.content };
  } catch {
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const posts = await getAllPublishedPosts();
  return posts.map((p) => p.slug);
}
