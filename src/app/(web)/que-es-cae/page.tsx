// app/(web)/que-es-cae/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Building2,
  Scale,
  Clock,
  CheckCircle,
  BookOpen,
  Gavel,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "¿Qué es la CAE? Guía Completa Coordinación Actividades Empresariales | PlayCAE",
  description:
    "Guía completa sobre CAE (Coordinación de Actividades Empresariales). Qué es, normativa RD 171/2004, obligaciones, sanciones y cómo automatizar la gestión documental PRL.",
  alternates: { canonical: "/que-es-cae" },
  openGraph: {
    type: "article",
    title: "¿Qué es la CAE? Guía Completa 2025 | PlayCAE",
    description:
      "Todo sobre la Coordinación de Actividades Empresariales: normativa, obligaciones y cómo cumplir con el RD 171/2004.",
    url: "https://playcae.com/que-es-cae",
  },
  robots: { index: true, follow: true },
};

const keyObligations = [
  {
    title: "Intercambio de información",
    description:
      "Las empresas deben informarse mutuamente sobre riesgos específicos de sus actividades que puedan afectar a trabajadores de otras empresas.",
    icon: FileText,
  },
  {
    title: "Instrucciones del titular",
    description:
      "El empresario titular del centro de trabajo debe dar instrucciones sobre prevención de riesgos, medidas de emergencia y zonas peligrosas.",
    icon: BookOpen,
  },
  {
    title: "Control documental",
    description:
      "Verificar que las empresas concurrentes y sus trabajadores disponen de formación PRL, aptitud médica, seguros y documentación requerida.",
    icon: CheckCircle,
  },
  {
    title: "Vigilancia del cumplimiento",
    description:
      "El empresario principal debe vigilar que las contratas cumplan la normativa de prevención de riesgos laborales.",
    icon: Shield,
  },
];

const sanctions = [
  {
    type: "Leves",
    range: "40€ - 2.045€",
    examples: "Falta de limpieza, incumplimientos formales menores.",
  },
  {
    type: "Graves",
    range: "2.046€ - 40.985€",
    examples: "No verificar documentación PRL, falta de coordinación efectiva.",
  },
  {
    type: "Muy graves",
    range: "40.986€ - 819.780€",
    examples:
      "Poner en peligro grave la vida de trabajadores, accidentes por falta de coordinación.",
  },
];

const documents = [
  "Certificado de aptitud médica",
  "Formación PRL general y específica",
  "Entrega de EPIs",
  "Seguro de responsabilidad civil",
  "Certificado estar al corriente SS",
  "Plan de prevención",
  "Evaluación de riesgos",
  "Autorización de equipos de trabajo",
  "Inscripción REA (construcción)",
  "TC1 y TC2 (justificantes SS)",
];

const timeline = [
  {
    year: "1995",
    event: "Ley 31/1995 de Prevención de Riesgos Laborales",
    description: "Establece el marco general de la prevención en España.",
  },
  {
    year: "2004",
    event: "RD 171/2004 de Coordinación de Actividades Empresariales",
    description:
      "Desarrolla el artículo 24 de la LPRL. Define obligaciones específicas de coordinación.",
  },
  {
    year: "2007",
    event: "Ley 32/2006 reguladora de la subcontratación en construcción",
    description:
      "Refuerza las obligaciones CAE en el sector de la construcción.",
  },
  {
    year: "2025",
    event: "Actualidad",
    description:
      "Inspecciones más estrictas y digitalización obligatoria de la gestión CAE.",
  },
];

