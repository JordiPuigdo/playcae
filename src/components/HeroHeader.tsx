"use client";

import { motion } from "framer-motion";

const HeroHeader = () => {
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
        <span aria-hidden>🚀</span> Software CAE con Inteligencia Artificial
      </span>

      <h1
        id="hero-title"
        className="mb-6 text-4xl font-bold leading-tight text-playBlueDark md:text-5xl"
      >
        Software CAE para gestión documental PRL{" "}
        <span className="text-playOrange">automatizada con IA</span>
      </h1>

      <p className="mb-8 max-w-xl text-lg text-playBlueLight md:text-xl">
        La plataforma de Coordinación de Actividades Empresariales que valida
        documentación PRL en segundos. Ahorra hasta un 90% de tiempo y evita
        sanciones de hasta 500.000€.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <a
          href="#contact"
          className="group inline-flex items-center justify-center rounded-full bg-playOrange px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:bg-playOrange/90 hover:scale-[1.02]"
        >
          Solicitar demo gratuita
        </a>

        <a
          href="/register"
          className="inline-flex items-center justify-center rounded-full border-2 border-playBlueDark bg-white px-8 py-4 font-semibold text-playBlueDark shadow-sm transition-all duration-200 hover:bg-playBlueDark/5 hover:scale-[1.02]"
        >
          Probar gratis
        </a>
      </div>
    </motion.div>
  );
};

export default HeroHeader;
