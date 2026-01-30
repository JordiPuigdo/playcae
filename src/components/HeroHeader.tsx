"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

const HeroHeader = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      className="mb-12 w-full lg:mb-0 lg:w-1/2"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{ willChange: "transform, opacity" }}
    >
      <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-playBlueDark/10 px-4 py-1 text-sm font-medium text-playBlueDark">
        <span aria-hidden>🚀</span> {t("hero.badge")}
      </span>

      <h1
        id="hero-title"
        className="mb-6 text-4xl font-bold leading-tight text-playBlueDark md:text-5xl"
      >
        {t("hero.title")}{" "}
        <span className="text-playOrange">{t("hero.titleHighlight")}</span>
      </h1>

      <p className="mb-8 max-w-xl text-lg text-playBlueLight md:text-xl">
        {t("hero.subtitle")}
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <a
          href="#contact"
          className="group inline-flex items-center justify-center rounded-full bg-playOrange px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-playOrange/90 hover:scale-[1.02]"
        >
          {t("hero.cta")}
        </a>

        <a
          href="/register"
          className="inline-flex items-center justify-center rounded-full border-2 border-playBlueDark bg-white px-8 py-4 font-semibold text-playBlueDark shadow-sm transition-all duration-200 hover:bg-playBlueDark/5 hover:scale-[1.02]"
        >
          {t("hero.ctaSecondary")}
        </a>
      </div>
    </motion.div>
  );
};

export default HeroHeader;
