import type { Metadata } from "next";
import ContactSection from "./components/landing/Contact";
import DocumentationSupported from "./components/landing/DocumentationSupported";
import Hero from "./components/landing/Hero";
import ProblemSolutionSection from "./components/landing/ProblemSolutionSection";
import WhyUs from "./components/landing/WhyUs";
import ComparisonSection from "./components/landing/ComparisonSection";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Plataforma CAE | Gestión Documental de Contratas",
  description:
    "Plataforma CAE para gestionar la documentación PRL de tus contratas. Valida documentos automáticamente, evita sanciones del RD 171/2004 y ahorra hasta un 90% del tiempo. Prueba gratis.",
  keywords: [
    "software CAE",
    "plataforma CAE",
    "coordinación de actividades empresariales",
    "gestión documental PRL",
    "software PRL",
    "gestión contratistas",
    "validación documental automática",
    "RD 171/2004",
    "CAE con IA",
  ],
  alternates: { canonical: "https://www.playcae.com" },
  openGraph: {
    title: "Plataforma CAE para gestión documental de contratas | PlayCAE",
    description:
      "¿Pasas horas persiguiendo documentos a tus contratas? PlayCAE lo automatiza. Valida documentación PRL, evita sanciones y controla accesos desde una sola plataforma.",
    url: "https://www.playcae.com",
    siteName: "PlayCAE",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://www.playcae.com/assets/playcaeDashboard.png",
        alt: "Dashboard de PlayCAE para gestión documental PRL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PlayCae",
    title: "Plataforma CAE | Gestión documental de contratas | PlayCAE",
    description:
      "Automatiza la documentación PRL de tus subcontratas. Evita sanciones del RD 171/2004 sin perder horas en papeleo.",
    images: ["https://www.playcae.com/assets/playcaeDashboard.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};
export default function LandingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "PlayCAE",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description:
          "Plataforma CAE para gestión documental PRL y coordinación de actividades empresariales. Validación automática de documentos con 99.2% de precisión.",
        url: "https://www.playcae.com",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          description: "Prueba gratuita disponible",
        },
        featureList: [
          "Validacion documental con IA",
          "Gestion de contratistas y subcontratistas",
          "Control de accesos integrado",
          "Alertas de caducidad automaticas",
          "Cumplimiento RD 171/2004",
          "API REST para integraciones",
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Que es una plataforma CAE?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Una plataforma CAE digitaliza la coordinacion de actividades empresariales y la documentacion PRL entre empresa titular, contratas y subcontratas para cumplir el RD 171/2004.",
            },
          },
          {
            "@type": "Question",
            name: "Cuanto tiempo se ahorra con PlayCAE?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PlayCAE reduce hasta un 90% el tiempo dedicado a perseguir, validar y renovar documentacion de contratas gracias a procesos automaticos y alertas continuas.",
            },
          },
          {
            "@type": "Question",
            name: "Que documentos PRL puede gestionar PlayCAE?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "PlayCAE gestiona documentos PRL de empresas y trabajadores, incluyendo formacion, aptitud medica, seguros, evaluaciones de riesgo, EPIs y certificados de Seguridad Social.",
            },
          },
        ],
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
      <FaqSection mode="compact" showCta={true} />
      <ContactSection />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

