// app/servicios/control-accesos-fabrica/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  DoorOpen,
  Clock,
  Shield,
  AlertTriangle,
  Users,
  Building2,
  FileCheck,
  History,
  ArrowRight,
  Ban,
  Eye,
  BarChart3,
  Smartphone,
  QrCode,
  Fingerprint,
  Bell,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Control de Accesos y Registro en Fábrica | PlayCAE",
  description:
    "Controla en tiempo real quién está dentro de tu fábrica. Bloqueo automático por incumplimiento PRL, registro horario y trazabilidad para auditorías.",
  alternates: { canonical: "/servicios/control-accesos-fabrica" },
  openGraph: {
    type: "website",
    title: "Control de Accesos y Registro en Fábrica | PlayCAE",
    description:
      "Sabe quién está en planta en tiempo real. Vincula el acceso al estado documental PRL de cada trabajador.",
    url: "https://playcae.com/servicios/control-accesos-fabrica",
  },
  robots: { index: true, follow: true },
};

const features = [
  {
    icon: Eye,
    title: "Visibilidad en tiempo real",
    description:
      "Dashboard con todos los trabajadores que están dentro de la fábrica ahora mismo. Filtra por empresa, zona o estado.",
  },
  {
    icon: Ban,
    title: "Bloqueo por incumplimiento PRL",
    description:
      "Si un trabajador tiene documentación caducada o rechazada, el sistema bloquea automáticamente su acceso hasta regularizar.",
  },
  {
    icon: Clock,
    title: "Registro horario automático",
    description:
      "Cumple con la normativa de registro de jornada. Hora de entrada, salida y tiempo total trabajado por cada persona.",
  },
  {
    icon: History,
    title: "Historial completo",
    description:
      "Consulta todos los accesos pasados. Filtra por fechas, empresa o trabajador. Exporta informes para auditorías.",
  },
  {
    icon: BarChart3,
    title: "KPIs y analítica",
    description:
      "Métricas de ocupación, horas trabajadas por contrata, incidencias de acceso y tendencias mensuales.",
  },
  {
    icon: Bell,
    title: "Alertas de seguridad",
    description:
      "Notificaciones cuando alguien intenta acceder sin autorización o cuando hay trabajadores fuera de horario.",
  },
];

const accessMethods = [
  {
    icon: QrCode,
    title: "Código QR",
    description: "Escaneo rápido desde móvil o tablet en el punto de acceso.",
  },
  {
    icon: Fingerprint,
    title: "Biométrico",
    description: "Integración con lectores de huella o reconocimiento facial.",
  },
  {
    icon: Smartphone,
    title: "App móvil",
    description:
      "Los trabajadores fichan desde su smartphone con geolocalización.",
  },
];

const stats = [
  { value: "100%", label: "Trazabilidad de accesos" },
  { value: "<1s", label: "Verificación PRL" },
  { value: "24/7", label: "Monitorización" },
  { value: "0", label: "Accesos no autorizados" },
];

const processSteps = [
  {
    step: 1,
    title: "Trabajador solicita acceso",
    description:
      "Mediante QR, app móvil o sistema biométrico. Se identifica con DNI o tarjeta de empresa.",
    icon: DoorOpen,
  },
  {
    step: 2,
    title: "Verificación automática PRL",
    description:
      "En menos de 1 segundo, el sistema comprueba si toda su documentación está vigente y validada.",
    icon: FileCheck,
  },
  {
    step: 3,
    title: "Acceso permitido o bloqueado",
    description:
      "Si está APTO, se registra la entrada. Si hay incumplimiento, se bloquea y notifica al responsable.",
    icon: Shield,
  },
];

const useCases = [
  {
    title: "Fábricas y plantas industriales",
    description:
      "Control de subcontratas de mantenimiento, limpieza, logística y obras.",
  },
  {
    title: "Obras de construcción",
    description:
      "Registro de todos los gremios y verificación de formación específica.",
  },
  {
    title: "Almacenes y centros logísticos",
    description: "Gestión de transportistas, repartidores y personal temporal.",
  },
  {
    title: "Instalaciones con riesgo",
    description:
      "Zonas ATEX, químicas o con requisitos especiales de seguridad.",
  },
];

