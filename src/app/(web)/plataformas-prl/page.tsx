// app/(web)/plataformas-prl/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Users,
  FileCheck,
  Clock,
  Building2,
  HardHat,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Brain,
  BarChart,
  Bell,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Plataformas PRL: Mejores Soluciones de Prevención de Riesgos 2026",
  description:
    "Comparativa de plataformas PRL para gestión de prevención de riesgos laborales. Software CAE, control documental, formaciones, accidentes y cumplimiento normativo.",
  keywords: [
    "plataformas prl",
    "software prl",
    "prevención riesgos laborales software",
    "plataforma prevencion riesgos",
    "gestión prl",
  ],
  alternates: { canonical: "/plataformas-prl" },
  openGraph: {
    type: "article",
    title: "Plataformas PRL: Las Mejores Soluciones 2026 | PlayCAE",
    description:
      "Descubre las mejores plataformas PRL para gestión de prevención de riesgos laborales. Comparativa, funcionalidades y precios.",
    url: "https://www.playcae.com/plataformas-prl",
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
    title: "Plataformas PRL: Las Mejores Soluciones 2026 | PlayCAE",
    description:
      "Comparativa de plataformas PRL para prevención de riesgos laborales. Funcionalidades y precios.",
    images: ["https://www.playcae.com/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

const platformTypes = [
  {
    icon: FileCheck,
    title: "Gestión Documental PRL",
    description:
      "Plataformas especializadas en validar y controlar documentación: TC1/TC2, seguros RC, formaciones, reconocimientos médicos.",
    ideal: "Empresas con contratas y subcontratas (CAE)",
    example: "PlayCAE, Coordinapp, MyGestión",
  },
  {
    icon: HardHat,
    title: "Control de Accesos",
    description:
      "Sistemas que verifican que trabajadores tengan documentación al día antes de permitir acceso a instalaciones.",
    ideal: "Fábricas, obras, centros logísticos",
    example: "PlayCAE Access, Veridas, ZKTeco",
  },
  {
    icon: BarChart,
    title: "Gestión Integral PRL",
    description:
      "Plataformas todo-en-uno: evaluaciones de riesgos, planes de prevención, investigación de accidentes, formaciones.",
    ideal: "Servicios de prevención propios o ajenos",
    example: "Quirón Prevención, Previntegral, Cualtis",
  },
  {
    icon: Users,
    title: "Portales de Trabajadores",
    description:
      "Apps/portales donde trabajadores consultan formaciones, notifican incidencias, acceden a documentación PRL propia.",
    ideal: "Empresas con plantillas grandes",
    example: "Logistar, PRL Manager, SafetyCulture",
  },
];

const coreFunctionalities = [
  {
    title: "Validación Documental Automática",
    description:
      "Verifica TC1/TC2, seguros RC, formaciones y reconocimientos médicos sin revisión manual.",
    priority: "Alta",
  },
  {
    title: "Evaluación de Riesgos",
    description:
      "Herramientas para crear, actualizar y gestionar evaluaciones de riesgos por puesto/actividad.",
    priority: "Media",
  },
  {
    title: "Gestión de Formaciones PRL",
    description:
      "Control de formaciones obligatorias, específicas, reciclajes y caducidades.",
    priority: "Alta",
  },
  {
    title: "Investigación de Accidentes",
    description:
      "Registro, análisis y seguimiento de accidentes e incidentes laborales.",
    priority: "Media",
  },
  {
    title: "Planificación de Actividades Preventivas",
    description:
      "Calendario de revisiones médicas, formaciones, inspecciones y auditorías.",
    priority: "Media",
  },
  {
    title: "Control de EPIs",
    description:
      "Gestión de entrega, uso, mantenimiento y reposición de equipos de protección individual.",
    priority: "Baja",
  },
  {
    title: "Alertas y Notificaciones",
    description:
      "Avisos automáticos de caducidades, vencimientos y acciones pendientes.",
    priority: "Alta",
  },
  {
    title: "Reporting y Dashboards",
    description:
      "Indicadores KPI, estadísticas de siniestralidad, estado de cumplimiento.",
    priority: "Media",
  },
];

const selectionCriteria = [
  {
    title: "Define tu necesidad principal",
    questions: [
      "¿Necesitas sobre todo gestión documental CAE?",
      "¿Control de accesos a instalaciones?",
      "¿Gestión integral de prevención?",
      "¿Formación y sensibilización?",
    ],
    tip: "No todas las plataformas hacen todo bien. Especialízate en tu dolor principal.",
  },
  {
    title: "Evalúa la automatización real",
    questions: [
      "¿Valida documentos con IA o requiere revisión manual?",
      "¿Extrae datos automáticamente o hay que introducirlos?",
      "¿Las alertas son inteligentes o genéricas?",
    ],
    tip: "Muchas plataformas prometen automatización pero siguen siendo muy manuales.",
  },
  {
    title: "Considera la experiencia de usuario",
    questions: [
      "¿Es intuitiva para tu equipo?",
      "¿Requiere formación extensa?",
      "¿Tiene app móvil si la necesitas?",
    ],
    tip: "La mejor plataforma es la que tu equipo usará sin resistencia.",
  },
  {
    title: "Revisa el modelo de precios",
    questions: [
      "¿Tarifa plana o por volumen?",
      "¿Hay costes ocultos por usuarios, contratas o documentos?",
      "¿Qué incluye y qué es extra?",
    ],
    tip: "Los costes por volumen pueden dispararse. Prefiere tarifas transparentes.",
  },
  {
    title: "Valora el soporte y formación",
    questions: [
      "¿Incluye soporte técnico?",
      "¿Hay formación inicial?",
      "¿Tiempo de respuesta a incidencias?",
    ],
    tip: "Un buen soporte es crítico durante la implementación y operación diaria.",
  },
];

const industries = [
  {
    name: "Construcción",
    challenges: "Alto riesgo, contratas múltiples, trabajadores temporales",
    solution:
      "Plataforma con validación documental CAE rápida + control de accesos integrado",
  },
  {
    name: "Industria",
    challenges: "Mantenimientos recurrentes, zonas ATEX, maquinaria peligrosa",
    solution:
      "Gestión integral PRL + permisos de trabajo + formaciones específicas",
  },
  {
    name: "Logística",
    challenges: "Rotación alta, transportistas externos, operaciones 24/7",
    solution: "Portal de contratas ágil + control de accesos automático",
  },
  {
    name: "Servicios",
    challenges: "Personal disperso, formaciones múltiples, movilidad",
    solution: "App móvil + portal de trabajadores + gestión de formaciones",
  },
];

const pricingModels = [
  {
    model: "Tarifa Plana",
    description: "Precio fijo mensual/anual independiente del volumen",
    pros: "Predecible, escalable sin sorpresas",
    cons: "Puede ser cara para empresas muy pequeñas",
    recommended: true,
  },
  {
    model: "Por Usuario",
    description: "Coste por cada usuario que accede a la plataforma",
    pros: "Proporcional al tamaño del equipo interno",
    cons: "Se encarece si muchas personas necesitan acceso",
    recommended: false,
  },
  {
    model: "Por Contrata/Trabajador",
    description: "Precio variable según número de contratas o trabajadores",
    pros: "Inicialmente barato para pocas contratas",
    cons: "Se dispara con crecimiento. Difícil de presupuestar",
    recommended: false,
  },
  {
    model: "Por Módulos",
    description: "Precio base + complementos según funcionalidades",
    pros: "Pagas solo lo que necesitas",
    cons: "Puede volverse confuso y caro con muchos módulos",
    recommended: false,
  },
];

export default function PlataformasPRLPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-playGrey">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <Shield className="h-12 w-12 text-playBlueDark" />
              <h1 className="text-4xl font-bold tracking-tight text-playBlueDark md:text-5xl lg:text-6xl">
                Plataformas PRL
              </h1>
            </div>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-playBlueLight md:text-xl">
              Guía completa para elegir la mejor{" "}
              <strong>plataforma de Prevención de Riesgos Laborales</strong>.
              Comparativa de software PRL, funcionalidades, precios y cómo
              encontrar la solución correcta para tu empresa.
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
                Hablar con Experto
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tipos de Plataformas */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Tipos de Plataformas PRL
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              No todas las plataformas PRL son iguales. Estas son las categorías
              principales:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {platformTypes.map((type, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6 transition-all hover:border-playBlueLight/50 hover:shadow-lg"
              >
                <div className="mb-4 rounded-lg bg-playBlueLight/15 p-3 w-fit">
                  <type.icon className="h-8 w-8 text-playBlueDark" />
                </div>
                <h3 className="mb-2 text-2xl font-semibold text-playBlueDark">
                  {type.title}
                </h3>
                <p className="mb-4 text-playBlueLight">{type.description}</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 text-playGreen" />
                    <div>
                      <span className="font-semibold text-playBlueLight">
                        Ideal para:
                      </span>{" "}
                      <span className="text-playBlueLight">{type.ideal}</span>
                    </div>
                  </div>
                  <div className="text-sm text-playBlueLight/80">
                    Ejemplos: {type.example}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funcionalidades Core */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Funcionalidades Clave de las Plataformas PRL
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Qué debe ofrecer una buena plataforma de prevención de riesgos
              laborales:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {coreFunctionalities.map((func, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-6"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-playBlueDark">
                    {func.title}
                  </h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      func.priority === "Alta"
                        ? "bg-securityRed/15 text-securityRed"
                        : func.priority === "Media"
                          ? "bg-playYellow/20 text-playBlueDark"
                          : "bg-playGrey text-playBlueLight"
                    }`}
                  >
                    Prioridad {func.priority}
                  </span>
                </div>
                <p className="text-playBlueLight">{func.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Criterios de Selección */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Cómo Elegir la Plataforma PRL Correcta
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              5 criterios esenciales para tomar la decisión correcta:
            </p>
          </div>

          <div className="space-y-8">
            {selectionCriteria.map((criteria, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-8"
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-playBlueDark text-xl font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-3 text-2xl font-semibold text-playBlueDark">
                      {criteria.title}
                    </h3>
                    <div className="mb-4 space-y-2">
                      {criteria.questions.map((question, qIndex) => (
                        <div key={qIndex} className="flex items-start gap-2">
                          <span className="text-playBlueDark">✓</span>
                          <span className="text-playBlueLight">{question}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg bg-playBlueLight/10 p-4">
                      <div className="flex items-start gap-2">
                        <Zap className="h-5 w-5 flex-shrink-0 text-playBlueDark" />
                        <div>
                          <span className="font-semibold text-playBlueDark">
                            Consejo:
                          </span>{" "}
                          <span className="text-playBlueDark">{criteria.tip}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modelos de Precios */}
      <section className="bg-playGrey px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Modelos de Precios en Plataformas PRL
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Entiende cómo cobran las plataformas y elige el modelo correcto:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {pricingModels.map((pricing, index) => (
              <div
                key={index}
                className={`rounded-xl border-2 bg-white p-6 ${
                  pricing.recommended
                    ? "border-playGreen/40 shadow-lg"
                    : "border-playBlueLight/20"
                }`}
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-playBlueDark">
                    {pricing.model}
                  </h3>
                  {pricing.recommended && (
                    <span className="rounded-full bg-playGreen/20 px-3 py-1 text-xs font-semibold text-playGreen">
                      Recomendado
                    </span>
                  )}
                </div>
                <p className="mb-4 text-playBlueLight">{pricing.description}</p>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-playGreen" />
                      <span className="font-semibold text-playBlueLight">Pros:</span>
                    </div>
                    <p className="text-sm text-playBlueLight">{pricing.pros}</p>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-playOrange" />
                      <span className="font-semibold text-playBlueLight">Contras:</span>
                    </div>
                    <p className="text-sm text-playBlueLight">{pricing.cons}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plataformas PRL por Industria */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-playBlueDark">
              Plataformas PRL por Industria
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
              Cada sector tiene necesidades específicas en PRL:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {industries.map((industry, index) => (
              <div
                key={index}
                className="rounded-xl border border-playBlueLight/20 bg-white p-8"
              >
                <div className="mb-4 flex items-center gap-3">
                  <Building2 className="h-8 w-8 text-playBlueDark" />
                  <h3 className="text-2xl font-semibold text-playBlueDark">
                    {industry.name}
                  </h3>
                </div>
                <div className="mb-4">
                  <h4 className="mb-2 font-semibold text-playBlueLight">Retos:</h4>
                  <p className="text-playBlueLight">{industry.challenges}</p>
                </div>
                <div className="rounded-lg bg-playGreen/10 p-4">
                  <h4 className="mb-2 font-semibold text-playBlueDark">
                    Solución ideal:
                  </h4>
                  <p className="text-playGreen">{industry.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PlayCAE */}
      <section className="bg-gradient-to-br from-playBlueDark to-playBlueLight px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              PlayCAE: Plataforma PRL Moderna y Automatizada
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-playGrey">
              Especializada en gestión documental CAE con IA real. Validación
              automática, control de accesos y cumplimiento garantizado.
            </p>

            <div className="mb-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <Brain className="mx-auto mb-3 h-12 w-12 text-white" />
                <div className="mb-2 font-semibold">IA Real</div>
                <div className="text-sm text-playGrey">
                  Extrae datos de documentos automáticamente
                </div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <Clock className="mx-auto mb-3 h-12 w-12 text-white" />
                <div className="mb-2 font-semibold">{"<1"} Semana</div>
                <div className="text-sm text-playGrey">
                  Tiempo de implementación
                </div>
              </div>
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6">
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-white" />
                <div className="mb-2 font-semibold">Tarifa Plana</div>
                <div className="text-sm text-playGrey">
                  Sin costes ocultos por volumen
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-playBlueDark transition-all hover:bg-playBlueLight/10"
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

      {/* CTA Final */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border-2 border-playBlueLight/30 bg-playBlueLight/10 p-8 text-center md:p-12">
            <h2 className="mb-4 text-2xl font-bold text-playBlueDark md:text-3xl">
              ¿No sabes qué plataforma PRL elegir?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl text-playBlueLight">
              Habla con nuestros expertos en PRL y CAE. Te ayudamos a encontrar
              la solución correcta para tu empresa.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-lg bg-playBlueDark px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-playBlueLight"
            >
              Consulta Gratuita
              <ArrowRight className="h-5 w-5" />
            </Link>
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
                name: "¿Qué es una plataforma PRL?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Una plataforma PRL es un software que ayuda a las empresas a gestionar la prevención de riesgos laborales: documentación, formaciones, evaluaciones de riesgos, accidentes, CAE y cumplimiento normativo.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuánto cuesta una plataforma PRL?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Los precios varían según el proveedor y modelo de negocio. Las tarifas planas suelen estar entre 199€-999€/mes. Modelos por volumen pueden ser más baratos inicialmente pero crecer significativamente con el uso.",
                },
              },
              {
                "@type": "Question",
                name: "¿Qué diferencia hay entre plataformas CAE y plataformas PRL?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Las plataformas CAE están especializadas en Coordinación de Actividades Empresariales (gestión de contratas y documentación). Las plataformas PRL son más amplias e incluyen evaluaciones de riesgos, formaciones, investigación de accidentes, etc. Algunas plataformas como PlayCAE ofrecen ambas.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}



