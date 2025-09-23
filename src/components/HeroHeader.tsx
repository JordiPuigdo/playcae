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
      <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-800">
        <span aria-hidden>🚀</span> Innovación en PRL
      </span>

      <h1
        id="hero-title"
        className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl"
      >
        Automatiza la validación documental del PRL con
        <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
          {" "}
          Inteligencia Artificial
        </span>
      </h1>

      <p className="mb-8 max-w-xl text-lg text-gray-600 md:text-xl">
        Garantiza el cumplimiento legal, elimina errores y ahorra hasta un 90%
        de tiempo en gestión CAE. Sin configuraciones complejas.
      </p>

      <div className="flex flex-col gap-4 sm:flex-row">
        <a
          href="#contact"
          className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg transition-transform duration-200 hover:from-blue-700 hover:to-cyan-700 hover:scale-[1.02]"
        >
          Agenda una demo
        </a>

        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 font-semibold text-blue-600 shadow-sm transition-transform duration-200 hover:scale-[1.02]"
        >
          Crea tu cuenta gratis
        </a>
      </div>
    </motion.div>
  );
};

export default HeroHeader;
