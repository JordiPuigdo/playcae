import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Agenda una demo | Contacto",
  description:
    "Contacta con PlayCAE: agenda una demo o escribe tus dudas sobre gestión CAE y validación PRL con IA. Respuesta en menos de 24h.",
  alternates: { canonical: "/contacto" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "https://playcae.com/contacto",
    title: "Contacto | PlayCAE",
    description:
      "Agenda una demo o consulta cómo automatizar CAE y PRL en tu fábrica.",
  },
};

export default function ContactoPage() {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PlayCAE",
    url: "https://playcae.com",
    logo: "https://playcae.com/og-logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "soporte@playcae.ai",
        telephone: "+34 600 123 456",
        areaServed: "ES",
        availableLanguage: ["es"],
      },
    ],
  };

  const contactLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto | PlayCAE",
    url: "https://playcae.com/contacto",
    description:
      "Agenda una demo o envía tus dudas sobre CAE y PRL con IA. Respuesta en menos de 24h.",
  };

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "https://playcae.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contacto",
        item: "https://playcae.com/contacto",
      },
    ],
  };

  return (
    <main
      className="relative overflow-hidden py-24"
      aria-labelledby="contact-title"
    >
      {/* Fondo degradado y blobs decorativos */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-50 to-cyan-50"
        aria-hidden="true"
      />
      <div
        className="absolute top-20 left-10 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-20 -right-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl"
        aria-hidden="true"
      />

      <div className="container relative z-10 mx-auto px-4">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumbs" className="mb-6 text-sm">
          <Link href="/" className="text-brandSecondary hover:underline">
            Inicio
          </Link>
          <span className="mx-2 text-brandNeutralDark">/</span>
          <span className="text-brandNeutralDark">Contacto</span>
        </nav>

        {/* Cabecera */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h1
            id="contact-title"
            className="text-4xl font-bold text-gray-900 md:text-5xl"
          >
            Agenda una demo
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Cuéntanos tu caso sobre CAE y PRL. Te responderemos en menos de 24
            horas 🚀
          </p>
        </div>

        {/* Grid principal: Form (client) + Info */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-xl md:grid-cols-2">
          <ContactForm /> {/* ← componente cliente con acción de servidor */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Información de contacto
              </h2>
              <p className="mt-2 text-gray-600">
                También puedes escribirnos directamente o llamarnos:
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600"
                  aria-hidden="true"
                >
                  {/* icono mail */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9h3.5a2.5 2.5 0 000-5H16z"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:soporte@playcae.ai"
                  className="text-gray-700 hover:underline"
                >
                  soporte@playcae.ai
                </a>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 text-cyan-600"
                  aria-hidden="true"
                >
                  {/* icono phone */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h2l3.6 7.59-1.35 2.45A2 2 0 009 17h9a2 2 0 001.8-1.1l3.24-6.48A1 1 0 0022 8h-6.31l-1.95-3.9A1 1 0 0013 4H6a1 1 0 00-1 1z"
                    />
                  </svg>
                </div>
                <a
                  href="tel:+34600123456"
                  className="text-gray-700 hover:underline"
                >
                  +34 600 123 456
                </a>
              </div>
            </div>
            <p className="text-gray-600">
              Responderemos en menos de 24 horas 🚀
            </p>
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <Script
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
      />
      <Script
        id="ld-contact"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactLd) }}
      />
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
    </main>
  );
}
