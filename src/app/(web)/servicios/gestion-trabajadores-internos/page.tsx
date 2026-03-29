import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  Users,
  Shield,
  Bell,
  UserPlus,
  Brain,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  FolderOpen,
  BadgeCheck,
  Timer,
  ClipboardCheck,
  IdCard,
  History,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Gestión Documental de Trabajadores Internos",
  description:
    "Centraliza y automatiza la documentación PRL de tus trabajadores internos. DNI, formaciones, reconocimientos médicos y control de entradas y salidas. Cumple normativa sin esfuerzo.",
  keywords: [
    "gestión documental trabajadores",
    "documentación trabajadores internos",
    "software gestión empleados PRL",
    "control documental trabajadores",
    "formación PRL trabajadores internos",
    "reconocimiento médico trabajadores",
    "gestión entradas salidas empleados",
    "software RRHH PRL",
  ],
  alternates: {
    canonical: "https://www.playcae.com/servicios/gestion-trabajadores-internos",
  },
  openGraph: {
    title: "Gestión Documental de Trabajadores Internos | PlayCAE",
    description:
      "Automatiza la documentación PRL de tu plantilla. DNI, formaciones, reconocimientos médicos y registro de jornada en una sola plataforma.",
    url: "https://www.playcae.com/servicios/gestion-trabajadores-internos",
    siteName: "PlayCAE",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "https://www.playcae.com/og-logo.png",
        alt: "PlayCAE – Plataforma CAE con IA",
      },
    ],
  },
  robots: { index: true, follow: true },
};

const stats = [
  { value: "100%", label: "Documentación siempre al día" },
  { value: "0", label: "Documentos caducados sin detectar" },
  { value: "<30s", label: "Tiempo de validación por documento" },
  { value: "24/7", label: "Monitorización automática" },
];

const painPoints = [
  {
    icon: FolderOpen,
    title: "Documentación dispersa y desactualizada",
    description:
      "Contratos, DNIs, formaciones y reconocimientos médicos en carpetas distintas, correos y Excel. Imposible saber qué está vigente.",
  },
  {
    icon: Shield,
    title: "Riesgo en inspecciones de Trabajo",
    description:
      "Sin evidencia de que tus trabajadores tienen formación PRL al día, la empresa responde ante la Inspección de Trabajo.",
  },
  {
    icon: Bell,
    title: "Renovaciones que se escapan",
    description:
      "Los reconocimientos médicos y formaciones caducan. Sin alertas automáticas, el incumplimiento se detecta demasiado tarde.",
  },
  {
    icon: History,
    title: "Sin registro fiable de entradas y salidas",
    description:
      "Cumplir con la normativa de registro de jornada (RDL 8/2019) sin un sistema centralizado genera lagunas legales.",
  },
];

const processSteps = [
  {
    step: 1,
    title: "Alta del trabajador",
    description:
      "Añade al trabajador manualmente o importa desde tu sistema de RRHH. PlayCAE solicita automáticamente los documentos necesarios según su puesto.",
    icon: UserPlus,
  },
  {
    step: 2,
    title: "Validación automática con IA",
    description:
      "Nuestro agente IA verifica cada documento: DNI vigente, formación PRL específica al puesto, reconocimiento médico en vigor. En segundos.",
    icon: Brain,
  },
  {
    step: 3,
    title: "Control y alertas continuas",
    description:
      "Registro de entradas y salidas, alertas 30 días antes de cada caducidad y dashboard con el estado de toda la plantilla en tiempo real.",
    icon: CheckCircle,
  },
];

const features = [
  {
    icon: FolderOpen,
    title: "Expediente digital por trabajador",
    description:
      "Toda la documentación de cada empleado en un único lugar: DNI, formación PRL, reconocimiento médico, contrato y más. Accesible en segundos.",
  },
  {
    icon: Brain,
    title: "Validación IA de documentos",
    description:
      "Nuestro agente verifica autenticidad, vigencia y coherencia normativa de cada documento automáticamente.",
  },
  {
    icon: Bell,
    title: "Alertas de caducidad automáticas",
    description:
      "Notificaciones 30 días antes de que expire cualquier documento. Nunca más un reconocimiento médico caducado en una auditoría.",
  },
  {
    icon: Timer,
    title: "Registro de entradas y salidas",
    description:
      "Cumple con el RDL 8/2019 de registro de jornada. Hora de entrada, salida y tiempo trabajado por cada empleado, automáticamente.",
  },
  {
    icon: BadgeCheck,
    title: "Gestión de formaciones PRL",
    description:
      "Registra y valida las formaciones obligatorias de cada puesto. Historial completo con certificados y fechas de validez.",
  },
  {
    icon: ClipboardCheck,
    title: "Informes para inspecciones",
    description:
      "Exporta evidencias de cumplimiento listas para la Inspección de Trabajo. Trazabilidad completa de cada documento y validación.",
  },
];

const documentTypes = [
  "DNI / NIE vigente",
  "Formación PRL básica (50h o 20h)",
  "Formación PRL específica al puesto",
  "Reconocimiento médico en vigor",
  "Entrega y recepción de EPIs",
  "Contrato de trabajo",
  "Alta en Seguridad Social",
  "Autorización de equipos y maquinaria",
  "Certificado de aptitud para el puesto",
];

