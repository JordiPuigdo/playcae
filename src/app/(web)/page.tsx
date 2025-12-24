import type { Metadata } from "next";
import Script from "next/script";
import ContactSection from "./components/landing/Contact";
import DocumentationSupported from "./components/landing/DocumentationSupported";
import Hero from "./components/landing/Hero";
import ProblemSolutionSection from "./components/landing/ProblemSolutionSection";
import WhyUs from "./components/landing/WhyUs";
import ComparisonSection from "./components/landing/ComparisonSection";

export const metadata: Metadata = {
  title: "Software CAE y Gestión Documental PRL con IA | PlayCAE",
  description:
    "Plataforma CAE con validación documental PRL automatizada. Ahorra 15h/semana, evita sanciones y cumple RD 171/2004. Alternativa ágil para pymes.",
  keywords: [
    "software CAE",
    "plataforma CAE",
    "software coordinación actividades empresariales",
    "gestión documental PRL",
    "validación documentos PRL",
    "software PRL",
    "coordinación actividades empresariales",
    "CAE online",
    "plataforma gestión CAE",
  ],
  alternates: { canonical: "https://playcae.com" },
  openGraph: {
    type: "website",
    url: "https://playcae.com",
    title: "Software CAE y Gestión Documental PRL | PlayCAE",
    description:
      "La plataforma CAE con IA que automatiza la validación documental PRL. Control de accesos, alertas de caducidad y cumplimiento normativo.",
    siteName: "PlayCAE",
    images: [
      {
        url: "https://playcae.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PlayCAE - Software CAE y Gestión Documental PRL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Software CAE y Gestión Documental PRL | PlayCAE",
    description:
      "Plataforma CAE con validación documental PRL automatizada mediante IA. Ahorra tiempo y evita sanciones.",
  },
  robots: { index: true, follow: true },
};

export default function LandingPage() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PlayCAE",
    url: "https://www.playcae.com",
    logo: "https://www.playcae.com/og-logo.png",
    sameAs: [
      "https://www.facebook.com/profile.php?id=61585276397164",
      "https://www.instagram.com/playcae",
      "https://www.linkedin.com/company/playcae",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        areaServed: "ES",
        availableLanguage: ["es"],
      },
    ],
  };

  const webSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: "https://playcae.com",
    name: "PlayCAE",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://playcae.com/buscar?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqs = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué es un software CAE y para qué sirve?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Un software CAE (Coordinación de Actividades Empresariales) es una plataforma que automatiza la gestión documental PRL entre empresas y subcontratas. Permite validar documentación, controlar accesos y cumplir con el RD 171/2004.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué es la CAE y por qué afecta a mi empresa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La Coordinación de Actividades Empresariales (CAE) obliga a las empresas a gestionar y validar la documentación PRL de contratas y trabajadores según el RD 171/2004. El incumplimiento puede suponer sanciones de hasta 500.000€.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo me ayuda PlayCAE con el control de accesos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PlayCAE registra en tiempo real quién está dentro de la fábrica y vincula el acceso al estado de la documentación PRL. Si un trabajador tiene documentos caducados, se bloquea automáticamente su acceso.",
        },
      },
      {
        "@type": "Question",
        name: "¿En qué se diferencia PlayCAE de otras plataformas CAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PlayCAE utiliza IA especializada para validar documentos PRL en segundos con 99.2% de precisión. Además ofrece implementación en días (no meses), precio transparente sin costes por contrata y soporte personalizado.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo se tarda en implementar un software CAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Con PlayCAE puedes estar operativo en menos de una semana. La configuración inicial es sencilla y no requiere integraciones complejas. Otras plataformas pueden tardar meses en implementarse.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ProblemSolutionSection />
      <DocumentationSupported />
      <ComparisonSection />
      <WhyUs />
      <ContactSection />

      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }}
      />
      <Script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqs) }}
      />
    </div>
  );
}
