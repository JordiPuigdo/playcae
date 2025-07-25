export default function DocumentationSupported() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-green-100 rounded-full opacity-30 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Automatiza la validación PRL en 3 pasos
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Transforma semanas de trabajo manual en minutos con nuestro agente
            IA especializado en normativa PRL y CAE
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Diagrama visual - Flujo animado */}
          <div className="relative w-full lg:w-2/5">
            <div className="relative h-96">
              {/* Documento entrante */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-float">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200 w-48">
                  <div className="flex items-center mb-2">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-red-500"
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
                    <span className="ml-2 text-sm font-medium">
                      Documento PRL
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Subcontrata_EPIs.pdf
                  </div>
                </div>
              </div>

              {/* Procesamiento IA */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-blue-600 text-white p-6 rounded-full w-32 h-32 flex items-center justify-center animate-pulse">
                  <div className="text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 mx-auto mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                    <span className="font-bold">Analizando</span>
                  </div>
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-20"></div>
              </div>

              {/* Resultados */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="flex space-x-4">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-green-200 w-32">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-100 p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-green-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-1 text-xs font-medium">Válido</span>
                    </div>
                    <div className="text-xs text-gray-500">Formación.pdf</div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-lg border border-yellow-200 w-32">
                    <div className="flex items-center mb-2">
                      <div className="bg-yellow-100 p-1 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-1 text-xs font-medium">Revisar</span>
                    </div>
                    <div className="text-xs text-gray-500">EPIs.pdf</div>
                  </div>
                </div>
              </div>

              {/* Flechas del proceso */}
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-40 bg-gray-200 rounded-full"></div>
              <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-1 h-40 bg-gradient-to-b from-gray-200 to-blue-600 rounded-full animate-flow"></div>
              <div className="absolute top-60 left-1/2 transform -translate-x-1/2 w-1 h-40 bg-gray-200 rounded-full"></div>
              <div className="absolute top-60 left-1/2 transform -translate-x-1/2 w-1 h-40 bg-gradient-to-b from-blue-600 to-gray-200 rounded-full animate-flow-2"></div>
            </div>
          </div>

          {/* Pasos del proceso */}
          <div className="w-full lg:w-3/5">
            <div className="space-y-12">
              {/* Paso 1 */}
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🔄</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="bg-blue-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                      1
                    </span>
                    Sube documentos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    PDF, imágenes o Word. Soporte OCR para escaneos ilegibles
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {["PDF", "JPG", "PNG", "DOCX", "TIFF", "HEIC"].map(
                        (format, idx) => (
                          <span
                            key={idx}
                            className="bg-white px-3 py-1 rounded-full text-sm border border-gray-200 shadow-sm"
                          >
                            {format}
                          </span>
                        )
                      )}
                    </div>
                    <div className="mt-4 flex items-center text-sm text-gray-500">
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
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>Hasta 100 documentos simultáneos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paso 2 */}
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🤖</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="bg-purple-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                      2
                    </span>
                    Validación automática
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Nuestro agente IA comprueba en segundos:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        icon: "🔍",
                        title: "Coherencia de datos",
                        desc: "CIF, nombres, fechas",
                      },
                      {
                        icon: "📅",
                        title: "Vigencia legal",
                        desc: "LPRL 31/1995, RD 39/1997",
                      },
                      {
                        icon: "🛡️",
                        title: "Autenticidad",
                        desc: "Detección de manipulaciones",
                      },
                      {
                        icon: "📜",
                        title: "Cumplimiento normativo",
                        desc: "RD 171/2004, Llei 32/2006",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start">
                          <span className="text-xl mr-3">{item.icon}</span>
                          <div>
                            <h4 className="font-bold text-gray-800">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Paso 3 */}
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center">
                    <span className="text-2xl">📊</span>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                      3
                    </span>
                    Resultados ejecutables
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Informes claros con acciones específicas para cada caso
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        color: "green",
                        title: "Documentos válidos",
                        desc: "JSON estructurado listo para integración",
                      },
                      {
                        color: "yellow",
                        title: "Correcciones",
                        desc: "Alertas con sugerencias específicas",
                      },
                      {
                        color: "red",
                        title: "Revisión experta",
                        desc: "Derivación a técnicos PRL",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className={`bg-${item.color}-50 p-4 rounded-lg border border-${item.color}-200`}
                      >
                        <h4 className="font-bold flex items-center">
                          <span
                            className={`bg-${item.color}-500 w-3 h-3 rounded-full mr-2`}
                          ></span>
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center mx-auto">
                Ver demostración en vivo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <p className="mt-4 text-gray-600">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2">
                  🆕
                </span>
                Procesamiento en tiempo real con precisión del 99.2%
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
