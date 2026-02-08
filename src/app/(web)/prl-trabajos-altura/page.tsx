// app/(web)/prl-trabajos-altura/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  AlertTriangle,
  FileCheck,
  Users,
  Clipboard,
  HardHat,
  CheckCircle,
  Clock,
  Scale,
  Briefcase,
  GraduationCap,
  Heart,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "PRL Trabajos en Altura: Normativa, Formación y Prevención 2026 | PlayCAE",
  description:
    "Guía completa sobre PRL en trabajos en altura: normativa RD 2177/2004, formación obligatoria, EPIs, medidas preventivas y cómo gestionar la documentación CAE.",
  keywords: [
    "prl trabajos en altura",
    "trabajos en altura prl",
    "prl trabajo en altura",
    "prevención riesgos laborales altura",
    "formación trabajos en altura",
  ],
  alternates: { canonical: "/prl-trabajos-altura" },
  openGraph: {
    type: "article",
    title: "PRL Trabajos en Altura: Guía Completa 2026 | PlayCAE",
    description:
      "Todo sobre prevención de riesgos laborales en trabajos en altura. Normativa, formación obligatoria y documentación requerida.",
    url: "https://www.playcae.com/prl-trabajos-altura",
  },
  robots: { index: true, follow: true },
};

const requiredDocs = [
  {
    icon: GraduationCap,
    title: "Formación Específica en Trabajos en Altura",
    description:
      "Certificado de formación teórica y práctica sobre riesgos, técnicas de trabajo y uso de EPIs. Obligatorio según RD 2177/2004.",
    validity: "3 años (recomendado)",
  },
  {
    icon: Heart,
    title: "Reconocimiento Médico Específico",
    description:
      "Examen médico que evalúa aptitud para trabajos en altura: vértigo, problemas cardiovasculares, epilepsia, etc.",
    validity: "Anual",
  },
  {
    icon: FileCheck,
    title: "Plan de Prevención y Evaluación de Riesgos",
    description:
      "Documento que identifica riesgos específicos del trabajo en altura y medidas preventivas a aplicar.",
    validity: "Por proyecto",
  },
  {
    icon: Shield,
    title: "Certificado de EPIs",
    description:
      "Verificación de que arneses, líneas de vida, mosquetones y demás EPIs están certificados y en buen estado.",
    validity: "Según fabricante",
  },
  {
    icon: Users,
    title: "Autorización del Trabajador",
    description:
      "Documento interno de la empresa que autoriza al trabajador para realizar trabajos en altura tras verificar formación y aptitud médica.",
    validity: "Variable",
  },
];

const riskTypes = [
  {
    title: "Caídas en altura",
    description:
      "Principal causa de accidentes mortales. Caídas desde escaleras, andamios, cubiertas, plataformas elevadoras.",
    prevention:
      "EPIs anticaídas (arnés + línea de vida), barandillas, redes de seguridad.",
  },
  {
    title: "Caída de objetos",
    description:
      "Herramientas, materiales o equipos que caen desde altura pueden herir gravemente a personas en niveles inferiores.",
    prevention:
      "Señalización de zonas, acordonamiento, uso de redes, portaherramientas.",
  },
  {
    title: "Condiciones meteorológicas",
    description:
      "Viento, lluvia, hielo o nieve aumentan exponencialmente el riesgo de caída.",
    prevention:
      "Suspensión de trabajos con viento >40 km/h, lluvia intensa o hielo.",
  },
  {
    title: "Estructuras inestables",
    description:
      "Andamios mal montados, superficies frágiles (fibrocemento, claraboyas), plataformas sobrecargadas.",
    prevention:
      "Inspección previa, montaje por personal cualificado, señalización de zonas frágiles.",
  },
];

const epiList = [
  {
    name: "Arnés anticaídas",
    description:
      "Arnés de cuerpo completo con punto de anclaje dorsal. Certificación CE EN 361.",
  },
  {
    name: "Línea de vida / Absorbedor de energía",
    description:
      "Elemento de amarre que conecta el arnés al punto de anclaje. Absorbe la energía en caso de caída.",
  },
  {
    name: "Casco con barboquejo",
    description:
      "Protección craneal con sistema de retención que evita que se desprenda en caso de caída.",
  },
  {
    name: "Calzado de seguridad antideslizante",
    description:
      "Botas con suela antideslizante, puntera reforzada y tobillo protegido.",
  },
  {
    name: "Guantes anticorte",
    description: "Protección de manos contra cortes, rozaduras y abrasiones.",
  },
];

