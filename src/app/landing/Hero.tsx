"use client";

import React from "react";
import { motion } from "framer-motion";

type Stat = { value: string; label: string };
type DocItem = {
  name: string;
  status: "validado" | "pendiente" | "revisión";
  color: "green" | "yellow" | "red";
};

const STATS: Stat[] = [
  { value: "99.2%", label: "Precisión en validaciones" },
  { value: "90%", label: "Ahorro de tiempo" },
  { value: "0", label: "Sanciones por PRL" },
];

const DOCS: DocItem[] = [
  { name: "Evaluación de riesgos", status: "validado", color: "green" },
  { name: "Formación PRL básica", status: "pendiente", color: "yellow" },
  { name: "Certificado SS", status: "validado", color: "green" },
  { name: "Contrato SPA", status: "revisión", color: "red" },
];

// Mapa de colores “purge-safe”
const dotBgByColor: Record<DocItem["color"], string> = {
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  red: "bg-red-500",
};
const textByColor: Record<DocItem["color"], string> = {
  green: "text-green-600",
  yellow: "text-yellow-600",
  red: "text-red-600",
};

const Hero: React.FC = () => {
  return (
    <section
      className="relative overflow-hidden"
      aria-labelledby="hero-title"
      // Textura radial MUY sutil para dar profundidad (no compite con el contenido)
      style={{
        backgroundImage:
          "radial-gradient(1200px 500px at 10% 0%, rgba(59,130,246,.08), transparent 60%), radial-gradient(1200px 500px at 100% 100%, rgba(34,211,238,.10), transparent 60%)",
      }}
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-sky-50 to-cyan-50"
        aria-hidden="true"
      />

      {/* Blobs suaves */}
      <div
        className="pointer-events-none absolute top-24 -left-16 h-72 w-72 rounded-full bg-blue-200/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl"
        aria-hidden="true"
      />

      <motion.div
        className="container relative z-10 mx-auto px-4 py-12 sm:py-16 lg:py-24"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center lg:flex-row">
          {/* Texto */}
          <div className="mb-12 w-full lg:mb-0 lg:w-1/2">
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
              Garantiza el cumplimiento legal, elimina errores y ahorra hasta un
              90% de tiempo en gestión CAE. Sin configuraciones complejas.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4 font-semibold text-white shadow-lg transition-transform duration-200 hover:from-blue-700 hover:to-cyan-700 hover:scale-[1.02] focus:outline-none focus-visible:ring focus-visible:ring-cyan-500/50"
              >
                Agenda una demo
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 bg-white px-8 py-4 font-semibold text-blue-600 shadow-sm transition-transform duration-200 hover:scale-[1.02] focus:outline-none focus-visible:ring focus-visible:ring-cyan-500/40"
              >
                Crea tu cuenta gratis
                <svg
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            {/* Stats */}
            <ul className="mt-10 flex flex-wrap gap-6">
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
                    <span className="block text-sm text-gray-600">
                      {s.label}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mock del producto */}
          <div className="flex w-full justify-center lg:w-1/2">
            <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <svg
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
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
                  <span className="font-semibold text-gray-800">
                    PlayCae AI
                  </span>
                </div>
                <div className="text-sm text-gray-500">Dashboard PRL</div>
              </div>

              {/* Progreso */}
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-gray-600">Documentos validados</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2.5 rounded-full bg-blue-600"
                      style={{ width: "87%" }}
                    />
                  </div>
                </div>

                {/* Lista de docs */}
                <div className="space-y-3">
                  {DOCS.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="flex items-center">
                        <span
                          className={`mr-3 h-3 w-3 rounded-full ${
                            dotBgByColor[doc.color]
                          }`}
                          aria-hidden="true"
                        />
                        <span className="text-gray-800">{doc.name}</span>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          textByColor[doc.color]
                        }`}
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="w-full inline-flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 py-2 font-medium text-blue-600 transition-colors  focus:outline-none focus-visible:ring focus-visible:ring-cyan-500/40">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Añadir más documentos
                </div>
              </div>

              {/* Sello */}
              <div className="pointer-events-none absolute -right-4 -top-4 rotate-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-2 text-white shadow-lg">
                <div className="flex items-center">
                  <svg
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1 h-6 w-6"
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
                  <span className="font-bold">Cumplimiento 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Wave inferior — senefas sin línea azul */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block h-20 w-full"
        >
          <path
            d="M0,120 C300,20 900,200 1200,40 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>

      {/* Respeto a usuarios con reduce motion */}
      <style>
        {`
          @media (prefers-reduced-motion: reduce) {
            .hover\\:scale-[1.02]:hover { transform: none; }
            .group:hover .group-hover\\:translate-x-0\\.5 { transform: none; }
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
