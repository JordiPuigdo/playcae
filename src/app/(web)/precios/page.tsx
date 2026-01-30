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
import { getServerTranslations } from "@/i18n/server";

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

// Icons for includedInAll section
const includedIcons = [FileCheck, Clock, Shield, Headphones, Zap, Users];

export default async function PreciosPage() {
  const t = await getServerTranslations();

  // Build plans from translations
  const plans = [
    {
      key: "starter" as const,
      highlighted: false,
      href: "/register",
    },
    {
      key: "professional" as const,
      highlighted: true,
      href: "/contacto",
    },
    {
      key: "enterprise" as const,
      highlighted: false,
      href: "/contacto",
    },
  ];

  const includedItems = t.pricing.includedInAll.items.split("|");
  const traditionalItems = t.pricing.comparison.traditional.items.split("|");
  const playcaeItems = t.pricing.comparison.playcae.items.split("|");

  const breadcrumbsLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.pricing.breadcrumbs.home,
        item: "https://playcae.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.pricing.breadcrumbs.pricing,
        item: "https://playcae.com/precios",
      },
    ],
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.pricing.faq.items.map((faq) => ({
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
              {t.pricing.hero.title}{" "}
              <span className="text-playOrange">{t.pricing.hero.titleHighlight}</span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-playBlueLight max-w-3xl mx-auto">
              {t.pricing.hero.subtitle}
            </p>

            <div className="mt-8 inline-flex items-center gap-2 bg-playGreen/10 text-playGreen px-4 py-2 rounded-full text-sm font-medium">
              <Check className="h-4 w-4" />
              {t.pricing.hero.badge}
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
            {plans.map((plan, idx) => {
              const planData = t.pricing.plans[plan.key];
              const features = planData.features.split("|");
              const isCustomPrice = planData.price === "Personalizado" || planData.price === "Personalitzat";

              return (
                <div
                  key={idx}
                  className={`rounded-2xl p-8 border ${
                    plan.highlighted
                      ? "bg-playBlueDark text-white border-playBlueDark scale-105 shadow-2xl"
                      : "bg-white border-playBlueLight/20 shadow-lg"
                  }`}
                >
                  {plan.highlighted && "badge" in planData && (
                    <div className="bg-playOrange text-white text-sm font-semibold px-4 py-1 rounded-full inline-block mb-4">
                      {planData.badge}
                    </div>
                  )}

                  <h3
                    className={`text-2xl font-bold ${
                      plan.highlighted ? "text-white" : "text-playBlueDark"
                    }`}
                  >
                    {planData.name}
                  </h3>
                  <p
                    className={`mt-2 text-sm ${
                      plan.highlighted ? "text-white/80" : "text-playBlueLight"
                    }`}
                  >
                    {planData.description}
                  </p>

                  <div className="mt-6">
                    <span
                      className={`text-4xl font-bold ${
                        plan.highlighted ? "text-white" : "text-playBlueDark"
                      }`}
                    >
                      {isCustomPrice ? "" : "€"}
                      {planData.price}
                    </span>
                    <span
                      className={`text-lg ${
                        plan.highlighted ? "text-white/80" : "text-playBlueLight"
                      }`}
                    >
                      {isCustomPrice ? "" : t.pricing.perMonth}
                    </span>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {features.map((feature, featureIdx) => (
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
                    {planData.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Included in All */}
      <section className="bg-playGrey py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark">
              {t.pricing.includedInAll.title}
            </h2>
            <p className="mt-4 text-lg text-playBlueLight max-w-2xl mx-auto">
              {t.pricing.includedInAll.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {includedItems.map((item, idx) => {
              const Icon = includedIcons[idx] || FileCheck;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 text-center border border-playBlueLight/10"
                >
                  <div className="bg-playOrange/10 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-playOrange" />
                  </div>
                  <p className="text-playBlueDark text-sm font-medium">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison with Traditional */}
      <section className="bg-white py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-8 text-center">
              {t.pricing.comparison.title}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
                <h3 className="text-xl font-bold text-red-800 mb-4">
                  {t.pricing.comparison.traditional.title}
                </h3>
                <ul className="space-y-3">
                  {traditionalItems.map((item, idx) => (
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
                  {t.pricing.comparison.playcae.title}
                </h3>
                <ul className="space-y-3">
                  {playcaeItems.map((item, idx) => (
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
              {t.pricing.faq.title}
            </h2>

            <div className="space-y-6">
              {t.pricing.faq.items.map((faq, idx) => (
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
            {t.pricing.cta.title}
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            {t.pricing.cta.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-semibold text-playOrange shadow-lg hover:bg-gray-100 transition-colors"
            >
              {t.pricing.cta.talkToSales}
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {t.pricing.cta.tryFree}
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
