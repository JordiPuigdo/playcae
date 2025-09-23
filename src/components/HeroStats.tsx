"use client";

import { motion } from "framer-motion";

const STATS = [
  { value: "99.2%", label: "Precisión en validaciones" },
  { value: "90%", label: "Ahorro de tiempo" },
  { value: "0", label: "Sanciones por PRL" },
];

const HeroStats = () => {
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
          <span className="mr-3 rounded-lg bg-blue-100 p-2">
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
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
            <span className="block text-xl font-bold text-gray-900">
              {s.value}
            </span>
            <span className="block text-sm text-gray-600">{s.label}</span>
          </span>
        </li>
      ))}
    </motion.ul>
  );
};

export default HeroStats;