export default function QueEsCAEPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:
      "¿Qué es la CAE? Guía Completa sobre Coordinación de Actividades Empresariales",
    description:
      "Guía completa sobre CAE: normativa RD 171/2004, obligaciones empresariales, sanciones y cómo automatizar la gestión documental PRL.",
    author: {
      "@type": "Organization",
      name: "PlayCAE",
      url: "https://playcae.com",
    },
    publisher: {
      "@type": "Organization",
      name: "PlayCAE",
      logo: {
        "@type": "ImageObject",
        url: "https://playcae.com/og-logo.png",
      },
    },
    datePublished: "2025-01-01",
    dateModified: "2025-01-01",
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
        name: "¿Qué es la CAE?",
        item: "https://playcae.com/que-es-cae",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué significa CAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "CAE significa Coordinación de Actividades Empresariales. Es el conjunto de obligaciones que tienen las empresas cuando comparten centro de trabajo para garantizar la seguridad de todos los trabajadores.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué empresas están obligadas a cumplir la CAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Todas las empresas que compartan centro de trabajo o contraten servicios de otras empresas (subcontratas, ETTs, autónomos) están obligadas a cumplir con la CAE según el RD 171/2004.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuál es la multa máxima por incumplir la CAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Las sanciones por incumplimiento de la CAE pueden alcanzar los 819.780€ en infracciones muy graves que pongan en peligro la vida de los trabajadores.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué documentos hay que pedir a las subcontratas?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Los documentos básicos incluyen: certificado de aptitud médica, formación PRL, entrega de EPIs, seguro de RC, certificados de Seguridad Social, plan de prevención y evaluación de riesgos.",
        },
      },
    ],
  };

  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative bg-playGrey">
        <div className="absolute inset-0 bg-gradient-to-br from-playBlueDark/10 via-transparent to-playOrange/10" />
        <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            <nav className="text-sm text-playBlueLight mb-6">
              <Link href="/" className="hover:text-playOrange">
                Inicio
              </Link>
              <span className="mx-2">/</span>
              <span className="text-playBlueDark">¿Qué es la CAE?</span>
            </nav>

            <div className="inline-flex items-center gap-2 bg-playBlueDark/10 text-playBlueDark px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Guía completa actualizada 2025
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playBlueDark leading-tight">
              ¿Qué es la <span className="text-playOrange">CAE</span>?
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl">
              La{" "}
              <strong>Coordinación de Actividades Empresariales (CAE)</strong>{" "}
              es el conjunto de obligaciones que tienen las empresas para
              garantizar la seguridad cuando comparten centro de trabajo o
              contratan servicios externos.
            </p>

            <div className="mt-8 p-6 bg-white rounded-2xl border border-playBlueLight/20 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="bg-playOrange/10 p-3 rounded-xl">
                  <Gavel className="h-6 w-6 text-playOrange" />
                </div>
                <div>
                  <h2 className="font-bold text-playBlueDark text-lg">
                    Base legal
                  </h2>
                  <p className="text-playBlueLight mt-1">
                    Regulada por el <strong>Real Decreto 171/2004</strong>, que
                    desarrolla el artículo 24 de la Ley 31/1995 de Prevención de
                    Riesgos Laborales (LPRL).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="h-16 w-full"
          >
            <path
              d="M0,120 C300,20 900,100 1200,40 L1200,120 L0,120 Z"
              className="fill-white"
            />
          </svg>
        </div>
      </section>

      {/* ¿A quién afecta? */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-8">
              ¿A quién afecta la CAE?
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-playGrey rounded-2xl p-6 border border-playBlueLight/10">
                <Building2 className="h-8 w-8 text-playBlueDark mb-4" />
                <h3 className="font-bold text-playBlueDark mb-2">
                  Empresario titular
                </h3>
                <p className="text-playBlueLight text-sm">
                  El propietario o arrendatario del centro de trabajo donde
                  concurren varias empresas.
                </p>
              </div>

              <div className="bg-playGrey rounded-2xl p-6 border border-playBlueLight/10">
                <Users className="h-8 w-8 text-playOrange mb-4" />
                <h3 className="font-bold text-playBlueDark mb-2">
                  Empresario principal
                </h3>
                <p className="text-playBlueLight text-sm">
                  Quien contrata obras o servicios a otras empresas de su propia
                  actividad.
                </p>
              </div>

              <div className="bg-playGrey rounded-2xl p-6 border border-playBlueLight/10">
                <Scale className="h-8 w-8 text-playGreen mb-4" />
                <h3 className="font-bold text-playBlueDark mb-2">
                  Empresas concurrentes
                </h3>
                <p className="text-playBlueLight text-sm">
                  Subcontratas, ETTs, autónomos y cualquier empresa que trabaje
                  en el centro.
                </p>
              </div>
            </div>

            <div className="bg-playOrange/10 rounded-2xl p-6 border border-playOrange/20">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-6 w-6 text-playOrange flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-playBlueDark">Importante</h3>
                  <p className="text-playBlueLight mt-1">
                    La empresa principal tiene{" "}
                    <strong>responsabilidad solidaria</strong> sobre las
                    infracciones de PRL de sus subcontratas. Si una contrata
                    incumple, tú también puedes ser sancionado.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Obligaciones */}
      <section className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-4 text-center">
              Obligaciones principales según el RD 171/2004
            </h2>
            <p className="text-playBlueLight text-center mb-12 max-w-2xl mx-auto">
              El empresario titular y principal deben cumplir estas obligaciones
              de coordinación
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {keyObligations.map((obligation, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-playBlueLight/10 shadow-sm"
                >
                  <div className="bg-playBlueDark w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <obligation.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-playBlueDark mb-2">
                    {obligation.title}
                  </h3>
                  <p className="text-playBlueLight text-sm">
                    {obligation.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Documentos */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-4 text-center">
              Documentación PRL requerida para CAE
            </h2>
            <p className="text-playBlueLight text-center mb-12 max-w-2xl mx-auto">
              Estos son los documentos que debes solicitar y validar de cada
              empresa y trabajador
            </p>

            <div className="bg-playGrey rounded-2xl p-8 border border-playBlueLight/10">
              <div className="grid md:grid-cols-2 gap-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-playGreen flex-shrink-0" />
                    <span className="text-playBlueDark">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/servicios/gestion-documentacion-cae"
                className="inline-flex items-center gap-2 text-playOrange font-semibold hover:underline"
              >
                Ver cómo automatizar la validación documental con IA
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sanciones */}
      <section className="bg-playBlueDark py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
              Sanciones por incumplimiento de la CAE
            </h2>
            <p className="text-playBlueLight text-center mb-12 max-w-2xl mx-auto">
              La Inspección de Trabajo puede imponer multas de hasta 819.780€
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {sanctions.map((sanction, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {sanction.type}
                  </h3>
                  <p className="text-3xl font-bold text-playOrange mb-4">
                    {sanction.range}
                  </p>
                  <p className="text-playBlueLight text-sm">
                    {sanction.examples}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-12 text-center">
              Evolución de la normativa CAE en España
            </h2>

            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="bg-playOrange text-white w-16 h-16 rounded-full flex items-center justify-center font-bold">
                      {item.year}
                    </div>
                  </div>
                  <div className="pt-3">
                    <h3 className="font-bold text-playBlueDark text-lg">
                      {item.event}
                    </h3>
                    <p className="text-playBlueLight mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-playOrange to-orange-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Necesitas ayuda con la gestión CAE?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            PlayCAE automatiza toda la coordinación de actividades empresariales
            con IA. Valida documentos en segundos y cumple normativa sin
            esfuerzo.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-playOrange shadow-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar demo gratuita
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/servicios"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <Script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <Script
        id="ld-breadcrumbs"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  );
}
