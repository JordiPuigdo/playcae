// app/(web)/plataformas-gestion-documental/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileCheck,
  Clock,
  Brain,
  Shield,
  Zap,
  Users,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Search,
  Bell,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "Plataformas de Gestión Documental CAE: Comparativa 2026 | PlayCAE",
  description:
    "Descubre las mejores plataformas de gestión documental para CAE y PRL. Automatiza validación de documentos, control de caducidades y cumplimiento normativo.",
  keywords: [
    "plataformas de gestión documental",
    "gestion documental cae",
    "gestor documental cae",
    "software gestión documental prl",
    "validación documentos cae",
  ],
  alternates: { canonical: "/plataformas-gestion-documental" },
  openGraph: {
    type: "article",
    title: "Plataformas de Gestión Documental CAE | PlayCAE",
    description:
      "Comparativa de plataformas de gestión documental para CAE. Automatización, IA y control de cumplimiento PRL.",
    url: "https://www.playcae.com/plataformas-gestion-documental",
  },
  robots: { index: true, follow: true },
};

const painPoints = [
  {
    icon: Clock,
    title: "Validación manual que consume horas",
    description:
      "Revisar manualmente cada TC1, TC2, seguro RC, formación PRL... Cada contrata nueva son horas de trabajo administrativo.",
    impact: "8-12 horas/semana por técnico PRL",
  },
  {
    icon: AlertTriangle,
    title: "Documentación caducada que pasa desapercibida",
    description:
      "Sin sistema de alertas, documentos caducan y trabajadores acceden sin estar al día. Riesgo de sanciones.",
    impact: "Sanciones de hasta 40.985€",
  },
  {
    icon: Search,
    title: "Imposible encontrar documentos cuando los necesitas",
    description:
      "Carpetas compartidas caóticas, emails con adjuntos, versiones duplicadas. Buscar un certificado es una odisea.",
    impact: "30 min - 2 horas por búsqueda",
  },
  {
    icon: Users,
    title: "Falta de visibilidad sobre el estado real",
    description:
      "¿Qué contratas tienen documentación al día? ¿Cuántos trabajadores están autorizados? Imposible saberlo sin revisar todo.",
    impact: "Decisiones basadas en información desactualizada",
  },
];

const platformCapabilities = [
  {
    icon: Brain,
    title: "Validación con IA",
    description:
      "La plataforma lee automáticamente TC1/TC2, seguros, formaciones y extrae: empresa, CIF, vigencia, coberturas, etc.",
    mustHave: true,
  },
  {
    icon: Bell,
    title: "Alertas de Caducidad",
    description:
      "Notificaciones automáticas cuando documentación está próxima a caducar (30, 15, 7 días antes).",
    mustHave: true,
  },
  {
    icon: Shield,
    title: "Validación de Requisitos Legales",
    description:
      "Verifica que cada documento cumple con los requisitos mínimos legales (coberturas de RC, vigencia de TC, etc.).",
    mustHave: true,
  },
  {
    icon: Users,
    title: "Portal de Contratas",
    description:
      "Las empresas subcontratadas suben su propia documentación en un portal dedicado, reduciendo carga administrativa.",
    mustHave: false,
  },
  {
    icon: FileCheck,
    title: "Histórico y Auditoría",
    description:
      "Registro completo de qué documentos se validaron, cuándo, por quién y qué cambios hubo.",
    mustHave: true,
  },
  {
    icon: Zap,
    title: "Integración con Control de Accesos",
    description:
      "Conexión con tornos/lectores para permitir acceso solo a trabajadores con documentación al día.",
    mustHave: false,
  },
];

