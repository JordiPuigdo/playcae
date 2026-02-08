// app/(web)/plataformas-cae/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Shield,
  Zap,
  Users,
  FileCheck,
  Clock,
  TrendingUp,
  Building2,
  Workflow,
  Brain,
  ChevronRight,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Plataformas CAE: Guía Completa para Elegir tu Software 2026 | PlayCAE",
  description:
    "Comparativa de plataformas CAE para Coordinación de Actividades Empresariales. Funcionalidades clave, precios y cómo elegir la mejor plataforma CAE para tu empresa.",
  keywords: [
    "plataformas cae",
    "plataforma cae",
    "software cae",
    "coordinación actividades empresariales",
    "gestión prl",
  ],
  alternates: { canonical: "/plataformas-cae" },
  openGraph: {
    type: "article",
    title: "Plataformas CAE: Guía Completa 2026 | PlayCAE",
    description:
      "Todo lo que necesitas saber para elegir la mejor plataforma CAE. Comparativa, funcionalidades y precios.",
    url: "https://www.playcae.com/plataformas-cae",
  },
  robots: { index: true, follow: true },
};

const platformFeatures = [
  {
    icon: FileCheck,
    title: "Validación Documental Automática",
    description:
      "Las mejores plataformas CAE validan documentación PRL automáticamente: TC1/TC2, seguros RC, formaciones específicas y aptitudes médicas.",
    mustHave: true,
  },
  {
    icon: Users,
    title: "Gestión de Contratas y Trabajadores",
    description:
      "Control completo de empresas subcontratadas, trabajadores autorizados y accesos a centros de trabajo.",
    mustHave: true,
  },
  {
    icon: Shield,
    title: "Control de Accesos",
    description:
      "Verificación en tiempo real de trabajadores autorizados antes de permitir el acceso a instalaciones.",
    mustHave: false,
  },
  {
    icon: Brain,
    title: "Inteligencia Artificial",
    description:
      "IA que extrae datos de documentos, detecta caducidades y valida requisitos legales automáticamente.",
    mustHave: false,
  },
  {
    icon: Workflow,
    title: "Flujos de Trabajo Personalizables",
    description:
      "Adaptación de procesos de validación y aprobación según las necesidades de cada empresa.",
    mustHave: true,
  },
  {
    icon: Clock,
    title: "Alertas de Caducidad",
    description:
      "Notificaciones automáticas cuando documentación está próxima a caducar para evitar incumplimientos.",
    mustHave: true,
  },
];

const comparisonCriteria = [
  {
    title: "Facilidad de implementación",
    description:
      "Una buena plataforma CAE debe estar operativa en días, no meses. Evita soluciones que requieren consultorías largas.",
  },
  {
    title: "Automatización real",
    description:
      "Verifica que la validación sea automática. Muchas plataformas obligan a revisión manual disfrazada de automatización.",
  },
  {
    title: "Modelo de precios transparente",
    description:
      "Huye de precios ocultos por volumen. Busca tarifas planas que escalen con tu empresa sin sorpresas.",
  },
  {
    title: "Soporte y formación",
    description:
      "Soporte técnico rápido y formación incluida ahorran tiempo y frustración al equipo.",
  },
  {
    title: "Experiencia de usuario",
    description:
      "Si la plataforma es compleja, nadie la usará. La mejor CAE es la que tu equipo adoptará sin resistencia.",
  },
];

const industries = [
  {
    name: "Construcción e Infraestructuras",
    challenges:
      "Alto volumen de contratas, trabajadores temporales y trabajos de alto riesgo.",
    solution:
      "Plataformas CAE con control de accesos integrado y validación rápida de documentación.",
  },
  {
    name: "Industria y Fabricación",
    challenges:
      "Contratas de mantenimiento recurrentes, zonas con riesgos específicos y ATEX.",
    solution:
      "Gestión de permisos de trabajo y formaciones específicas por zona industrial.",
  },
  {
    name: "Logística y Almacenes",
    challenges:
      "Rotación alta de personal, transportistas externos y accesos múltiples.",
    solution:
      "Validación automática express y control de accesos en tiempo real.",
  },
  {
    name: "Energía y Utilities",
    challenges:
      "Normativas estrictas, trabajos en altura, riesgos eléctricos y contratas especializadas.",
    solution:
      "Plataforma CAE con requisitos configurables por tipo de trabajo y certificaciones específicas.",
  },
];

