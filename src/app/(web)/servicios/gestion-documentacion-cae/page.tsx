// app/servicios/gestion-documentacion-cae/page.tsx
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Validación Documental PRL y CAE con IA",
  description:
    "Solicita y valida documentación PRL automáticamente. Control de accesos y registro en planta para pymes manufactureras.",
  alternates: { canonical: "/servicios/gestion-documentacion-cae" },
  openGraph: {
    title: "Validación Documental PRL y CAE con IA | PlayCAE",
    url: "https://playcae.com/servicios/gestion-documentacion-cae",
  },
};

export default function ServicioCAE() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Gestión de documentación CAE y validación PRL con IA",
    provider: {
      "@type": "Organization",
      name: "PlayCAE",
      url: "https://playcae.com",
    },
    areaServed: "ES",
    audience: {
      "@type": "BusinessAudience",
      name: "Pymes manufactureras",
      industry: "Manufactura",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold">
        Validación documental PRL y CAE con IA
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Automatiza la solicitud y validación de documentación PRL a contratas y
        trabajadores, con trazabilidad y alertas.
      </p>
      {/* ...tu contenido de secciones... */}
      <Script
        id="ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
    </main>
  );
}
