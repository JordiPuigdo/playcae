export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-200 rounded-full opacity-30 blur-3xl"></div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Contenido textual */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full mb-6 text-sm font-medium">
              <span className="mr-2">🚀</span> Innovación en PRL
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Automatiza la validación documental del PRL con
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                {" "}
                Inteligencia Artificial
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Garantiza el cumplimiento legal, elimina errores y ahorra hasta un
              90% de tiempo en gestión CAE. Sin configuraciones complejas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center">
                Agenda una demo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button className="bg-white border-2 border-blue-600 text-blue-600 font-bold py-4 px-8 rounded-full shadow-sm transition-all transform hover:scale-105 flex items-center justify-center">
                Crea tu cuenta gratis
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Estadísticas de confianza */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { value: "99.2%", label: "Precisión en validaciones" },
                { value: "90%", label: "Ahorro de tiempo" },
                { value: "0", label: "Sanciones por PRL" },
              ].map((stat, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <svg
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
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-xl">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visualización del producto */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-200 p-6 max-w-lg w-full">
              {/* Header del dashboard */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                    <svg
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
                  <span className="font-bold text-gray-800">ValerDoc AI</span>
                </div>
                <div className="text-sm text-gray-500">Dashboard PRL</div>
              </div>

              {/* Contenido del dashboard */}
              <div className="space-y-4">
                {/* Barra de progreso */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Documentos validados</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: "87%" }}
                    ></div>
                  </div>
                </div>

                {/* Documentos */}
                <div className="space-y-3">
                  {[
                    {
                      name: "Evaluación de riesgos",
                      status: "validado",
                      color: "green",
                    },
                    {
                      name: "Formación PRL básica",
                      status: "pendiente",
                      color: "yellow",
                    },
                    {
                      name: "Certificado SS",
                      status: "validado",
                      color: "green",
                    },
                    { name: "Contrato SPA", status: "revisión", color: "red" },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-3 bg-${doc.color}-500`}
                        ></div>
                        <span className="text-gray-800">{doc.name}</span>
                      </div>
                      <span
                        className={`text-${doc.color}-600 text-sm font-medium`}
                      >
                        {doc.status.charAt(0).toUpperCase() +
                          doc.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botón de acción */}
                <button className="w-full bg-blue-50 text-blue-600 font-medium py-2 rounded-lg flex items-center justify-center border border-blue-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
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
                </button>
              </div>

              {/* Sello de validación */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-2 rounded-lg shadow-lg transform rotate-12">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-1"
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
      </div>

      {/* Elemento decorativo inferior */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-full h-20"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            className="fill-white"
            opacity="0.25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            className="fill-white"
            opacity="0.5"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}
