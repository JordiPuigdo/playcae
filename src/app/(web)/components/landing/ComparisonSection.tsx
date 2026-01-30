"use client";

import { motion } from "framer-motion";
import { Check, X, Zap, Clock, Users, CreditCard } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function ComparisonSection() {
  const { t } = useTranslation();

  const comparisonPoints = [
    {
      feature: t("landing.comparison.features.aiValidation"),
      playcae: true,
      others: t("landing.comparison.othersValues.manual"),
      highlight: true,
    },
    {
      feature: t("landing.comparison.features.implementationTime"),
      playcae: t("landing.comparison.playcaeValues.days"),
      others: t("landing.comparison.othersValues.months"),
      highlight: true,
    },
    {
      feature: t("landing.comparison.features.costPerWorker"),
      playcae: t("landing.comparison.playcaeValues.noCosts"),
      others: t("landing.comparison.othersValues.payPerVolume"),
      highlight: true,
    },
    {
      feature: t("landing.comparison.features.support"),
      playcae: t("landing.comparison.playcaeValues.personalizedSupport"),
      others: t("landing.comparison.othersValues.paidLimited"),
      highlight: false,
    },
    {
      feature: t("landing.comparison.features.accessControl"),
      playcae: true,
      others: t("landing.comparison.othersValues.additionalModule"),
      highlight: false,
    },
    {
      feature: t("landing.comparison.features.expiryAlerts"),
      playcae: true,
      others: true,
      highlight: false,
    },
    {
      feature: t("landing.comparison.features.intuitiveUI"),
      playcae: true,
      others: t("landing.comparison.othersValues.highLearningCurve"),
      highlight: true,
    },
    {
      feature: t("landing.comparison.features.openApi"),
      playcae: true,
      others: t("landing.comparison.othersValues.limitedPaid"),
      highlight: false,
    },
  ];

  const differentiators = [
    {
      icon: Zap,
      title: t("landing.comparison.diff1Title"),
      description: t("landing.comparison.diff1Desc"),
    },
    {
      icon: CreditCard,
      title: t("landing.comparison.diff2Title"),
      description: t("landing.comparison.diff2Desc"),
    },
    {
      icon: Clock,
      title: t("landing.comparison.diff3Title"),
      description: t("landing.comparison.diff3Desc"),
    },
    {
      icon: Users,
      title: t("landing.comparison.diff4Title"),
      description: t("landing.comparison.diff4Desc"),
    },
  ];

  return (
    <section className="py-16 lg:py-24 bg-white" id="comparativa">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-playBlueDark mb-4">
            {t("landing.comparison.title")}
          </h2>
          <p className="text-lg text-playBlueLight max-w-3xl mx-auto">
            {t("landing.comparison.subtitle")}
          </p>
        </motion.div>

        {/* Differentiators Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {differentiators.map((item, idx) => (
            <div
              key={idx}
              className="bg-playGrey rounded-2xl p-6 border border-playBlueLight/10 hover:shadow-lg transition-shadow"
            >
              <div className="bg-playOrange w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <item.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-playBlueDark mb-2">
                {item.title}
              </h3>
              <p className="text-playBlueLight text-sm">{item.description}</p>
            </div>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="bg-playGrey rounded-2xl border border-playBlueLight/20 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-playBlueDark text-white">
              <div className="p-4 font-semibold">{t("landing.comparison.feature")}</div>
              <div className="p-4 font-semibold text-center bg-playOrange">
                {t("landing.comparison.playcae")}
              </div>
              <div className="p-4 font-semibold text-center">
                {t("landing.comparison.others")}
              </div>
            </div>

            {/* Table Rows */}
            {comparisonPoints.map((point, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-3 border-b border-playBlueLight/10 ${
                  point.highlight ? "bg-playOrange/5" : "bg-white"
                }`}
              >
                <div className="p-4 text-playBlueDark font-medium">
                  {point.feature}
                </div>
                <div className="p-4 text-center">
                  {typeof point.playcae === "boolean" ? (
                    point.playcae ? (
                      <Check className="h-5 w-5 text-playGreen mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-playGreen font-semibold text-sm">
                      {point.playcae}
                    </span>
                  )}
                </div>
                <div className="p-4 text-center">
                  {typeof point.others === "boolean" ? (
                    point.others ? (
                      <Check className="h-5 w-5 text-playBlueLight mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-playBlueLight text-sm">
                      {point.others}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-center text-sm text-playBlueLight mt-4">
            {t("landing.comparison.disclaimer")}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          <p className="text-playBlueDark font-medium mb-4">
            {t("landing.comparison.migrationQuestion")}
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full bg-playOrange px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-playOrange/90 hover:scale-[1.02]"
          >
            {t("landing.comparison.migrationCta")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
