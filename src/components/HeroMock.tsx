"use client";

import { motion } from "framer-motion";

const DOCS = [
  { name: "Evaluación de riesgos", status: "Validado", color: "green" },
  { name: "Formación PRL básica", status: "Pendiente", color: "yellow" },
  { name: "Certificado SS", status: "Validado", color: "green" },
  { name: "Contrato SPA", status: "Revisión", color: "red" },
];

const colorMap = {
  green: { dot: "bg-green-500", text: "text-green-600" },
  yellow: { dot: "bg-yellow-500", text: "text-yellow-600" },
  red: { dot: "bg-red-500", text: "text-red-600" },
};

const HeroMock = () => {
  return (
    <motion.div
      className="flex w-full justify-center lg:w-1/2"
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      style={{ willChange: "transform, opacity" }}
    >
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
            <span className="font-semibold text-gray-800">PlayCae AI</span>
          </div>
          <div className="text-sm text-gray-500">Dashboard PRL</div>
        </div>

        {/* Progress */}
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

          {/* Docs */}
          <div className="space-y-3">
            {DOCS.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3"
              >
                <div className="flex items-center">
                  <span
                    className={`mr-3 h-3 w-3 rounded-full ${
                      colorMap[doc.color as keyof typeof colorMap].dot
                    }`}
                  />
                  <span className="text-gray-800">{doc.name}</span>
                </div>
                <span
                  className={`text-sm font-medium ${
                    colorMap[doc.color as keyof typeof colorMap].text
                  }`}
                >
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full inline-flex items-center justify-center rounded-lg border border-blue-100 bg-blue-50 py-2 font-medium text-blue-600">
            + Añadir más documentos
          </div>
        </div>

        {/* Badge */}
        <div className="pointer-events-none absolute -right-4 -top-4 rotate-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 p-2 text-white shadow-lg">
          <div className="flex items-center">
            ✅ <span className="ml-1 font-bold">Cumplimiento 100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroMock;
