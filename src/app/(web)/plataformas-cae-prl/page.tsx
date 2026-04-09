// app/(web)/plataformas-cae-prl/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Users,
  FileCheck,
  Clock,
  Brain,
  ChevronRight,
  Building2,
  CheckCircle,
  Zap,
  AlertTriangle,
  HardHat,
  Workflow,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plataformas CAE y PRL: Solución Integrada para Empresas 2026",
  description:
    "Plataformas que integran CAE y PRL en una sola solución. Gestión documental CAE, prevención de riesgos laborales, control de accesos y cumplimiento normativo completo.",
  keywords: [
    "plataformas cae prl",
    "software cae prl",
    "plataforma cae y prl",
    "plataforma integrada cae prl",
    "software coordinacion actividades empresariales y prl",
    "gestion documental cae y prevencion riesgos laborales",
    "rd 171/2004 y ley 31/1995",
    "control de accesos contratas",
    "coordinacion actividades empresariales prevencion riesgos",
    "gestion cae prl empresas",
  ],
  alternates: { canonical: "/plataformas-cae-prl" },
  openGraph: {
    type: "article",
    title: "Plataformas CAE y PRL: Solución Integrada | PlayCAE",
    description:
      "Descubre cómo una plataforma que integra CAE y PRL simplifica la gestión de prevención y coordinación de contratas en una sola herramienta.",
    url: "https://www.playcae.com/plataformas-cae-prl",
    images: [
      {
        url: "https://www.playcae.com/og-logo.png",
        alt: "PlayCAE – Plataforma CAE con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PlayCae",
    title: "Plataformas CAE y PRL: Solución Integrada | PlayCAE",
    description:
      "Cómo una plataforma integrada de CAE y PRL simplifica la gestión de prevención y contratas.",
    images: ["https://www.playcae.com/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

const caeVsPrl = [
  {
    area: "CAE (Coordinación de Actividades Empresariales)",
    description:
      "Gestión de documentación PRL de empresas y trabajadores externos. Obligatorio cuando concurren trabajadores de distintas empresas en un mismo centro.",
    normativa: "RD 171/2004",
    documentos: ["TC1/TC2", "Seguro RC", "Formaciones PRL", "Reconocimientos médicos"],
    color: "border-playBlueDark",
    badge: "bg-playBlueDark/10 text-playBlueDark",
  },
  {
    area: "PRL (Prevención de Riesgos Laborales)",
    description:
      "Gestión integral de la prevención: evaluaciones de riesgos, planificación preventiva, investigación de accidentes y vigilancia de la salud.",
    normativa: "Ley 31/1995",
    documentos: ["Evaluación de riesgos", "Plan de prevención", "Formaciones", "Accidentes"],
    color: "border-playGreen",
    badge: "bg-playGreen/10 text-playGreen",
  },
];

const integratedFeatures = [
  {
    icon: FileCheck,
    title: "Validación Documental CAE Automática",
    description:
      "IA que valida TC1/TC2, seguros RC, formaciones y reconocimientos médicos de contratas sin revisión manual.",
    tag: "CAE",
  },
  {
    icon: Shield,
    title: "Gestión de Evaluaciones de Riesgo",
    description:
      "Repositorio de evaluaciones de riesgos por puesto, actividad y zona de trabajo.",
    tag: "PRL",
  },
  {
    icon: HardHat,
    title: "Control de Accesos Integrado",
    description:
      "Solo acceden trabajadores con documentación CAE y PRL en regla. Verificación automática en tiempo real.",
    tag: "CAE + PRL",
  },
  {
    icon: Brain,
    title: "IA para Análisis Documental",
    description:
      "Extracción automática de datos de cualquier documento PRL o CAE. Sin teclear ni revisar manualmente.",
    tag: "CAE + PRL",
  },
  {
    icon: Clock,
    title: "Alertas de Caducidad Unificadas",
    description:
      "Un único panel de alertas para documentación CAE de contratas y actividades preventivas propias.",
    tag: "CAE + PRL",
  },
  {
    icon: Workflow,
    title: "Flujos de Aprobación",
    description:
      "Flujos configurables para validar documentación CAE y autorizar accesos según perfiles de riesgo.",
    tag: "CAE",
  },
  {
    icon: Users,
    title: "Portal de Contratas y Trabajadores",
    description:
      "Espacio dedicado donde contratas gestionan su propia documentación CAE y PRL de forma autónoma.",
    tag: "CAE",
  },
  {
    icon: AlertTriangle,
    title: "Gestión de Incidentes",
    description:
      "Registro, investigación y seguimiento de accidentes e incidentes laborales vinculado a los trabajadores.",
    tag: "PRL",
  },
];

const whyIntegrated = [
  {
    title: "Un solo punto de verdad",
    description:
      "Con plataformas separadas, la información se duplica y desincroniza. Una solución integrada CAE+PRL mantiene todo coherente y actualizado.",
  },
  {
    title: "Menos herramientas, menos fricción",
    description:
      "Tu equipo aprende y usa una sola plataforma en lugar de varias. Menos logins, menos errores, más adopción.",
  },
  {
    title: "Visibilidad completa del riesgo",
    description:
      "Ver simultáneamente el estado de CAE de una contrata y sus evaluaciones de riesgo da una imagen real del nivel de seguridad.",
  },
  {
    title: "Cumplimiento normativo 360°",
    description:
      "RD 171/2004 y Ley 31/1995 cubiertos desde una misma plataforma. Auditorías más simples y evidencias centralizadas.",
  },
];

const sectors = [
  {
    name: "Industria y Fabricación",
    cae: "Contratas de mantenimiento y servicios técnicos con documentación específica.",
    prl: "Evaluaciones de riesgo por zona, permisos de trabajo en caliente, ATEX.",
    icon: Building2,
  },
  {
    name: "Construcción",
    cae: "Subcontratas múltiples, trabajadores temporales, alta rotación.",
    prl: "Plan de seguridad y salud, trabajos en altura, maquinaria pesada.",
    icon: HardHat,
  },
  {
    name: "Logística y Transporte",
    cae: "Transportistas externos, operadores logísticos, accesos múltiples.",
    prl: "Ergonomía, cargas, maquinaria de manutención, turnos nocturnos.",
    icon: Workflow,
  },
  {
    name: "Energía y Utilities",
    cae: "Contratas especializadas con certificaciones específicas del sector.",
    prl: "Riesgo eléctrico, trabajos en altura, espacios confinados.",
    icon: Zap,
  },
];

const faqItems = [
  {
    question: "¿Qué diferencia hay entre una plataforma CAE y una plataforma PRL?",
    answer:
      "La plataforma CAE se centra en la Coordinación de Actividades Empresariales: documentación de contratas, validación documental y control de acceso de trabajadores externos. La plataforma PRL cubre la prevención interna: evaluación de riesgos, formación, incidentes y planificación preventiva.",
  },
  {
    question: "¿Cuándo conviene una plataforma integrada CAE + PRL?",
    answer:
      "Conviene cuando tu empresa necesita gestionar contratas y, al mismo tiempo, prevención interna en un solo entorno. Una plataforma integrada CAE y PRL evita duplicidades, mejora la trazabilidad y simplifica auditorías de cumplimiento.",
  },
  {
    question: "¿Qué normativa cubre un software CAE y PRL?",
    answer:
      "Un software integrado debe ayudarte a cumplir el RD 171/2004 para la coordinación de actividades empresariales y la Ley 31/1995 para prevención de riesgos laborales, con evidencias documentales y seguimiento continuo.",
  },
  {
    question: "¿Qué funcionalidades clave debe tener una plataforma CAE + PRL?",
    answer:
      "Validación documental automática, alertas de caducidad, control de accesos, gestión de evaluaciones de riesgo, portal de contratas y reporting de cumplimiento. Si incorpora IA para revisión documental, reduce aún más la carga manual.",
  },
  {
    question: "¿Qué sectores se benefician más de una plataforma CAE y PRL?",
    answer:
      "Industria, construcción, logística, energía y cualquier sector con concurrencia de empresas y riesgos operativos altos. En estos casos, un sistema integrado mejora seguridad, control y eficiencia operativa.",
  },
];

export default function PlataformasCAEPRLPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-playGrey">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <span className="mb-4 inline-block rounded-full bg-playBlueDark/10 px-4 py-2 text-sm font-semibold text-playBlueDark">
              CAE + PRL en una sola plataforma
            </span>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-playBlueDark md:text-5xl lg:text-6xl">
              Plataformas CAE y PRL
              <span className="block text-playBlueLight">
                La Solución Integrada para Empresas
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-playBlueLight md:text-xl">
              Gestiona la{" "}
              <strong>Coordinación de Actividades Empresariales (CAE)</strong> y
              la <strong>Prevención de Riesgos Laborales (PRL)</strong> desde
              una sola plataforma. Menos herramientas, más control, cumplimiento
              completo.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-playOrange px-6 py-3 text-white transition-all hover:bg-playBlueLight"
              >
                Prueba PlayCAE Gratis
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border border-playBlueLight/30 bg-white px-6 py-3 text-playBlueLight transition-all hover:border-playBlueLight/50"
              >
                Hablar con un Experto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CAE vs PRL: Diferencias y Complementariedad */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              CAE y PRL: Diferentes pero Complementarias
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Entender la diferencia entre CAE y PRL es clave para elegir la
              plataforma correcta:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {caeVsPrl.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl border-l-4 bg-white p-8 shadow-md ${item.color}`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-playBlueDark">
                    {item.area}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${item.badge}`}
                  >
                    {item.normativa}
                  </span>
                </div>
                <p className="mb-4 text-playBlueLight">{item.description}</p>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-playBlueLight">
                    Documentos principales:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {item.documentos.map((doc, dIndex) => (
                      <span
                        key={dIndex}
                        className="rounded-full bg-playGrey px-3 py-1 text-xs text-playBlueLight"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué una Solución Integrada */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Por qué Elegir una Plataforma Integrada CAE + PRL
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Las empresas que gestionan CAE y PRL por separado pierden tiempo,
              cometen errores y tienen una visión incompleta del riesgo:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {whyIntegrated.map((reason, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-playBlueDark text-xl font-bold text-white">
                  {index + 1}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-playBlueDark">
                    {reason.title}
                  </h3>
                  <p className="text-playBlueLight">{reason.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades Integradas */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Funcionalidades de una Plataforma CAE + PRL
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Las funcionalidades clave que debe tener una solución integrada:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {integratedFeatures.map((feature, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6 transition-all hover:border-playBlueLight/50 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-playBlueLight/15 p-3">
                    <feature.icon className="h-6 w-6 text-playBlueDark" />
                  </div>
                  <span className="rounded-full bg-playBlueDark/10 px-2 py-1 text-xs font-semibold text-playBlueDark">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-playBlueDark">
                  {feature.title}
                </h3>
                <p className="text-sm text-playBlueLight">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sectores */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Plataformas CAE + PRL por Sector
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Cada industria tiene retos específicos en CAE y PRL:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {sectors.map((sector, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <sector.icon className="h-8 w-8 text-playBlueDark" />
                  <h3 className="text-2xl font-semibold text-playBlueDark">
                    {sector.name}
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="rounded-lg bg-playBlueDark/5 p-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-playBlueDark">
                      CAE
                    </div>
                    <p className="text-sm text-playBlueLight">{sector.cae}</p>
                  </div>
                  <div className="rounded-lg bg-playGreen/5 p-4">
                    <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-playGreen">
                      PRL
                    </div>
                    <p className="text-sm text-playBlueLight">{sector.prl}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PlayCAE CTA */}
      <section className="bg-gradient-to-br from-playBlueDark to-playBlueLight px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              PlayCAE: CAE y PRL en una Sola Plataforma
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-playGrey">
              Especializada en gestión documental CAE con IA real. Validación
              automática, control de accesos y todo el módulo PRL integrado.
              Implementación en menos de 1 semana.
            </p>

            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <CheckCircle className="mx-auto mb-3 h-10 w-10 text-white" />
                <div className="mb-1 font-semibold">CAE Automatizada</div>
                <div className="text-sm text-playGrey">
                  Validación documental por IA sin revisión manual
                </div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <Shield className="mx-auto mb-3 h-10 w-10 text-white" />
                <div className="mb-1 font-semibold">PRL Integrada</div>
                <div className="text-sm text-playGrey">
                  Evaluaciones, formaciones y vigilancia de salud
                </div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <Zap className="mx-auto mb-3 h-10 w-10 text-white" />
                <div className="mb-1 font-semibold">Tarifa Plana</div>
                <div className="text-sm text-playGrey">
                  Sin costes por contrata o trabajador
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-playBlueDark transition-all hover:bg-playGrey"
              >
                Prueba Gratis 14 Días
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Ver Precios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              FAQs sobre Plataformas CAE y PRL
            </h2>
            <p className="mx-auto max-w-3xl text-lg text-playBlueLight">
              Preguntas clave para elegir una plataforma integrada de
              Coordinación de Actividades Empresariales y Prevención de Riesgos
              Laborales.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {faqItems.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <h3 className="mb-3 text-xl font-semibold text-playBlueDark">
                  {faq.question}
                </h3>
                <p className="text-playBlueLight">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Internal linking */}
      <section className="px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl border border-playBlueLight/20 bg-white p-8">
            <h2 className="mb-6 text-2xl font-bold text-playBlueDark">
              Explora más sobre CAE y PRL
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/plataforma-cae"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>Qué es una Plataforma CAE</span>
              </Link>
              <Link
                href="/plataformas-prl"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>Plataformas PRL</span>
              </Link>
              <Link
                href="/que-es-cae"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>¿Qué es la CAE?</span>
              </Link>
              <Link
                href="/preguntas-frecuentes"
                className="flex items-center gap-2 rounded-lg border border-playBlueLight/20 p-4 text-playBlueLight transition-all hover:border-playBlueDark hover:text-playBlueDark"
              >
                <ChevronRight className="h-5 w-5 flex-shrink-0" />
                <span>FAQs de CAE y PRL</span>
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
            mainEntity: faqItems.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
