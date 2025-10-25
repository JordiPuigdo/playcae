// app/contacto/gracias/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gracias por contactar",
  description:
    "Hemos recibido tu solicitud. Te responderemos en menos de 24 horas.",
  alternates: { canonical: "/contacto/gracias" },
  robots: { index: false, follow: true }, // normalmente no index
};

export default function GraciasPage() {
  return (
    <main className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-brandPrimary">
        ¡Gracias!
      </h1>
      <p className="mt-3 text-muted-foreground">
        Hemos recibido tu mensaje y te responderemos en menos de 24 horas.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brandPrimary px-6 py-3 text-white hover:opacity-90"
        >
          Volver al inicio
        </Link>
        <Link
          href="/servicios/gestion-documentacion-cae"
          className="rounded-full border px-6 py-3 hover:bg-brandAccent"
        >
          Ver servicios
        </Link>
      </div>
      {/* Aquí dispara tu event GA4 de conversión si usas gtag/Tag Manager */}
    </main>
  );
}
