// app/servicios/gestion-documentacion-cae/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  FileCheck,
  Clock,
  Shield,
  Bell,
  Upload,
  Brain,
  CheckCircle,
  AlertTriangle,
  Users,
  Building2,
  FileText,
  History,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Validación Documental PRL y CAE con IA | PlayCAE",
  description:
    "Automatiza la solicitud y validación de documentación PRL con inteligencia artificial. Ahorra hasta 15h semanales, evita sanciones de hasta 500.000€ y cumple el RD 171/2004.",
  alternates: { canonical: "/servicios/gestion-documentacion-cae" },
  openGraph: {
    type: "website",
    title: "Validación Documental PRL y CAE con IA | PlayCAE",
    description:
      "Valida documentación PRL automáticamente con IA. Alertas de caducidad, trazabilidad para auditorías y cumplimiento normativo.",
    url: "https://playcae.com/servicios/gestion-documentacion-cae",
  },
  robots: { index: true, follow: true },
};

const features = [
  {
    icon: Upload,
    title: "Solicitud automática a contratas",
    description:
      "Envía peticiones de documentación PRL a tus subcontratas y trabajadores externos. Seguimiento automático hasta recepción.",
  },
  {
    icon: Brain,
    title: "Validación con IA especializada",
    description:
      "Nuestro agente IA analiza cada documento: verifica fechas, firmas, sellos y coherencia con la normativa PRL vigente.",
  },
  {
    icon: Bell,
    title: "Alertas de caducidad",
    description:
      "Notificaciones automáticas antes de que expire cualquier documento. Nunca más documentación caducada en una auditoría.",
  },
  {
    icon: History,
    title: "Historial y trazabilidad",
    description:
      "Registro completo de todas las versiones, validaciones y cambios. Evidencias listas para cualquier inspección.",
  },
  {
    icon: Shield,
    title: "Cumplimiento RD 171/2004",
    description:
      "Diseñado específicamente para cumplir con la Coordinación de Actividades Empresariales según normativa española.",
  },
  {
    icon: Users,
    title: "Gestión de contratas y trabajadores",
    description:
      "Panel centralizado para gestionar toda la documentación de empresas subcontratadas y sus trabajadores.",
  },
];

const documentTypes = [
  "Certificado de aptitud médica",
  "Formación PRL específica",
  "Entrega de EPIs",
  "Seguro de responsabilidad civil",
  "Certificado de estar al corriente con SS",
  "Plan de prevención",
  "Evaluación de riesgos",
  "Autorización de equipos",
];

const stats = [
  { value: "15h", label: "Ahorro semanal medio" },
  { value: "98%", label: "Precisión validación IA" },
  { value: "<30s", label: "Tiempo análisis documento" },
  { value: "100%", label: "Trazabilidad auditorías" },
];

const processSteps = [
  {
    step: 1,
    title: "Sube o solicita documentos",
    description:
      "Carga documentos manualmente o envía solicitudes automáticas a contratas. Soportamos PDF, imágenes, Word y escaneos con OCR.",
    icon: Upload,
  },
  {
    step: 2,
    title: "La IA analiza y valida",
    description:
      "Nuestro agente especializado verifica tipo de documento, fechas de validez, firmas, sellos y coherencia normativa.",
    icon: Brain,
  },
  {
    step: 3,
    title: "Recibe resultado instantáneo",
    description:
      "Documento aprobado, rechazado con motivo, o pendiente de revisión manual. Todo queda registrado con trazabilidad.",
    icon: CheckCircle,
  },
];

export default function ServicioCAE() {
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Validación Documental PRL y CAE con IA",
    serviceType: "Gestión de documentación CAE y validación PRL con IA",
    description:
      "Automatiza la solicitud y validación de documentación PRL con inteligencia artificial para pymes manufactureras.",
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
      name: "Pymes manufactureras",
      audienceType: "Empresas con subcontratas",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Planes PlayCAE",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Validación documental PRL con IA",
          },
        },
      ],
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
        name: "Validación Documental PRL",
        item: "https://playcae.com/servicios/gestion-documentacion-cae",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué tipos de documentos PRL puede validar la IA?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "PlayCAE valida certificados de aptitud médica, formación PRL, entrega de EPIs, seguros de RC, certificados de Seguridad Social, planes de prevención, evaluaciones de riesgos y autorizaciones de equipos.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto tiempo tarda la validación automática?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La validación con IA tarda menos de 30 segundos por documento. Puedes subir hasta 100 documentos simultáneamente.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué pasa si la IA no puede validar un documento?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "El documento queda marcado como 'Pendiente de revisión manual' y recibes una notificación para revisarlo. El sistema te indica el motivo de la incertidumbre.",
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
              <FileCheck className="h-4 w-4" />
              Servicio de validación documental
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playBlueDark leading-tight">
              Validación documental PRL y CAE{" "}
              <span className="text-playOrange">con IA</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl mx-auto">
              Automatiza la solicitud y validación de documentación PRL a
              contratas y trabajadores. Ahorra hasta 15 horas semanales y evita
              sanciones de hasta 500.000€.
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
                  El problema de la validación manual
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <Clock className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      15h semanales perdidas
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Revisando documentos manualmente, persiguiendo contratas y
                      actualizando hojas de cálculo.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Shield className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Hasta 500.000€ en sanciones
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Por incumplimiento del RD 171/2004 sobre Coordinación de
                      Actividades Empresariales.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <FileText className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      43% documentos caducados
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Las auditorías detectan documentación expirada que pone en
                      riesgo el cumplimiento.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Building2 className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-red-800">
                      Sin trazabilidad
                    </h3>
                    <p className="text-red-700/80 text-sm mt-1">
                      Ante una inspección, no puedes demostrar cuándo validaste
                      cada documento.
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
              Valida documentación PRL en 3 simples pasos
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
              Todo lo que necesitas para gestionar CAE
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Funcionalidades diseñadas para cumplir normativa y ahorrar tiempo
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
              Tipos de documentos que validamos
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Nuestra IA está entrenada para reconocer y validar toda la
              documentación PRL requerida
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
            ¿Necesitas validar otro tipo de documento?{" "}
            <Link
              href="/contacto"
              className="text-playOrange hover:underline font-medium"
            >
              Consúltanos
            </Link>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-playOrange to-orange-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Empieza a validar documentos con IA hoy
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Sin compromiso. Configura tu cuenta en 5 minutos y sube tus primeros
            documentos.
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