export default function GestionTrabajadoresInternosPage() {
  const softwareApplicationLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PlayCAE - Gestión Trabajadores Internos",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Módulo de gestión documental de trabajadores internos de PlayCAE. Centraliza DNI, formaciones PRL, reconocimientos médicos y registro de jornada.",
    url: "https://www.playcae.com/servicios/gestion-trabajadores-internos",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      description: "Prueba gratuita disponible",
    },
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Que documentos internos puede gestionar PlayCAE?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PlayCAE centraliza DNI/NIE, formacion PRL, reconocimientos medicos, contratos, altas de Seguridad Social y registros de jornada de trabajadores internos.",
        },
      },
      {
        "@type": "Question",
        name: "Como ayuda PlayCAE a RRHH con las caducidades?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El sistema envia alertas automaticas antes de cada vencimiento para evitar documentos caducados y reducir riesgos en auditorias e inspecciones.",
        },
      },
      {
        "@type": "Question",
        name: "Se puede integrar con sistemas de RRHH existentes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Si. Puedes dar de alta trabajadores manualmente o importar datos desde tu sistema de RRHH y mantener la documentacion sincronizada.",
        },
      },
    ],
  };

  return (
    <main className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-playGrey">
        <div
          className="absolute inset-0 bg-gradient-to-br from-playBlueDark/10 via-transparent to-playOrange/10"
          aria-hidden="true"
        />
        <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-playBlueDark/10 text-playBlueDark px-4 py-2 rounded-full text-sm font-medium mb-6">
              <IdCard className="h-4 w-4" />
              Gestión documental de plantilla
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playBlueDark leading-tight">
              Gestión documental de trabajadores internos con IA
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl mx-auto">
              Centraliza toda la documentación PRL de tu plantilla: DNI,
              formaciones, reconocimientos médicos y registro de entradas y
              salidas. Siempre actualizada, siempre cumpliendo normativa.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-playOrange px-8 py-4 font-semibold text-white shadow-lg hover:bg-playOrange/90 transition-colors"
              >
                Solicitar demo gratuita
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-playBlueDark px-8 py-4 font-semibold text-playBlueDark hover:bg-playBlueDark/5 transition-colors"
              >
                Empezar gratis
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
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

      {/* Stats Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-playOrange">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm text-playBlueLight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 md:p-12 border border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-red-800">
                  ¿Cuánto tiempo pierde RRHH gestionando documentación de
                  empleados?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {painPoints.map((point) => (
                  <div key={point.title} className="flex gap-4">
                    <point.icon className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-red-800">
                        {point.title}
                      </h3>
                      <p className="text-red-700/80 text-sm mt-1">
                        {point.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Cómo funciona la gestión documental de tu plantilla
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Centraliza, automatiza y mantén al día la documentación de todos
              tus trabajadores internos en 3 pasos
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {processSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-playBlueLight/20 relative"
                >
                  <div className="absolute -top-4 left-8 bg-playOrange text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="bg-playBlueDark/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                    <step.icon className="h-7 w-7 text-playBlueDark" />
                  </div>
                  <h3 className="text-xl font-bold text-playBlueDark mb-3">
                    {step.title}
                  </h3>
                  <p className="text-playBlueLight">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Todo lo que necesitas para gestionar la documentación de tu
              plantilla
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Funcionalidades diseñadas para RRHH y PRL
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-playGrey rounded-2xl p-6 border border-playBlueLight/10 hover:shadow-lg transition-shadow"
              >
                <div className="bg-playBlueDark w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-playBlueDark mb-2">
                  {feature.title}
                </h3>
                <p className="text-playBlueLight text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="bg-playBlueDark py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Documentos que gestionamos de tu plantilla
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Nuestra IA está entrenada para validar toda la documentación
              laboral y PRL de trabajadores internos
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {documentTypes.map((doc) => (
              <div
                key={doc}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 text-white font-medium hover:bg-white/20 transition-colors"
              >
                <span className="mr-2">✓</span>
                {doc}
              </div>
            ))}
          </div>

          <p className="text-center mt-8 text-playBlueLight">
            ¿Necesitas gestionar otro tipo de documento?{" "}
            <Link
              href="/contacto"
              className="text-playOrange hover:underline font-medium"
            >
              Consúltanos
            </Link>
          </p>
        </div>
      </section>

      {/* Integration */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-playGreen/20 p-6 rounded-2xl">
                  <Users className="h-16 w-16 text-playGreen" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-playBlueDark mb-4">
                    Integrado con el resto de PlayCAE
                  </h2>
                  <p className="text-playBlueLight mb-6">
                    La gestión documental de trabajadores internos funciona junto
                    con nuestro servicio de validación CAE y control de accesos.
                    Cuando un trabajador tiene toda su documentación validada,
                    queda automáticamente habilitado para fichar y acceder.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <Link
                      href="/servicios/gestion-documentacion-cae"
                      className="inline-flex items-center gap-2 text-playOrange font-semibold hover:underline"
                    >
                      Ver validación documental CAE
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/servicios/control-accesos-fabrica"
                      className="inline-flex items-center gap-2 text-playOrange font-semibold hover:underline"
                    >
                      Ver control de accesos
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-playOrange to-orange-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Centraliza hoy la documentación de tu plantilla
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Sin compromiso. Configura tu cuenta en 5 minutos y empieza a
            gestionar la documentación de tus trabajadores.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-playOrange shadow-lg hover:bg-gray-100 transition-colors"
            >
              Solicitar demo personalizada
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD */}
      <Script
        id="ld-software-application"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationLd) }}
      />
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </main>
  );
}



