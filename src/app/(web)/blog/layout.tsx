// app/blog/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Blog sobre CAE y PRL",
    template: "%s | Blog PlayCAE",
  },
  description:
    "Guías, plantillas y mejores prácticas para gestionar CAE, validar PRL y controlar accesos en fábrica.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: "https://playcae.com/blog",
    title: "Blog | PlayCAE",
    description:
      "Contenido práctico sobre CAE, PRL y control de accesos para pymes manufactureras.",
  },
  robots: { index: true, follow: true },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="container mx-auto px-4 py-16">{children}</main>;
}
