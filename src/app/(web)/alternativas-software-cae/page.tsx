// app/(web)/alternativas-software-cae/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Check,
  X,
  Zap,
  Clock,
  CreditCard,
  Users,
  Brain,
  Shield,
  Building2,
  FileCheck,
  AlertTriangle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Alternativas a Plataformas CAE: Comparativa 2025 | PlayCAE",
  description:
    "Buscas alternativas a tu software CAE actual? Compara funcionalidades, precios y tiempos de implementación. PlayCAE: IA, precio transparente y soporte real.",
  alternates: { canonical: "/alternativas-software-cae" },
  openGraph: {
    type: "website",
    title: "Alternativas a Plataformas CAE | PlayCAE",
    description:
      "Comparativa de plataformas CAE 2025. Descubre por qué empresas migran a PlayCAE desde otras soluciones.",
    url: "https://playcae.com/alternativas-software-cae",
  },
  robots: { index: true, follow: true },
};

const painPoints = [
  {
    icon: Clock,
    title: "Implementaciones de meses",
    description:
      "Proyectos que se alargan 3-6 meses con consultores, formaciones interminables y configuraciones complejas.",
  },
  {
    icon: CreditCard,
    title: "Costes ocultos por volumen",
    description:
      "Cuotas por contrata, por trabajador, por documento... El coste final multiplica el presupuesto inicial.",
  },
  {
    icon: Users,
    title: "Soporte lento o inexistente",
    description:
      "Tickets que tardan días en resolverse. Sin acceso directo a expertos CAE cuando lo necesitas.",
  },
  {
    icon: Brain,
    title: "Validación manual disfrazada",
    description:
      "Herramientas que dicen automatizar pero requieren revisión manual de cada documento.",
  },
];

const comparisonTable = [
  {
    feature: "Validación documental con IA real",
    playcae: true,
    traditional: "Semi-automática o manual",
  },
  {
    feature: "Tiempo de implementación",
    playcae: "< 1 semana",
    traditional: "3-6 meses",
  },
  {
    feature: "Modelo de precios",
    playcae: "Tarifa plana transparente",
    traditional: "Por contrata/trabajador",
  },
  {
    feature: "Soporte técnico",
    playcae: "Directo con expertos CAE",
    traditional: "Tickets con espera",
  },
  {
    feature: "Control de accesos integrado",
    playcae: true,
    traditional: "Módulo adicional de pago",
  },
  {
    feature: "Curva de aprendizaje",
    playcae: "Intuitivo desde día 1",
    traditional: "Formación obligatoria",
  },
  {
    feature: "API abierta",
    playcae: true,
    traditional: "Limitada o de pago",
  },
  {
    feature: "Migración desde otro software",
    playcae: "Gratuita con asistencia",
    traditional: "Coste adicional",
  },
];

const migrationSteps = [
  {
    step: 1,
    title: "Análisis de tu situación actual",
    description:
      "Revisamos qué plataforma usas, cuántas contratas tienes y qué documentación gestionas.",
  },
  {
    step: 2,
    title: "Migración de datos asistida",
    description:
      "Importamos tu histórico de empresas, trabajadores y documentos. Sin pérdida de información.",
  },
  {
    step: 3,
    title: "Formación express",
    description:
      "En 2 horas tu equipo domina PlayCAE. Interfaz intuitiva, sin curva de aprendizaje.",
  },
  {
    step: 4,
    title: "Operativo en producción",
    description:
      "En menos de una semana estás gestionando CAE con PlayCAE. Con soporte continuo.",
  },
];

const testimonialQuotes = [
  {
    quote:
      "Llevábamos 4 meses intentando implementar otra plataforma. Con PlayCAE estuvimos operativos en 5 días.",
    author: "Director de Operaciones",
    company: "Empresa manufacturera, 120 empleados",
  },
  {
    quote:
      "El coste por contrata nos estaba arruinando. Ahora pagamos una tarifa fija y sabemos exactamente qué gastamos.",
    author: "Responsable de Compras",
    company: "Constructora, 80 subcontratas",
  },
];

