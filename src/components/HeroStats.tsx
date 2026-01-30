"use client";

import { useTranslation } from "@/hooks/useTranslation";
import { motion } from "framer-motion";

const HeroStats = () => {
  const { t } = useTranslation();

  const STATS = [
    { value: "99.2%", label: t("hero.stats.aiAccuracy") },
    { value: "90%", label: t("hero.stats.timeSaved") },
    { value: "0", label: t("hero.stats.sanctions") },
  ];

  return (
    <motion.ul
      className="mt-10 flex flex-wrap gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
      viewport={{ once: true }}
      style={{ willChange: "transform, opacity" }}
    >
      {STATS.map((s, i) => (
        <li key={i} className="flex items-center">
          <span className="mr-3 rounded-lg bg-playOrange/20 p-2">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-playOrange"
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
          </span>
          <span>
            <span className="block text-xl font-bold text-playBlueDark">
              {s.value}
            </span>
            <span className="block text-sm text-playBlueLight">{s.label}</span>
          </span>
        </li>
      ))}
    </motion.ul>
  );
};

export default HeroStats;
