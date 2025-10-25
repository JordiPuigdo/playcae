// app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Blog sobre CAE y PRL",
  description:
    "Empieza aquí: guías y recursos sobre documentación CAE, validación PRL con IA y control de accesos en fábrica.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog PlayCAE",
    url: "https://playcae.com/blog",
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

      <ul className="grid gap-6 md:grid-cols-2">
        {/* Aquí irían los posts del blog, por ejemplo: */}
      </ul>

      <Script
        id="ld-blog"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    </>
  );
}
