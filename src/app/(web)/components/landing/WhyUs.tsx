"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

export default function WhyUs() {
  const { t } = useTranslation();

  const complianceItems = t("landing.whyUs.complianceItems").split("|");

  const integrations = [
    { name: "ISO 27001", icon: "🛡️" },
    { name: "GDPR", icon: "📜" },
    { name: "SAP", icon: "🔌" },
    { name: "A3CE", icon: "🏗️" },
    { name: "Hacienda", icon: "💰" },
    { name: "BOE", icon: "📰" },
  ];

  return (
    <section className="relative py-16 bg-gradient-to-b from-playGrey to-white overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-playBlueLight/20 rounded-full opacity-30 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-4">
            {t("landing.whyUs.title")}
          </h2>
          <p className="text-lg text-playBlueLight max-w-3xl mx-auto">
            {t("landing.whyUs.subtitle")}
          </p>
        </motion.div>

        {/* Grid de 4 items */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.15 }}
        >
          {/* Item 1: Actualización normativa */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-playBlueLight/30 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-playBlueLight/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-xl font-bold text-playBlueDark mb-3">
              {t("landing.whyUs.feature1Title")}
            </h3>
            <p className="text-playBlueLight mb-4">
              {t("landing.whyUs.feature1Desc")}
            </p>
            <div className="flex items-center text-sm text-playBlueDark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>{t("landing.whyUs.feature1Tag")}</span>
            </div>
          </div>

          {/* Item 2: Certificación */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-playGreen/30 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-playGreen/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold text-playBlueDark mb-3">
              {t("landing.whyUs.feature2Title")}
            </h3>
            <p className="text-playBlueLight mb-4">
              {t("landing.whyUs.feature2Desc")}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-playGreen/20 text-playGreen text-xs px-2 py-1 rounded-full">
                GDPR Compliant
              </span>
              <span className="bg-playGreen/20 text-playGreen text-xs px-2 py-1 rounded-full">
                LOPDGDD
              </span>
            </div>
          </div>

          {/* Item 3: Integraciones */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-playOrange/30 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-playOrange/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold text-playBlueDark mb-3">
              {t("landing.whyUs.feature3Title")}
            </h3>
            <p className="text-playBlueLight mb-4">
              {t("landing.whyUs.feature3Desc")}
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <div className="bg-playGrey p-2 rounded-lg">
                <span className="font-bold text-playBlueDark">SAP</span>
              </div>
              <div className="bg-playGrey p-2 rounded-lg">
                <span className="font-bold text-playBlueDark">A3CE</span>
              </div>
            </div>
          </div>

          {/* Item 4: Algoritmos */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-playYellow/30 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-playYellow/20 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-playBlueDark mb-3">
              {t("landing.whyUs.feature4Title")}
            </h3>
            <p className="text-playBlueLight mb-4">
              {t("landing.whyUs.feature4Desc")}
            </p>
            <div className="mt-3">
              <div className="flex items-center text-sm text-playOrange">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{t("landing.whyUs.feature4Tag")}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sección de integraciones y certificaciones */}
        <div className="bg-gradient-to-r from-playGrey to-playBlueLight/10 rounded-2xl p-8 md:p-12 border border-playBlueLight/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/5">
              <h3 className="text-2xl font-bold text-playBlueDark mb-4">
                {t("landing.whyUs.complianceTitle")}
              </h3>
              <p className="text-playBlueLight mb-6">
                {t("landing.whyUs.complianceSubtitle")}
              </p>
              <ul className="space-y-3">
                {complianceItems.map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-playGreen mt-0.5 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-playBlueDark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Imagen de integraciones */}
            <div className="md:w-3/5 bg-white p-6 rounded-xl shadow-inner border border-playBlueLight/20">
              <h4 className="font-bold text-center text-playBlueDark mb-6">
                {t("landing.whyUs.integrationsTitle")}
              </h4>
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
                {integrations.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-playGrey rounded-lg p-4 w-full text-center border border-playBlueLight/20"
                  >
                    <span className="text-2xl block mb-2">{item.icon}</span>
                    <span className="font-medium text-playBlueDark text-sm">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <a
            href="#contact"
            className="bg-playOrange hover:bg-playOrange/90 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 inline-flex items-center"
          >
            {t("landing.whyUs.cta")}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
          <p className="mt-4 text-playBlueLight">
            <span className="bg-playGreen/20 text-playGreen px-3 py-1 rounded-full text-sm mr-2">
              ✅
            </span>
            {t("landing.whyUs.ctaTag")}
          </p>
        </div>
      </div>
    </section>
  );
}
