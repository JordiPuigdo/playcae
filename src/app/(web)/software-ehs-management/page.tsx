// app/(web)/software-ehs-management/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  FileSearch,
  Bell,
  Users,
  ChevronRight,
  TrendingUp,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Software EHS Management: Auditorías, Incidentes y Riesgos | PlayCAE 2026",
  description:
    "PlayCAE es el software EHS management para empresas españolas. Gestiona auditorías de seguridad, incidentes laborales y riesgos de contratistas desde una sola plataforma. ISO 45001 y RD 171/2004.",
  keywords: [
    "software ehs management",
    "ehs management software",
    "software ehs",
    "gestion ehs",
    "audit management software",
    "incident management software",
    "risk management software",
    "software auditoria seguridad",
    "gestion incidentes laborales",
    "gestion riesgos prl",
    "software prevencion riesgos laborales",
    "software iso 45001",
    "ehs software españa",
    "health safety environment software",
    "software seguridad y salud laboral",
    "plataforma ehs",
  ],
  alternates: { canonical: "/software-ehs-management" },
  openGraph: {
    type: "article",
    title: "Software EHS Management: Auditorías, Incidentes y Riesgos | PlayCAE",
    description:
      "Gestiona auditorías de seguridad, incidentes laborales y evaluación de riesgos de contratistas con PlayCAE. La plataforma EHS para empresas que trabajan con contratas.",
    url: "https://www.playcae.com/software-ehs-management",
    images: [
      {
        url: "https://www.playcae.com/og-logo.png",
        alt: "PlayCAE – Software EHS Management",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@PlayCae",
    title: "Software EHS Management | PlayCAE",
    description:
      "Audit Management, Incident Management y Risk Management para contratas y empresas principales. Todo en una sola plataforma.",
    images: ["https://www.playcae.com/og-logo.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PlayCAE EHS Management",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "Software EHS Management para la gestión de auditorías de seguridad, incidentes laborales y riesgos de contratistas. Cumplimiento RD 171/2004 e ISO 45001.",
  offers: {
    "@type": "Offer",
    url: "https://www.playcae.com/precios",
    priceCurrency: "EUR",
  },
  featureList: [
    "Audit Management",
    "Incident Management",
    "Risk Management",
    "Gestión documental PRL",
    "Control de accesos contratistas",
    "Alertas automáticas de caducidad",
  ],
  url: "https://www.playcae.com/software-ehs-management",
  provider: {
    "@type": "Organization",
    name: "PlayCAE",
    url: "https://www.playcae.com",
  },
};

const coreFeatures = [
  {
    icon: FileSearch,
    id: "audit-management",
    tag: "Audit Management",
    title: "Gestión de Auditorías EHS",
    description:
      "Planifica, ejecuta y haz seguimiento de todas las auditorías de seguridad y salud laboral de tus contratas desde una sola plataforma.",
    details: [
      "Registro centralizado de auditorías por empresa contratista y centro de trabajo",
      "Historial completo con trazabilidad: quién auditó, cuándo y qué resultado obtuvo",
      "Gestión de hallazgos y no conformidades con asignación de responsables",
      "Seguimiento del estado de las acciones correctivas hasta su cierre",
      "Informes de auditoría exportables para inspecciones y certificaciones",
      "Alertas automáticas para auditorías próximas o vencidas",
    ],
    isoTag: "ISO 45001 · ISO 14001",
  },
  {
    icon: AlertTriangle,
    id: "incident-management",
    tag: "Incident Management",
    title: "Gestión de Incidentes Laborales",
    description:
      "Registra y gestiona incidentes, accidentes y situaciones de riesgo de tus trabajadores y contratistas con trazabilidad completa.",
    details: [
      "Registro inmediato de incidentes y accidentes con formulario guiado",
      "Clasificación por tipo: accidente, casi-accidente, situación peligrosa",
      "Investigación de causas raíz y generación de informes de investigación",
      "Plan de acciones correctivas y preventivas (ACAP) con seguimiento",
      "Notificaciones automáticas a responsables de EHS y dirección",
      "Estadísticas e indicadores: índice de frecuencia, gravedad y incidencia",
    ],
    isoTag: "RD 171/2004 · Ley 31/1995",
  },
  {
    icon: BarChart3,
    id: "risk-management",
    tag: "Risk Management",
    title: "Gestión y Evaluación de Riesgos",
    description:
      "Controla los riesgos asociados a cada contratista y actividad mediante la validación documental de evaluaciones de riesgos y medidas preventivas.",
    details: [
      "Validación automática de evaluaciones de riesgos y planes de seguridad de contratistas",
      "Matriz de riesgos por empresa, actividad y centro de trabajo",
      "Control documental de medidas preventivas y EPIs de trabajadores externos",
      "Análisis de riesgo antes de autorizar el acceso a cada trabajador contratista",
      "Identificación de riesgos por vencimiento de documentación crítica",
      "Visibilidad en tiempo real del nivel de riesgo de cada contratista activo",
    ],
    isoTag: "ISO 45001 · RD 171/2004",
  },
];

const platformBenefits = [
  {
    icon: Shield,
    title: "Cumplimiento legal automático",
    description:
      "RD 171/2004, Ley 31/1995 e ISO 45001 cubiertos sin esfuerzo manual. La plataforma valida el cumplimiento en tiempo real.",
  },
  {
    icon: Bell,
    title: "Alertas proactivas",
    description:
      "Nunca más un incidente sin registrar ni una auditoría olvidada. Las notificaciones automáticas mantienen a todo el equipo EHS al día.",
  },
  {
    icon: TrendingUp,
    title: "Indicadores EHS en un solo panel",
    description:
      "KPIs de auditorías, incidentes y riesgos consolidados. Toma decisiones con datos reales sin exportar a Excel.",
  },
  {
    icon: Users,
    title: "Diseñado para contratas",
    description:
      "Gestiona el EHS de todas tus empresas contratistas desde una sola cuenta. Cada contratista accede solo a su información.",
  },
  {
    icon: Lock,
    title: "Trazabilidad ante inspecciones",
    description:
      "Cada acción queda registrada con usuario, fecha y hora. Demuestra diligencia debida ante Inspección de Trabajo en segundos.",
  },
  {
    icon: CheckCircle,
    title: "Implementación en días",
    description:
      "Sin proyectos de meses ni consultorías costosas. PlayCAE está operativo para tu equipo EHS en menos de una semana.",
  },
];

const comparisonTable = [
  { feature: "Gestión de auditorías de seguridad", playcae: true, excel: false, generic: false },
  { feature: "Registro y seguimiento de incidentes", playcae: true, excel: false, generic: true },
  { feature: "Evaluación de riesgos de contratistas", playcae: true, excel: false, generic: false },
  { feature: "Validación documental automática con IA", playcae: true, excel: false, generic: false },
  { feature: "Alertas de caducidad en tiempo real", playcae: true, excel: false, generic: false },
  { feature: "Control de acceso basado en riesgo", playcae: true, excel: false, generic: false },
  { feature: "Informes para auditorías ISO y legales", playcae: true, excel: false, generic: true },
  { feature: "Portal para empresas contratistas", playcae: true, excel: false, generic: false },
];

const faqItems = [
  {
    question: "¿Qué es un software EHS Management?",
    answer:
      "Un software EHS Management (Environment, Health & Safety) es una herramienta digital que centraliza la gestión de seguridad y salud laboral, medioambiente y calidad. Incluye funcionalidades de audit management (gestión de auditorías), incident management (gestión de incidentes) y risk management (gestión de riesgos) para ayudar a las empresas a cumplir normativas como ISO 45001, ISO 14001 y el RD 171/2004.",
  },
  {
    question: "¿PlayCAE cubre las 3 áreas clave del EHS: auditorías, incidentes y riesgos?",
    answer:
      "Sí. PlayCAE incluye gestión de auditorías de seguridad de contratistas con historial y seguimiento de hallazgos, registro y gestión de incidentes laborales con investigación de causas, y evaluación y control de riesgos mediante la validación documental de medidas preventivas y evaluaciones de riesgo de cada empresa contratista.",
  },
  {
    question: "¿PlayCAE es compatible con ISO 45001 e ISO 14001?",
    answer:
      "PlayCAE está diseñado para apoyar el cumplimiento de ISO 45001 (seguridad y salud laboral) y el RD 171/2004. La gestión de auditorías, incidentes y riesgos documentada en la plataforma sirve como evidencia de cumplimiento ante certificadoras y en auditorías externas.",
  },
  {
    question: "¿Cómo gestiona PlayCAE los riesgos de contratistas?",
    answer:
      "PlayCAE valida automáticamente las evaluaciones de riesgo, planes de seguridad y documentación preventiva de cada empresa contratista. Solo los trabajadores con toda la documentación de riesgo en regla reciben autorización de acceso. El sistema muestra en tiempo real el nivel de riesgo de cada contratista activo y alerta antes de que cualquier documento caduque.",
  },
  {
    question: "¿Puedo usar PlayCAE como evidencia ante Gartner o en auditorías externas?",
    answer:
      "Sí. PlayCAE genera informes completos con trazabilidad total (quién, cuándo, qué) de todas las auditorías realizadas, incidentes gestionados y controles de riesgo aplicados. Estos informes son válidos como evidencia ante certificadoras ISO, Inspección de Trabajo y plataformas de evaluación de software como Gartner.",
  },
  {
    question: "¿Qué diferencia hay entre PlayCAE y un software EHS genérico?",
    answer:
      "PlayCAE está especializado en la gestión EHS de empresas con contratistas, cumpliendo el RD 171/2004 y la Ley 31/1995. A diferencia de software EHS genérico, PlayCAE incluye un portal para que las propias contratas suban su documentación de seguridad, validación automática con IA y control de accesos basado en el nivel de riesgo de cada trabajador externo.",
  },
];

export default function SoftwareEHSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-white to-playGrey">
        {/* Hero */}
        <section className="px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center">
              <span className="mb-4 inline-block rounded-full bg-playBlueDark/10 px-4 py-2 text-sm font-semibold text-playBlueDark">
                EHS Management Software
              </span>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-playBlueDark md:text-5xl lg:text-6xl">
                Software EHS Management
                <span className="block text-playBlueLight">
                  Auditorías, Incidentes y Riesgos en una sola plataforma
                </span>
              </h1>
              <p className="mx-auto mb-8 max-w-3xl text-lg text-playBlueLight md:text-xl">
                PlayCAE es el <strong>software EHS</strong> diseñado para empresas españolas
                que trabajan con contratistas. Gestiona{" "}
                <strong>auditorías de seguridad</strong>,{" "}
                <strong>incidentes laborales</strong> y{" "}
                <strong>evaluación de riesgos</strong> cumpliendo el RD 171/2004
                e ISO 45001 sin esfuerzo manual.
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
                  Ver demo
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tres funcionalidades principales */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-playBlueDark md:text-4xl">
                Las 3 funcionalidades clave del EHS Management
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
                Audit Management, Incident Management y Risk Management integrados
                en una plataforma especializada en contratistas.
              </p>
            </div>

            <div className="space-y-12">
              {coreFeatures.map((feature, index) => {
                const Icon = feature.icon;
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={feature.id}
                    id={feature.id}
                    className="scroll-mt-20 rounded-2xl bg-white p-8 shadow-xl md:p-12"
                  >
                    <div
                      className={`flex flex-col gap-10 md:flex-row ${
                        isEven ? "" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Texto */}
                      <div className="flex-1">
                        <div className="mb-4 flex items-center gap-3">
                          <span className="rounded-full bg-playBlueDark/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-playBlueDark">
                            {feature.tag}
                          </span>
                          <span className="rounded-full bg-playOrange/10 px-3 py-1 text-xs font-semibold text-playOrange">
                            {feature.isoTag}
                          </span>
                        </div>
                        <h3 className="mb-4 text-2xl font-bold text-playBlueDark md:text-3xl">
                          {feature.title}
                        </h3>
                        <p className="mb-6 text-lg text-playBlueLight">
                          {feature.description}
                        </p>
                        <ul className="space-y-3">
                          {feature.details.map((detail, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-playOrange" />
                              <span className="text-playBlueLight">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* Icono visual */}
                      <div className="flex flex-1 items-center justify-center">
                        <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-gradient-to-br from-playBlueDark/10 to-playBlueLight/10 shadow-inner md:h-64 md:w-64">
                          <Icon className="h-24 w-24 text-playBlueDark md:h-32 md:w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Beneficios de la plataforma */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-playBlueDark md:text-4xl">
                Por qué los equipos EHS eligen PlayCAE
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
                Una plataforma EHS pensada para la realidad de las empresas
                españolas que coordinan actividades con contratistas.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {platformBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="rounded-2xl bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-playBlueDark/10">
                      <Icon className="h-6 w-6 text-playBlueDark" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold text-playBlueDark">
                      {benefit.title}
                    </h3>
                    <p className="text-playBlueLight">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Tabla comparativa */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-playBlueDark md:text-4xl">
                PlayCAE vs. otras soluciones EHS
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-playBlueLight">
                No todas las herramientas cubren las funcionalidades EHS clave.
                Aquí la diferencia.
              </p>
            </div>
            <div className="overflow-x-auto rounded-2xl bg-white shadow-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-playGrey">
                    <th className="p-5 text-sm font-semibold text-playBlueDark">
                      Funcionalidad EHS
                    </th>
                    <th className="p-5 text-center text-sm font-semibold text-playOrange">
                      PlayCAE
                    </th>
                    <th className="p-5 text-center text-sm font-semibold text-playBlueLight">
                      Excel / Manual
                    </th>
                    <th className="p-5 text-center text-sm font-semibold text-playBlueLight">
                      Software genérico
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonTable.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-playGrey/30" : "bg-white"}
                    >
                      <td className="p-5 text-sm text-playBlueDark">
                        {row.feature}
                      </td>
                      <td className="p-5 text-center">
                        {row.playcae ? (
                          <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {row.excel ? (
                          <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-red-400 font-bold">✕</span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {row.generic ? (
                          <CheckCircle className="mx-auto h-5 w-5 text-green-500" />
                        ) : (
                          <span className="text-red-400 font-bold">✕</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Quién lo necesita */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-6xl">
            <div className="rounded-2xl bg-playBlueDark px-8 py-12 text-white md:px-16">
              <h2 className="mb-8 text-center text-3xl font-bold md:text-4xl">
                ¿Para quién es PlayCAE EHS?
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Responsables EHS / QHSE",
                    desc: "Centraliza auditorías, incidentes y evaluaciones de riesgo de todas las contratas en un solo panel.",
                  },
                  {
                    title: "Técnicos de PRL",
                    desc: "Gestiona la documentación preventiva de contratistas con validación automática y alertas de caducidad.",
                  },
                  {
                    title: "Directores de Calidad",
                    desc: "Genera evidencias para auditorías ISO 45001 e ISO 14001 sin buscar documentos en carpetas.",
                  },
                  {
                    title: "Directores de Operaciones",
                    desc: "Controla el nivel de riesgo real de tus contratistas antes de que accedan a tus instalaciones.",
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                    <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-white/80">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-playBlueDark md:text-4xl">
                Preguntas frecuentes sobre software EHS
              </h2>
            </div>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="group rounded-xl bg-white p-6 shadow-md open:shadow-lg"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-playBlueDark">
                    <span>{item.question}</span>
                    <ChevronRight className="h-5 w-5 shrink-0 transition-transform group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-playBlueLight">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="px-4 py-16 md:py-24">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-playBlueDark md:text-4xl">
              Empieza a gestionar tu EHS de forma inteligente
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-playBlueLight">
              Únete a los equipos EHS que ya gestionan auditorías, incidentes y
              riesgos de contratistas con PlayCAE. Sin instalación, sin
              formación costosa.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-playOrange px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-playBlueLight"
              >
                Prueba gratis 14 días
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border border-playBlueLight/30 bg-white px-8 py-4 text-lg font-semibold text-playBlueLight transition-all hover:border-playBlueLight/50"
              >
                Solicitar demo
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
