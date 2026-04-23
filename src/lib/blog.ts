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
  coverImageAlt?: string | null;
  published: boolean;
  publishedAt?: string | null;
  readingTimeMinutes: number;
  updatedAt?: string | null;
  active?: boolean | null;
  creationDate?: string | null;
  seoTitle?: string | null;
  canonicalUrl?: string | null;
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
  updatedAt?: string;
  author: string;
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  readingTime: number;
  content: string;
  seoTitle?: string;
  canonicalUrl?: string;
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
    updatedAt: p.updatedAt ?? undefined,
    author: p.author || "PlayCAE",
    tags: parseTags(p.tags),
    coverImage: p.coverImageUrl ?? undefined,
    coverImageAlt: p.coverImageAlt ?? undefined,
    readingTime: p.readingTimeMinutes,
    seoTitle: p.seoTitle ?? undefined,
    canonicalUrl: p.canonicalUrl ?? undefined,
  };
}

// Fetches all published posts handling pagination (API max 50/page)
export async function getAllPublishedPosts(): Promise<WebBlogPostMeta[]> {
  const all: WebBlogPostMeta[] = [];
  let page = 1;
  const pageSize = 50;

  console.log("[blog] API_BASE:", API_BASE);

  try {
    while (true) {
      const url = `${API_BASE}/api/blog?page=${page}&pageSize=${pageSize}`;
      console.log("[blog] fetching:", url);

      const res = await fetch(url, { next: { revalidate: 3600, tags: ["blog"] } });
      console.log("[blog] response status:", res.status, res.statusText);

      if (!res.ok) {
        const body = await res.text().catch(() => "(no body)");
        console.error("[blog] error body:", body);
        break;
      }

      const data: PagedResult<BlogPostListDto> = await res.json();
      console.log("[blog] data recibida:", JSON.stringify(data, null, 2));
      const items = data.items ?? [];
      all.push(...items.map(toMeta));

      if (all.length >= data.total || items.length < pageSize) break;
      page++;
    }
  } catch (err) {
    console.error("[blog] excepción en fetch:", err);
  }

  return all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getPostBySlug(
  slug: string
): Promise<WebBlogPost | null> {
  try {
    const res = await fetch(`${API_BASE}/api/blog/${slug}`, {
      next: { revalidate: 3600, tags: ["blog", `blog-${slug}`] },
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