const trainingModules = [
  "Normativa PRL aplicable a trabajos en altura (RD 2177/2004)",
  "Identificación de riesgos y medidas preventivas",
  "Selección, uso y mantenimiento de EPIs anticaídas",
  "Técnicas de progresión y posicionamiento",
  "Sistemas de anclaje y líneas de vida",
  "Operaciones de rescate y evacuación básica",
  "Primeros auxilios específicos en trabajos en altura",
];

const sanctions = [
  {
    type: "Infracción Grave",
    range: "2.046€ - 40.985€",
    examples:
      "No proporcionar formación específica, EPIs inadecuados, trabajadores sin reconocimiento médico.",
  },
  {
    type: "Infracción Muy Grave",
    range: "40.986€ - 819.780€",
    examples:
      "Accidentes por falta de medidas preventivas, trabajos sin sistemas anticaídas, poner en peligro grave la vida de trabajadores.",
  },
];

export default function PRLTrabajosAlturaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="mb-6 flex items-center justify-center gap-3">
              <AlertTriangle className="h-12 w-12 text-orange-500" />
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                PRL Trabajos en Altura
              </h1>
            </div>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 md:text-xl">
              Guía completa sobre{" "}
              <strong>Prevención de Riesgos Laborales en Trabajos en Altura</strong>:
              normativa RD 2177/2004, formación obligatoria, EPIs y cómo
              gestionar la documentación CAE correctamente.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
              >
                Gestiona tu Documentación PRL
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:border-gray-400"
              >
                Consulta con Expertos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Qué son los Trabajos en Altura? */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white p-8 shadow-xl md:p-12">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              ¿Qué se Considera Trabajo en Altura?
            </h2>
            <p className="mb-4 text-lg text-gray-700">
              Según el <strong>RD 2177/2004</strong>, se considera{" "}
              <strong>trabajo en altura</strong> cualquier actividad laboral
              que se desarrolle <strong>a partir de 2 metros</strong> sobre el
              nivel del suelo y que entrañe riesgo de caída.
            </p>
            <p className="mb-6 text-lg text-gray-700">
              Esto incluye: trabajos en cubiertas, tejados, andamios,
              plataformas elevadoras, escaleras, torres de comunicaciones,
              postes eléctricos, estructuras metálicas, trabajos verticales con
              cuerdas, y cualquier actividad en altura con riesgo de caída.
            </p>

            <div className="rounded-xl bg-orange-50 border-l-4 border-orange-500 p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-6 w-6 flex-shrink-0 text-orange-600" />
                <div>
                  <h3 className="mb-2 font-semibold text-orange-900">
                    Dato importante
                  </h3>
                  <p className="text-orange-800">
                    Las caídas en altura representan el{" "}
                    <strong>25% de los accidentes mortales</strong> en el sector
                    de la construcción. Una correcta prevención y formación puede
                    salvar vidas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documentación Obligatoria */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Documentación Obligatoria PRL para Trabajos en Altura
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Documentos que trabajadores y empresas deben tener en regla antes
              de realizar trabajos en altura:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {requiredDocs.map((doc, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-orange-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-orange-100 p-3">
                    <doc.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    {doc.validity}
                  </span>
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {doc.title}
                </h3>
                <p className="text-gray-600">{doc.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl bg-blue-50 p-8 text-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">
              Automatiza la Gestión Documental
            </h3>
            <p className="mx-auto mb-6 max-w-2xl text-gray-700">
              PlayCAE valida automáticamente toda la documentación PRL de tus
              contratas y trabajadores. Evita sanciones y ahorra tiempo.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
            >
              Prueba Gratis 14 Días
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Riesgos y Prevención */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Principales Riesgos y Medidas Preventivas
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Identificación de riesgos específicos en trabajos en altura y cómo
              prevenirlos
            </p>
          </div>

          <div className="space-y-6">
            {riskTypes.map((risk, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-orange-600">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl font-semibold text-gray-900">
                      {risk.title}
                    </h3>
                    <p className="mb-3 text-gray-700">{risk.description}</p>
                    <div className="rounded-lg bg-green-50 p-4">
                      <div className="flex items-start gap-2">
                        <Shield className="h-5 w-5 flex-shrink-0 text-green-600" />
                        <div>
                          <span className="font-semibold text-green-900">
                            Prevención:
                          </span>{" "}
                          <span className="text-green-800">{risk.prevention}</span>
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

      {/* EPIs */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <HardHat className="mx-auto mb-4 h-16 w-16 text-orange-600" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              EPIs Obligatorios para Trabajos en Altura
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Equipos de Protección Individual que todo trabajador debe usar:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {epiList.map((epi, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">{epi.name}</h3>
                </div>
                <p className="text-sm text-gray-600">{epi.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border-2 border-orange-300 bg-orange-50 p-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-8 w-8 flex-shrink-0 text-orange-600" />
              <div>
                <h3 className="mb-2 text-xl font-semibold text-orange-900">
                  Revisión y Mantenimiento
                </h3>
                <p className="text-orange-800">
                  Los EPIs anticaídas deben revisarse antes de cada uso y
                  someterse a revisión periódica por personal competente. Un EPI
                  en mal estado puede ser tan peligroso como no llevarlo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formación */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <GraduationCap className="mx-auto mb-4 h-16 w-16 text-blue-600" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Formación en Trabajos en Altura
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Contenidos mínimos que debe incluir la formación específica según
              RD 2177/2004:
            </p>
          </div>

          <div className="rounded-2xl bg-white p-8 shadow-xl md:p-12">
            <div className="grid gap-4 md:grid-cols-2">
              {trainingModules.map((module, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 flex-shrink-0 text-green-600" />
                  <span className="text-gray-700">{module}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-blue-50 p-6">
              <h3 className="mb-2 font-semibold text-blue-900">
                Duración y renovación
              </h3>
              <p className="text-blue-800">
                La formación mínima es de <strong>8 horas</strong>{" "}
                (teórico-prácticas). Se recomienda renovar cada <strong>3 años</strong>{" "}
                o cuando cambien significativamente las condiciones de trabajo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sanciones */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <Scale className="mx-auto mb-4 h-16 w-16 text-red-600" />
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Sanciones por Incumplimiento
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Infracciones comunes en PRL de trabajos en altura y sus sanciones:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {sanctions.map((sanction, index) => (
              <div
                key={index}
                className="rounded-xl border-2 border-red-200 bg-white p-8"
              >
                <div className="mb-4">
                  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                    {sanction.type}
                  </span>
                </div>
                <div className="mb-4 text-3xl font-bold text-red-600">
                  {sanction.range}
                </div>
                <div>
                  <h4 className="mb-2 font-semibold text-gray-900">
                    Ejemplos de infracciones:
                  </h4>
                  <p className="text-gray-700">{sanction.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center text-white">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Simplifica la Gestión PRL de Trabajos en Altura
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
              PlayCAE valida automáticamente formaciones específicas,
              reconocimientos médicos y autorizaciones de trabajadores. Evita
              sanciones y protege a tu equipo.
            </p>

            <div className="mb-12 grid gap-8 md:grid-cols-3">
              <div>
                <CheckCircle className="mx-auto mb-3 h-12 w-12 text-blue-200" />
                <div className="font-semibold">Validación Automática</div>
                <div className="text-sm text-blue-100">
                  de formaciones y aptitudes médicas
                </div>
              </div>
              <div>
                <Clock className="mx-auto mb-3 h-12 w-12 text-blue-200" />
                <div className="font-semibold">Alertas de Caducidad</div>
                <div className="text-sm text-blue-100">
                  para renovar documentación a tiempo
                </div>
              </div>
              <div>
                <Shield className="mx-auto mb-3 h-12 w-12 text-blue-200" />
                <div className="font-semibold">Cumplimiento Garantizado</div>
                <div className="text-sm text-blue-100">
                  con normativa RD 2177/2004
                </div>
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
                name: "¿Qué formación es obligatoria para trabajos en altura?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Es obligatoria la formación específica teórico-práctica de mínimo 8 horas que incluya: normativa aplicable, identificación de riesgos, uso de EPIs anticaídas, técnicas de trabajo y procedimientos de emergencia.",
                },
              },
              {
                "@type": "Question",
                name: "¿A partir de qué altura se considera trabajo en altura?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Según el RD 2177/2004, se considera trabajo en altura cualquier actividad laboral que se desarrolle a partir de 2 metros sobre el nivel del suelo y que entrañe riesgo de caída.",
                },
              },
              {
                "@type": "Question",
                name: "¿Qué EPIs son obligatorios para trabajos en altura?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Los EPIs obligatorios incluyen: arnés anticaídas de cuerpo completo, línea de vida con absorbedor de energía, casco con barboquejo, calzado antideslizante y guantes anticorte. Todos deben estar certificados CE.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