export default function ControlAccesosPage() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Control de Accesos y Registro en Fábrica",
    serviceType: "Control de accesos vinculado a CAE y PRL",
    description:
      "Sistema de control de accesos que verifica en tiempo real el estado documental PRL de cada trabajador antes de permitir la entrada.",
    provider: {
      "@type": "Organization",
      name: "PlayCAE",
      url: "https://playcae.com",
    },
    areaServed: {
      "@type": "Country",
      name: "España",
    },
    audience: {
      "@type": "BusinessAudience",
      name: "Pymes manufactureras e industriales",
      audienceType: "Empresas con trabajadores externos",
    },
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
        name: "Servicios",
        item: "https://playcae.com/servicios",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Control de Accesos",
        item: "https://playcae.com/servicios/control-accesos-fabrica",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Cómo se vincula el acceso con la documentación PRL?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Cada trabajador está asociado a una empresa subcontratada con su documentación en PlayCAE. Al solicitar acceso, el sistema verifica en tiempo real si tiene todos los documentos vigentes y validados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué pasa si un trabajador tiene documentación caducada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El acceso se bloquea automáticamente y se notifica tanto al trabajador como al responsable de la empresa. El sistema indica qué documento debe renovar para poder acceder.",
        },
      },
      {
        "@type": "Question",
        name: "¿Se puede integrar con tornos o barreras existentes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí, PlayCAE se integra con la mayoría de sistemas de control de acceso físico: tornos, barreras, cerraduras electrónicas y lectores biométricos.",
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
              <DoorOpen className="h-4 w-4" />
              Control de accesos inteligente
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playBlueDark leading-tight">
              Control de accesos{" "}
              <span className="text-playOrange">vinculado a PRL</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl mx-auto">
              Sabe quién está dentro de tu fábrica en tiempo real. Bloquea
              automáticamente el acceso a trabajadores con documentación
              incompleta o caducada.
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
                  ¿Sabes quién está en tu fábrica ahora mismo?
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <Users className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Sin visibilidad
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      No sabes cuántos trabajadores externos hay en planta ni de
                      qué empresas son.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Shield className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Riesgo de accidente
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Trabajadores sin formación PRL adecuada acceden a zonas de
                      riesgo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Control manual
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Hojas de firma en papel que nadie revisa y se pierden.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Building2 className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Responsabilidad legal
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Ante un accidente, eres responsable subsidiario de las
                      subcontratas.
                    </p>
                  </div>
                </div>
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
              Cómo funciona
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Acceso verificado en menos de 1 segundo
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

      {/* Access Methods */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Métodos de identificación
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Compatible con tu infraestructura actual o implementamos una nueva
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {accessMethods.map((method) => (
              <div
                key={method.title}
                className="text-center bg-playGrey rounded-2xl p-8 border border-playBlueLight/10"
              >
                <div className="bg-playBlueDark w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-playBlueDark mb-2">
                  {method.title}
                </h3>
                <p className="text-playBlueLight">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Funcionalidades del control de accesos
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Todo lo que necesitas para saber quién entra y sale de tu fábrica
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-playBlueLight/10 hover:shadow-lg transition-shadow"
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

      {/* Use Cases */}
      <section className="bg-playBlueDark py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              ¿Para quién es este servicio?
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Cualquier empresa que reciba trabajadores externos en sus
              instalaciones
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {useCases.map((useCase) => (
              <div
                key={useCase.title}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-colors"
              >
                <h3 className="text-lg font-bold text-white mb-2">
                  {useCase.title}
                </h3>
                <p className="text-playBlueLight text-sm">
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration with Docs */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border border-green-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="bg-playGreen/20 p-6 rounded-2xl">
                  <FileCheck className="h-16 w-16 text-playGreen" />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl md:text-3xl font-bold text-playBlueDark mb-4">
                    Integrado con validación documental
                  </h2>
                  <p className="text-playBlueLight mb-6">
                    El control de accesos funciona junto con nuestro servicio de{" "}
                    <Link
                      href="/servicios/gestion-documentacion-cae"
                      className="text-playOrange font-medium hover:underline"
                    >
                      validación documental PRL con IA
                    </Link>
                    . Cuando la IA valida los documentos de un trabajador,
                    automáticamente queda habilitado para acceder. Si algo
                    caduca, se bloquea sin intervención manual.
                  </p>
                  <Link
                    href="/servicios/gestion-documentacion-cae"
                    className="inline-flex items-center gap-2 text-playOrange font-semibold hover:underline"
                  >
                    Ver servicio de validación documental
                    <ArrowRight className="h-4 w-4" />
                  </Link>
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
            Toma el control de quién accede a tu fábrica
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Implementación rápida. Compatible con tu sistema actual. Resultados
            desde el primer día.
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
        id="ld-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }}
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