export default function AlternativasCAEPage() {
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
        name: "Alternativas Software CAE",
        item: "https://playcae.com/alternativas-software-cae",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Por qué cambiar de plataforma CAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Las empresas cambian de plataforma CAE por costes ocultos, implementaciones largas, soporte deficiente o falta de automatización real. PlayCAE resuelve estos problemas con IA, precio transparente e implementación en días.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta migrar a PlayCAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La migración a PlayCAE es gratuita. Incluye importación de datos, configuración y formación de tu equipo sin coste adicional.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se pierde el histórico de documentos al cambiar?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Importamos todo tu histórico de empresas, trabajadores y documentos validados. La trazabilidad se mantiene intacta para auditorías.",
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
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-playOrange/10 text-playOrange px-4 py-2 rounded-full text-sm font-medium mb-6">
              <AlertTriangle className="h-4 w-4" />
              ¿Tu plataforma CAE actual no cumple expectativas?
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playBlueDark leading-tight">
              Alternativas a tu{" "}
              <span className="text-playOrange">software CAE actual</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl mx-auto">
              Si estás frustrado con implementaciones eternas, costes ocultos o
              soporte inexistente, no estás solo. Descubre por qué empresas
              migran a PlayCAE.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-playOrange px-8 py-4 font-semibold text-white shadow-lg hover:bg-playOrange/90 transition-colors"
              >
                Solicitar migración gratuita
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#comparativa"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-playBlueDark px-8 py-4 font-semibold text-playBlueDark hover:bg-playBlueDark/5 transition-colors"
              >
                Ver comparativa
              </Link>
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

      {/* Pain Points */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Problemas comunes con plataformas CAE tradicionales
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Si alguno de estos te suena familiar, es hora de buscar
              alternativas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {painPoints.map((point, idx) => (
              <div
                key={idx}
                className="bg-red-50 rounded-2xl p-6 border border-red-100"
              >
                <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <point.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-red-800 mb-2">
                  {point.title}
                </h3>
                <p className="text-red-700/80 text-sm">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparativa" className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              PlayCAE vs. Plataformas CAE tradicionales
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Comparativa objetiva de funcionalidades y condiciones
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-playBlueLight/20 overflow-hidden shadow-lg">
              <div className="grid grid-cols-3 bg-playBlueDark text-white">
                <div className="p-4 font-semibold">Característica</div>
                <div className="p-4 font-semibold text-center bg-playOrange">
                  PlayCAE
                </div>
                <div className="p-4 font-semibold text-center">
                  Otras plataformas
                </div>
              </div>

              {comparisonTable.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-3 border-b border-playBlueLight/10 ${
                    idx % 2 === 0 ? "bg-white" : "bg-playGrey/50"
                  }`}
                >
                  <div className="p-4 text-playBlueDark font-medium">
                    {row.feature}
                  </div>
                  <div className="p-4 text-center">
                    {typeof row.playcae === "boolean" ? (
                      <Check className="h-5 w-5 text-playGreen mx-auto" />
                    ) : (
                      <span className="text-playGreen font-semibold text-sm">
                        {row.playcae}
                      </span>
                    )}
                  </div>
                  <div className="p-4 text-center">
                    {typeof row.traditional === "boolean" ? (
                      row.traditional ? (
                        <Check className="h-5 w-5 text-playBlueLight mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 mx-auto" />
                      )
                    ) : (
                      <span className="text-playBlueLight text-sm">
                        {row.traditional}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Migration Process */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Migración gratuita en 4 pasos
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Te acompañamos en todo el proceso. Sin costes ocultos, sin
              sorpresas.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {migrationSteps.map((step) => (
              <div key={step.step} className="relative">
                <div className="bg-playOrange text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-playBlueDark mb-2">
                  {step.title}
                </h3>
                <p className="text-playBlueLight text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-playBlueDark py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Lo que dicen empresas que migraron
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonialQuotes.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <p className="text-white text-lg italic mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="text-playOrange font-semibold">
                    {testimonial.author}
                  </p>
                  <p className="text-playBlueLight text-sm">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-playOrange to-orange-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para migrar a una plataforma CAE que funciona?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Migración gratuita, sin compromiso. Te mostramos cómo sería tu día a
            día con PlayCAE.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-playOrange shadow-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar demo + migración gratuita
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
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
