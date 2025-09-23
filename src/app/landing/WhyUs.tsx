import { motion } from "framer-motion";

export default function WhyUs() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Por qué las empresas CAE confían en PlayCAE
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Más de 200 empresas del sector construcción y prevención de riesgos
            avalan nuestra solución
          </p>
        </motion.div>

        {/* Grid de 4 items */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut", staggerChildren: 0.15 }}
        >
          {/* Item 1: Actualización normativa */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Actualización normativa en tiempo real
            </h3>
            <p className="text-gray-600 mb-4">
              Base de datos legal con seguimiento automático de BOE, DOGC y
              EUR-Lex :cite[1]:cite[5]
            </p>
            <div className="flex items-center text-sm text-blue-600">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Incluye RD 171/2004, LPRL 31/1995 y directivas UE</span>
            </div>
          </div>

          {/* Item 2: Certificación */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Certificado ISO 27001:2022
            </h3>
            <p className="text-gray-600 mb-4">
              Documentos encriptados con AES-256 y alojados en centros de datos
              UE :cite[4]:cite[10]
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                GDPR Compliant
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                LOPDGDD
              </span>
            </div>
          </div>

          {/* Item 3: Integraciones */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">📈</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Integraciones nativas
            </h3>
            <p className="text-gray-600 mb-4">
              Conexión directa con SAP, A3CE y software CAE mediante API REST
            </p>
            <div className="flex items-center space-x-3 mt-4">
              <div className="bg-gray-100 p-2 rounded-lg">
                <span className="font-bold text-gray-800">SAP</span>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <span className="font-bold text-gray-800">A3CE</span>
              </div>
            </div>
          </div>

          {/* Item 4: Algoritmos */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-amber-100 hover:shadow-xl transition-shadow">
            <div className="w-14 h-14 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Algoritmos expertos
            </h3>
            <p className="text-gray-600 mb-4">
              Desarrollados con técnicos de PRL y abogados laboralistas
              especializados
            </p>
            <div className="mt-3">
              <div className="flex items-center text-sm text-amber-600">
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>99.2% precisión en validaciones documentales</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Sección de integraciones y certificaciones */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 md:p-12 border border-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/5">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Cumplimiento Total Garantizado
              </h3>
              <p className="text-gray-700 mb-6">
                Nuestra solución cumple con los más altos estándares de
                seguridad y normativas sectoriales:
              </p>
              <ul className="space-y-3">
                {[
                  "ISO/IEC 27001:2022 - Gestión de seguridad de la información :cite[10]",
                  "Reglamento GDPR - Protección de datos UE",
                  "LOPDGDD - Adaptación española al RGPD",
                  "EN 45545 - Seguridad en entornos industriales",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Imagen de integraciones */}
            <div className="md:w-3/5 bg-white p-6 rounded-xl shadow-inner border border-gray-200">
              <h4 className="font-bold text-center text-gray-700 mb-6">
                Integraciones y Certificaciones
              </h4>
              <div className="grid grid-cols-3 gap-4 items-center justify-items-center">
                {[
                  { name: "ISO 27001", icon: "🛡️", color: "blue" },
                  { name: "GDPR", icon: "📜", color: "purple" },
                  { name: "SAP", icon: "🔌", color: "indigo" },
                  { name: "A3CE", icon: "🏗️", color: "amber" },
                  { name: "Hisenda", icon: "💰", color: "green" },
                  { name: "BOE", icon: "📰", color: "red" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`bg-${item.color}-50 rounded-lg p-4 w-full text-center border border-${item.color}-100`}
                  >
                    <span className="text-2xl block mb-2">{item.icon}</span>
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA final */}
        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 inline-flex items-center">
            Comenzar Prueba Gratuita
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <p className="mt-4 text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
              ✅
            </span>
            Garantía de cumplimiento 100% verificable para inspecciones de
            Trabajo
          </p>
        </div>
      </div>
    </section>
  );
}
