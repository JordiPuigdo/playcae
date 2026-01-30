"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function DocumentationSupported() {
  const { t } = useTranslation();

  const step2Items = [
    {
      icon: "🔍",
      title: t("landing.documentation.step2Check1Title"),
      desc: t("landing.documentation.step2Check1Desc"),
    },
    {
      icon: "📅",
      title: t("landing.documentation.step2Check2Title"),
      desc: t("landing.documentation.step2Check2Desc"),
    },
    {
      icon: "🛡️",
      title: t("landing.documentation.step2Check3Title"),
      desc: t("landing.documentation.step2Check3Desc"),
    },
    {
      icon: "📜",
      title: t("landing.documentation.step2Check4Title"),
      desc: t("landing.documentation.step2Check4Desc"),
    },
  ];

  const step3Items = [
    {
      color: "green",
      title: t("landing.documentation.step3Valid"),
      desc: t("landing.documentation.step3ValidDesc"),
    },
    {
      color: "yellow",
      title: t("landing.documentation.step3Corrections"),
      desc: t("landing.documentation.step3CorrectionsDesc"),
    },
    {
      color: "red",
      title: t("landing.documentation.step3Review"),
      desc: t("landing.documentation.step3ReviewDesc"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative py-20 bg-gradient-to-b from-white to-playGrey overflow-hidden"
    >
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-0 w-32 h-32 bg-playBlueLight/30 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-playGreen/20 rounded-full opacity-30 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-4">
            {t("landing.documentation.title")}
          </h2>
          <p className="text-lg text-playBlueLight max-w-3xl mx-auto">
            {t("landing.documentation.subtitle")}
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Diagrama visual - Flujo animado */}
          <motion.div
            className="relative w-full lg:w-2/5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative h-96 flex flex-col items-center">
              {/* Documento */}
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg w-56 p-3 animate-float">
                <div className="flex items-center text-sm font-medium text-gray-700">
                  <svg
                    className="h-5 w-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5h5.586l5.414 5.414V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Subcontrata_EPIs.pdf
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {t("landing.documentation.docLoaded")}
                </div>
              </div>

              {/* IA - caja con loader */}
              <div className="bg-playBlueDark text-white rounded-xl w-48 h-24 flex items-center justify-center mt-8 shadow-lg animate-pulse">
                <div className="text-center">
                  <div className="animate-spin h-6 w-6 mx-auto mb-2 border-2 border-white border-t-transparent rounded-full"></div>
                  <span className="text-sm font-semibold">
                    {t("landing.documentation.analyzingAI")}
                  </span>
                </div>
              </div>

              {/* Resultado */}
              <div className="flex space-x-4 mt-8">
                <div className="bg-white border border-green-200 rounded-lg p-3 w-40 shadow hover:scale-105 transition">
                  <span className="text-sm font-medium text-green-600">
                    ✔ Formación.pdf
                  </span>
                </div>
                <div className="bg-white border border-yellow-200 rounded-lg p-3 w-40 shadow hover:scale-105 transition">
                  <span className="text-sm font-medium text-yellow-600">
                    ⚠ Revisar EPIs.pdf
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pasos del proceso */}
          <motion.div
            className="w-full lg:w-3/5"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-12">
              {/* Paso 1 */}
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-playBlueLight/20 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔄</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="bg-playBlueDark text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                      1
                    </span>
                    {t("landing.documentation.step1Title")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t("landing.documentation.step1Desc")}
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {["PDF", "JPG", "PNG", "DOCX", "TIFF", "HEIC"].map(
                        (format, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm"
                          >
                            {format}
                          </span>
                        )
                      )}
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{t("landing.documentation.step1Note")}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-playOrange/20 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="bg-playOrange text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                      2
                    </span>
                    {t("landing.documentation.step2Title")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t("landing.documentation.step2Desc")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {step2Items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start">
                          <span className="text-xl mr-3">{item.icon}</span>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-playGreen/20 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="bg-playGreen text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                      3
                    </span>
                    {t("landing.documentation.step3Title")}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {t("landing.documentation.step3Desc")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {step3Items.map((item, idx) => (
                      <div
                        key={idx}
                        className={`bg-${item.color}-50 p-4 rounded-lg border border-${item.color}-200`}
                      >
                        <h4 className="font-bold flex items-center">
                          <span
                            className={`bg-${item.color}-500 w-3 h-3 rounded-full mr-2`}
                          ></span>
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <button className="bg-gradient-to-r from-playBlueDark to-playBlueLight hover:from-playBlueDark/90 hover:to-playBlueLight/90 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center mx-auto">
                {t("landing.documentation.cta")}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <p className="mt-4 text-gray-600">
                <span className="bg-playBlueLight/20 text-playBlueDark px-3 py-1 rounded-full text-sm mr-2">
                  🆕
                </span>
                {t("landing.documentation.ctaTag")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
