"use client";
import { motion } from "framer-motion";
import { useTranslation } from "@/hooks/useTranslation";

export default function ProblemSolutionSection() {
  const { t } = useTranslation();
  return (
    <section className="container mx-auto px-4 py-16">
      <motion.h2
        className="text-3xl font-bold text-center text-playBlueDark mb-12"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {t("landing.problemSolution.sectionTitle")}
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Problemas */}
        <motion.div
          className="flex items-start justify-start h-full"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="bg-red-50 p-8 rounded-2xl border border-red-100 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-red-800">
                {t("landing.problemSolution.challengesTitle")}
              </h4>
            </div>

            <div className="space-y-6">
              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">
                    {t("landing.problemSolution.problem1Title")}
                  </h5>
                  <p className="text-gray-600">
                    {t("landing.problemSolution.problem1Desc")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">
                    {t("landing.problemSolution.problem2Title")}
                  </h5>
                  <p className="text-gray-600">
                    {t("landing.problemSolution.problem2Desc")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">{t("landing.problemSolution.problem3Title")}</h5>
                  <p className="text-gray-600">
                    {t("landing.problemSolution.problem3Desc")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-red-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">
                    {t("landing.problemSolution.problem4Title")}
                  </h5>
                  <p className="text-gray-600">
                    {t("landing.problemSolution.problem4Desc")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Solución */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="relative bg-gradient-to-br from-playGrey to-playBlueLight/10 p-8 pt-16 md:pt-8 rounded-2xl border border-playBlueLight/30 shadow-sm">
            <div className="absolute top-6 right-6">
              <div className="bg-playGreen text-white px-4 py-1 rounded-full text-sm font-bold">
                {t("landing.problemSolution.solutionBadge")}
              </div>
            </div>

            <div className="flex items-center mb-6">
              <div className="bg-playBlueLight/20 p-3 rounded-full mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-playBlueDark"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-playBlueDark">
                {t("landing.problemSolution.solutionTitle")}
              </h4>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-playBlueDark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">
                    {t("landing.problemSolution.solution1Title")}
                  </h5>
                  <p className="text-gray-700">
                    {t("landing.problemSolution.solution1Desc")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-playBlueDark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">
                    {t("landing.problemSolution.solution2Title")}
                  </h5>
                  <p className="text-gray-700">
                    {t("landing.problemSolution.solution2Desc")}
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mt-1 text-playBlueDark">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h5 className="font-bold text-lg">{t("landing.problemSolution.solution3Title")}</h5>
                  <p className="text-gray-700">
                    {t("landing.problemSolution.solution3Desc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-playGreen text-white p-4 rounded-lg mt-6">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <p className="font-bold">
                  {t("landing.problemSolution.resultTitle")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              className="bg-gradient-to-r from-playOrange to-playOrange/80 hover:from-playOrange/90 hover:to-playOrange/70 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all transform hover:scale-105"
              onClick={() => window.open("/register", "_blank")}
            >
              {t("landing.problemSolution.cta")}
            </button>
            <p className="mt-2 text-sm text-gray-500">
              {t("landing.problemSolution.ctaSubtitle")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
