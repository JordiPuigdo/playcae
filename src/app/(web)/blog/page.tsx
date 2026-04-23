import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getAllPublishedPosts } from "@/lib/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog sobre CAE y PRL",
  description:
    "Empieza aquí: guías y recursos sobre documentación CAE, validación PRL con IA y control de accesos en fábrica.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndex() {
  const posts = await getAllPublishedPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog PlayCAE",
    url: "https://www.playcae.com/blog",
    description:
      "Guías y recursos sobre CAE, PRL y control de accesos para pymes manufactureras en España.",
  };

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-brandPrimary">
          Blog de PlayCAE
        </h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Contenido práctico para automatizar la CAE, validar PRL con IA y
          controlar accesos en planta. Publicamos guías, checklists y
          plantillas.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Próximamente, nuevos artículos.</p>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => {
            const formattedDate = new Date(post.date).toLocaleDateString(
              "es-ES",
              { year: "numeric", month: "long", day: "numeric" }
            );

            return (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col h-full rounded-xl border border-border p-6 hover:border-brandPrimary transition-colors"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-medium px-2 py-0.5 rounded-full bg-brandPrimary/10 text-brandPrimary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-semibold text-foreground group-hover:text-brandPrimary transition-colors mb-2">
                    {post.title}
                  </h2>

                  <p className="text-sm text-muted-foreground flex-1 mb-4 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                    <time dateTime={post.date}>{formattedDate}</time>
                    <span>·</span>
                    <span>{post.readingTime} min</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Script
        id="ld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  );
}