export default function PlataformasCAEPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Plataformas CAE: Guía Completa
              <span className="block text-blue-600">para Elegir la Mejor</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 md:text-xl">
              Comparativa actualizada de plataformas CAE para{" "}
              <strong>Coordinación de Actividades Empresariales</strong>.
              Descubre funcionalidades clave, precios y cómo elegir la solución
              correcta para tu empresa.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
              >
                Prueba PlayCAE Gratis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:border-gray-400"
              >
                Ver Precios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué es una Plataforma CAE? */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-8 shadow-xl md:p-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              ¿Qué es una Plataforma CAE?
            </h2>
            <p className="mb-4 text-lg text-gray-700">
              Una <strong>plataforma CAE</strong> es un software especializado
              que ayuda a las empresas a cumplir con la{" "}
              <strong>Coordinación de Actividades Empresariales</strong>{" "}
              (normativa RD 171/2004). Estas plataformas automatizan la gestión
              documental PRL, controlan el acceso de contratas y trabajadores, y
              reducen riesgos legales.
            </p>
            <p className="text-lg text-gray-700">
              Las mejores plataformas CAE combinan{" "}
              <strong>validación automática</strong> de documentación,{" "}
              <strong>control de accesos</strong> en tiempo real y{" "}
              <strong>alertas inteligentes</strong> para que tu equipo pueda
              enfocarse en lo importante: la seguridad de las personas.
            </p>
          </div>
        </div>
      </section>

      {/* Funcionalidades Clave */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Funcionalidades Clave de las Plataformas CAE
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              No todas las plataformas ofrecen lo mismo. Estas son las
              funcionalidades esenciales que debes buscar:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {platformFeatures.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  {feature.mustHave && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Imprescindible
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Criterios para Elegir */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Cómo Elegir la Plataforma CAE Correcta
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              5 criterios esenciales para tomar la decisión correcta
            </p>
          </div>

          <div className="space-y-6">
            {comparisonCriteria.map((criteria, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {criteria.title}
                    </h3>
                    <p className="text-gray-600">{criteria.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plataformas CAE por Industria */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Plataformas CAE por Industria
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Cada sector tiene retos específicos en CAE. Encuentra la solución
              para tu industria:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {industry.name}
                  </h3>
                </div>
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-gray-700">
                    Retos típicos:
                  </h4>
                  <p className="text-gray-600">{industry.challenges}</p>
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-gray-700">
                    Solución ideal:
                  </h4>
                  <p className="text-gray-600">{industry.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué PlayCAE */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              PlayCAE: La Plataforma CAE Moderna
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
              Implementación en menos de 1 semana. IA real que valida
              documentación automáticamente. Precio transparente sin sorpresas.
            </p>

            <div className="mb-12 grid gap-8 md:grid-cols-3">
              <div>
                <div className="mb-2 text-4xl font-bold">{"<1"} semana</div>
                <div className="text-blue-100">Tiempo de implementación</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold">100%</div>
                <div className="text-blue-100">Validación automática con IA</div>
              </div>
              <div>
                <div className="mb-2 text-4xl font-bold">0€</div>
                <div className="text-blue-100">Costes ocultos</div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50"
              >
                Prueba Gratis 14 Días
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Hablar con Experto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Qué es una plataforma CAE?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Una plataforma CAE es un software que ayuda a las empresas a cumplir con la Coordinación de Actividades Empresariales (RD 171/2004), automatizando la validación de documentación PRL, control de accesos y gestión de contratas.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuánto cuesta una plataforma CAE?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Los precios varían según el proveedor y modelo de negocio. Algunas cobran por contrata o trabajador (coste variable), mientras que otras como PlayCAE ofrecen tarifas planas desde 199€/mes, independientemente del volumen.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuánto tiempo tarda en implementarse una plataforma CAE?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Depende de la plataforma. Las soluciones tradicionales pueden tardar 3-6 meses con consultorías. Plataformas modernas como PlayCAE están operativas en menos de 1 semana.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
