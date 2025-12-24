// app/(web)/precios/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import {
  ArrowRight,
  Check,
  Building2,
  Users,
  Zap,
  Shield,
  Clock,
  FileCheck,
  Headphones,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Precios Software CAE | Tarifas Transparentes | PlayCAE",
  description:
    "Precios claros y sin costes ocultos para tu software CAE. Sin tarifas por contrata ni por trabajador. Descubre nuestros planes para pymes y empresas.",
  alternates: { canonical: "/precios" },
  openGraph: {
    type: "website",
    title: "Precios Software CAE | PlayCAE",
    description:
      "Tarifas transparentes para gestión CAE. Sin costes por contrata. Planes adaptados a tu empresa.",
    url: "https://playcae.com/precios",
  },
  robots: { index: true, follow: true },
};

const plans = [
  {
    name: "Starter",
    description: "Para empresas que empiezan con CAE",
    price: "199",
    period: "/mes",
    features: [
      "Hasta 10 contratas activas",
      "Validación documental con IA",
      "Alertas de caducidad",
      "Panel de control básico",
      "Soporte por email",
      "1 usuario administrador",
    ],
    cta: "Empezar gratis",
    href: "/register",
    highlighted: false,
  },
  {
    name: "Professional",
    description: "Para empresas con gestión CAE activa",
    price: "399",
    period: "/mes",
    features: [
      "Contratas ilimitadas",
      "Validación documental con IA",
      "Control de accesos integrado",
      "Alertas y notificaciones avanzadas",
      "Histórico y trazabilidad completa",
      "API para integraciones",
      "Soporte prioritario",
      "5 usuarios administradores",
    ],
    cta: "Solicitar demo",
    href: "/contacto",
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "Para grandes empresas y corporaciones",
    price: "Personalizado",
    period: "",
    features: [
      "Todo lo de Professional",
      "Usuarios ilimitados",
      "Integración SAP/ERP",
      "SSO y gestión de identidades",
      "SLA garantizado",
      "Account manager dedicado",
      "Formación in-company",
      "Despliegue on-premise opcional",
    ],
    cta: "Contactar ventas",
    href: "/contacto",
    highlighted: false,
  },
];

const includedInAll = [
  { icon: FileCheck, text: "Validación documental con IA" },
  { icon: Clock, text: "Alertas automáticas de caducidad" },
  { icon: Shield, text: "Cumplimiento RD 171/2004 garantizado" },
  { icon: Headphones, text: "Soporte técnico incluido" },
  { icon: Zap, text: "Implementación en menos de 1 semana" },
  { icon: Users, text: "Migración gratuita desde otra plataforma" },
];

const faqs = [
  {
    question: "¿Hay costes adicionales por contrata o trabajador?",
    answer:
      "No. PlayCAE tiene tarifas planas. No cobramos por contrata, por trabajador ni por documento validado. Sabes exactamente lo que pagas.",
  },
  {
    question: "¿Qué incluye la migración gratuita?",
    answer:
      "Importamos todas tus empresas, trabajadores y documentos desde tu plataforma actual. También incluye formación para tu equipo sin coste adicional.",
  },
  {
    question: "¿Puedo cambiar de plan en cualquier momento?",
    answer:
      "Sí. Puedes subir o bajar de plan cuando lo necesites. Los cambios se aplican en el siguiente ciclo de facturación.",
  },
  {
    question: "¿Hay período de prueba?",
    answer:
      "Ofrecemos 14 días de prueba gratuita en el plan Starter y Professional. Sin tarjeta de crédito requerida.",
  },
  {
    question: "¿Qué formas de pago aceptáis?",
    answer:
      "Aceptamos tarjeta de crédito, transferencia bancaria y domiciliación SEPA. Facturación mensual o anual (con 2 meses gratis).",
  },
];

export default function PreciosPage() {
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
        name: "Precios",
        item: "https://playcae.com/precios",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative bg-playGrey">
        <div className="absolute inset-0 bg-gradient-to-br from-playBlueDark/10 via-transparent to-playOrange/10" />
        <div className="container relative z-10 mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-playBlueDark leading-tight">
              Precios <span className="text-playOrange">transparentes</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl mx-auto">
              Sin costes ocultos, sin tarifas por contrata, sin sorpresas. Elige
              el plan que mejor se adapte a tu empresa.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 bg-playGreen/10 text-playGreen px-4 py-2 rounded-full text-sm font-medium">
              <Check className="h-4 w-4" />
              14 días de prueba gratis en todos los planes
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

      {/* Pricing Cards */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-8 border ${
                  plan.highlighted
                    ? "bg-playBlueDark text-white border-playBlueDark scale-105 shadow-2xl"
                    : "bg-white border-playBlueLight/20 shadow-lg"
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-playOrange text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                    Más popular
                  </div>
                )}

                <h3
                  className={`text-2xl font-bold ${
                    plan.highlighted ? "text-white" : "text-playBlueDark"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-sm ${
                    plan.highlighted ? "text-white/80" : "text-playBlueLight"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mt-6">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? "text-white" : "text-playBlueDark"
                    }`}
                  >
                    {plan.price === "Personalizado" ? "" : "€"}
                    {plan.price}
                  </span>
                  <span
                    className={`text-lg ${
                      plan.highlighted ? "text-white/80" : "text-playBlueLight"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-start gap-3">
                      <Check
                        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                          plan.highlighted
                            ? "text-playOrange"
                            : "text-playGreen"
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          plan.highlighted
                            ? "text-white/90"
                            : "text-playBlueDark"
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`mt-8 block w-full text-center rounded-full px-6 py-3 font-semibold transition-colors ${
                    plan.highlighted
                      ? "bg-playOrange text-white hover:bg-playOrange/90"
                      : "bg-playBlueDark text-white hover:bg-playBlueDark/90"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Included in All */}
      <section className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              Incluido en todos los planes
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              Funcionalidades esenciales disponibles desde el primer día
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {includedInAll.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 text-center border border-playBlueLight/10"
              >
                <div className="bg-playOrange/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-playOrange" />
                </div>
                <p className="text-playBlueDark text-sm font-medium">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison with Traditional */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-8 text-center">
              ¿Por qué nuestros precios son diferentes?
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <h3 className="text-xl font-bold text-red-800 mb-4">
                  Plataformas CAE tradicionales
                </h3>
                <ul className="space-y-3">
                  {[
                    "Coste por contrata activa",
                    "Coste por trabajador registrado",
                    "Coste por documento validado",
                    "Módulos adicionales de pago",
                    "Implementación facturada aparte",
                    "Formación con coste extra",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-red-700"
                    >
                      <span className="text-red-500">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-bold text-green-800 mb-4">
                  PlayCAE
                </h3>
                <ul className="space-y-3">
                  {[
                    "Tarifa plana mensual",
                    "Contratas ilimitadas (plan Pro)",
                    "Documentos ilimitados",
                    "Todas las funcionalidades incluidas",
                    "Implementación gratuita",
                    "Formación incluida",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-green-700"
                    >
                      <Check className="h-4 w-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-12 text-center">
              Preguntas frecuentes sobre precios
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-playBlueLight/10"
                >
                  <h3 className="font-bold text-playBlueDark text-lg">
                    {faq.question}
                  </h3>
                  <p className="text-playBlueLight mt-2">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-playOrange to-orange-500 py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Tienes dudas sobre qué plan elegir?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Cuéntanos tu caso y te recomendamos la mejor opción. Sin compromiso.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-playOrange shadow-lg hover:bg-gray-100 transition-colors"
            >
              Hablar con ventas
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              Probar gratis 14 días
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