const documentTypes = [
  {
    name: "TC1 y TC2 (Seguridad Social)",
    checks: [
      "Empresa correcta",
      "Trabajadores dados de alta",
      "Vigencia actualizada",
      "Formato oficial",
    ],
  },
  {
    name: "Seguro Responsabilidad Civil",
    checks: [
      "Coberturas mínimas (600.000€ - 1.200.000€)",
      "Vigencia en curso",
      "Actividad asegurada correcta",
      "Sin exclusiones relevantes",
    ],
  },
  {
    name: "Formaciones PRL",
    checks: [
      "Formación específica por puesto",
      "Centro homologado",
      "Horas mínimas cumplidas",
      "Vigencia (si aplica)",
    ],
  },
  {
    name: "Reconocimientos Médicos",
    checks: [
      "Aptitud para el puesto",
      "Vigencia (anual)",
      "Centro médico autorizado",
      "Trabajador identificado correctamente",
    ],
  },
  {
    name: "Plan de Prevención",
    checks: [
      "Evaluación de riesgos actualizada",
      "Medidas preventivas definidas",
      "Firmado por empresa y técnico",
      "Vigencia para el proyecto",
    ],
  },
  {
    name: "Certificados de Maquinaria",
    checks: [
      "Inspecciones periódicas al día",
      "Certificados CE",
      "Operador autorizado",
      "Seguros específicos",
    ],
  },
];

const benefits = [
  {
    title: "Ahorro de tiempo brutal",
    value: "85%",
    description:
      "Menos tiempo en validación manual. Lo que tomaba horas, ahora toma minutos.",
  },
  {
    title: "Reducción de errores",
    value: "90%",
    description:
      "La IA no se cansa ni se despista. Validación consistente siempre.",
  },
  {
    title: "Cumplimiento garantizado",
    value: "100%",
    description:
      "Nunca más trabajadores sin documentación al día. Alertas automáticas.",
  },
  {
    title: "ROI en 2-3 meses",
    value: "<3",
    description:
      "Recupera la inversión rápidamente con el ahorro en tiempo y evitar sanciones.",
  },
];

export default function PlataformasGestionDocumentalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
              Plataformas de Gestión Documental
              <span className="block text-blue-600">para CAE y PRL</span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-gray-600 md:text-xl">
              Descubre cómo las mejores{" "}
              <strong>plataformas de gestión documental</strong> automatizan la
              validación de documentos CAE, controlan caducidades y garantizan
              cumplimiento normativo sin esfuerzo manual.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-all hover:bg-blue-700"
              >
                Automatiza tu Gestión Documental
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-all hover:border-gray-400"
              >
                Ver Demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problemas Comunes */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Problemas de la Gestión Documental Manual
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Estos son los dolores de cabeza que una buena plataforma de
              gestión documental resuelve:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {painPoints.map((pain, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-red-300 hover:shadow-lg"
              >
                <div className="mb-4 rounded-lg bg-red-50 p-3 w-fit">
                  <pain.icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {pain.title}
                </h3>
                <p className="mb-3 text-gray-600">{pain.description}</p>
                <div className="rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Impacto:
                  </span>{" "}
                  <span className="text-sm text-gray-600">{pain.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capacidades Clave */}
      <section className="bg-gray-50 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Capacidades Clave de un Gestor Documental CAE
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Qué debe hacer una plataforma moderna de gestión documental:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {platformCapabilities.map((capability, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-blue-100 p-3">
                    <capability.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  {capability.mustHave && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Esencial
                    </span>
                  )}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {capability.title}
                </h3>
                <p className="text-gray-600">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tipos de Documentos */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Tipos de Documentos que Debe Validar
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Una plataforma completa de gestión documental CAE valida
              automáticamente:
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documentTypes.map((docType, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{docType.name}</h3>
                </div>
                <div className="space-y-2">
                  {docType.checks.map((check, checkIndex) => (
                    <div key={checkIndex} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-600">{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Beneficios de una Plataforma de Gestión Documental
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-blue-100">
              Impacto real medible en tu operación:
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="rounded-xl bg-white/10 backdrop-blur-sm p-6 text-center"
              >
                <div className="mb-2 text-5xl font-bold text-white">
                  {benefit.value}
                </div>
                <div className="mb-2 text-lg font-semibold text-white">
                  {benefit.title}
                </div>
                <div className="text-sm text-blue-100">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PlayCAE */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 p-8 md:p-12">
            <div className="mb-8 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                PlayCAE: Gestor Documental CAE con IA Real
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-700">
                La única plataforma de gestión documental que usa IA de verdad
                para validar automáticamente toda tu documentación PRL y CAE.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
              <div className="rounded-xl bg-white p-6 shadow-md">
                <Brain className="mb-3 h-10 w-10 text-blue-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  IA que entiende documentos
                </h3>
                <p className="text-gray-600">
                  Extrae datos automáticamente de TC1, TC2, seguros, formaciones,
                  aptitudes médicas. Sin intervención manual.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <Clock className="mb-3 h-10 w-10 text-green-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  Implementación express
                </h3>
                <p className="text-gray-600">
                  Operativo en menos de 1 semana. Sin consultorías eternas ni
                  configuraciones complejas.
                </p>
              </div>
              <div className="rounded-xl bg-white p-6 shadow-md">
                <Zap className="mb-3 h-10 w-10 text-orange-600" />
                <h3 className="mb-2 font-semibold text-gray-900">
                  Precio transparente
                </h3>
                <p className="text-gray-600">
                  Tarifa plana desde 199€/mes. Sin costes ocultos por volumen de
                  contratas o trabajadores.
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700"
              >
                Prueba Gratis 14 Días
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativa Manual vs Automático */}
      <section className="px-4 py-16 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Manual vs Gestión Documental Automatizada
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="grid md:grid-cols-3">
              <div className="bg-gray-50 p-6 font-semibold text-gray-900">
                Tarea
              </div>
              <div className="border-l border-gray-200 bg-red-50 p-6 text-center font-semibold text-gray-900">
                Manual
              </div>
              <div className="border-l border-gray-200 bg-green-50 p-6 text-center font-semibold text-gray-900">
                Con PlayCAE
              </div>

              <div className="border-t border-gray-200 p-6">
                Validar TC1 de 1 contrata
              </div>
              <div className="border-l border-t border-gray-200 p-6 text-center text-gray-600">
                10-15 min
              </div>
              <div className="border-l border-t border-gray-200 p-6 text-center font-semibold text-green-600">
                {"<"} 30 seg
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-6">
                Verificar coberturas RC
              </div>
              <div className="border-l border-t border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
                5-10 min
              </div>
              <div className="border-l border-t border-gray-200 bg-gray-50 p-6 text-center font-semibold text-green-600">
                {"<"} 10 seg
              </div>

              <div className="border-t border-gray-200 p-6">
                Controlar caducidades
              </div>
              <div className="border-l border-t border-gray-200 p-6 text-center text-gray-600">
                Excel manual
              </div>
              <div className="border-l border-t border-gray-200 p-6 text-center font-semibold text-green-600">
                Automático
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-6">
                Buscar un documento
              </div>
              <div className="border-l border-t border-gray-200 bg-gray-50 p-6 text-center text-gray-600">
                5-30 min
              </div>
              <div className="border-l border-t border-gray-200 bg-gray-50 p-6 text-center font-semibold text-green-600">
                {"<"} 5 seg
              </div>

              <div className="border-t border-gray-200 p-6">
                Generar informe de estado
              </div>
              <div className="border-l border-t border-gray-200 p-6 text-center text-gray-600">
                1-2 horas
              </div>
              <div className="border-l border-t border-gray-200 p-6 text-center font-semibold text-green-600">
                1 clic
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-center text-white shadow-2xl md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Deja de Perder Tiempo en Validación Manual
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
              Únete a las empresas que ya automatizan su gestión documental CAE
              con PlayCAE
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition-all hover:bg-blue-50"
              >
                Prueba Gratis 14 Días
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/servicios/gestion-documentacion-cae"
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                Más sobre Gestión Documental
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
                name: "¿Qué es una plataforma de gestión documental CAE?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Es un software que automatiza la validación, almacenamiento y control de documentación relacionada con Coordinación de Actividades Empresariales: TC1/TC2, seguros RC, formaciones PRL, reconocimientos médicos, etc.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuánto tiempo se ahorra con un gestor documental CAE?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Las empresas ahorran típicamente un 85% del tiempo dedicado a validación manual. Lo que tomaba 8-12 horas semanales se reduce a 1-2 horas con automatización.",
                },
              },
              {
                "@type": "Question",
                name: "¿Qué documentos puede validar una plataforma de gestión documental?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Las plataformas modernas validan TC1 y TC2, seguros de RC, formaciones PRL, reconocimientos médicos, planes de prevención, certificados de maquinaria y cualquier documentación relacionada con PRL y CAE.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
