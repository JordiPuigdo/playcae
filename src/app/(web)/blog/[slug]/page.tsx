import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import sanitizeHtml from "sanitize-html";
import { getPostBySlug } from "@/lib/blog";

export const revalidate = 60;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = "https://www.playcae.com";
const OG_DEFAULT = `${BASE_URL}/og-logo.png`;

function toAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const ogImage = post.coverImage
    ? { url: toAbsoluteUrl(post.coverImage), alt: post.coverImageAlt ?? post.title }
    : { url: OG_DEFAULT, alt: post.title };
  const canonicalUrl = post.canonicalUrl
    ? toAbsoluteUrl(post.canonicalUrl)
    : `${BASE_URL}/blog/${slug}`;

  return {
    title: post.seoTitle ?? post.title,
    description: post.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: post.seoTitle ?? post.title,
      description: post.description,
      url: canonicalUrl,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle ?? post.title,
      description: post.description,
      images: [ogImage.url],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  const coverImageAlt = post.coverImageAlt || post.title;
  const canonicalUrl = post.canonicalUrl
    ? toAbsoluteUrl(post.canonicalUrl)
    : `${BASE_URL}/blog/${slug}`;
  const coverImageUrl = post.coverImage ? toAbsoluteUrl(post.coverImage) : undefined;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.seoTitle ?? post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "PlayCAE",
      url: BASE_URL,
    },
    ...(coverImageUrl && {
      image: [
        {
          "@type": "ImageObject",
          url: coverImageUrl,
          caption: coverImageAlt,
        },
      ],
    }),
    url: canonicalUrl,
    ...(post.tags.length > 0 && { articleSection: post.tags[0] }),
    wordCount: post.readingTime * 200,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: `${BASE_URL}/blog` },
      { "@type": "ListItem", position: 2, name: post.title, item: `${BASE_URL}/blog/${slug}` },
    ],
  };

  const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <article className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-brandPrimary transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span>{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-brandPrimary/10 text-brandPrimary"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground mb-6">{post.description}</p>

          {post.coverImage && (
            <div className="mb-6 overflow-hidden rounded-xl border border-border/60">
              <Image
                src={post.coverImage}
                alt={coverImageAlt}
                width={1200}
                height={675}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-b border-border py-4">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>{formattedDate}</time>
            <span>·</span>
            <span>{post.readingTime} min de lectura</span>
          </div>
        </header>

        {/* HTML Content */}
        <div
          className="prose prose-neutral max-w-none prose-headings:text-foreground prose-a:text-brandPrimary prose-a:no-underline hover:prose-a:underline prose-th:text-foreground"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              allowedTags: [
                ...sanitizeHtml.defaults.allowedTags,
                "h1", "h2", "h3", "h4", "h5", "h6",
                "img", "figure", "figcaption",
              ],
              allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "width", "height", "loading"],
                a: ["href", "target", "rel"],
                "*": ["class"],
              },
            }),
          }}
        />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="text-brandPrimary hover:underline text-sm font-medium"
          >
            ← Volver al blog
          </Link>
        </footer>
      </article>

      <Script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
