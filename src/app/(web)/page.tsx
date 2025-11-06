import Script from "next/script";
import ContactSection from "./components/landing/Contact";
import DocumentationSupported from "./components/landing/DocumentationSupported";
import Hero from "./components/landing/Hero";
import ProblemSolutionSection from "./components/landing/ProblemSolutionSection";
import WhyUs from "./components/landing/WhyUs";

export default function LandingPage() {
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PlayCAE",
    url: "https://www.playcae.com",
    logo: "https://www.playcae.com/og-logo.png",
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
        name: "¿Qué es la CAE y por qué afecta a mi empresa?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La Coordinación de Actividades Empresariales (CAE) obliga a las empresas a gestionar y validar la documentación PRL de contratas y trabajadores. PlayCAE automatiza este proceso.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo me ayuda PlayCAE con el control de accesos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PlayCAE registra en tiempo real quién está dentro de la fábrica y vincula el acceso al estado de la documentación PRL.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ProblemSolutionSection />
      <DocumentationSupported />
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
