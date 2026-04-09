import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url: `https://www.playcae.com/blog/${slug}`,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      ...(post.coverImage && {
        images: [{ url: `https://www.playcae.com${post.coverImage}` }],
      }),
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: {
      "@type": "Organization",
      name: "PlayCAE",
      url: "https://www.playcae.com",
    },
    url: `https://www.playcae.com/blog/${slug}`,
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

          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-b border-border py-4">
            <span>{post.author}</span>
            <span>·</span>
            <time dateTime={post.date}>{formattedDate}</time>
            <span>·</span>
            <span>{post.readingTime} min de lectura</span>
          </div>
        </header>

        {/* MDX Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:text-foreground prose-a:text-brandPrimary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground prose-th:text-foreground">
          <MDXRemote source={post.content} />
        </div>

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
    </>
  );
}
