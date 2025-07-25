import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-900 to-cyan-800 overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-cyan-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Contenido textual */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Transforma tu gestión PRL: <br />
              <span className="text-cyan-300">Menos Riesgo, Más Control</span>
            </h2>

            <p className="text-xl text-blue-100 mb-8 max-w-xl">
              Obtén el sello{" "}
              <span className="bg-blue-700 text-cyan-300 px-2 py-1 rounded-md">
                #Cumplimiento100%
              </span>{" "}
              verificable para inspecciones de Trabajo
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="bg-white text-blue-900 font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center">
                Prueba Gratis 30 Días
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

              <button className="bg-transparent border-2 border-cyan-400 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 hover:bg-cyan-500/20 flex items-center justify-center">
                Solicitar Demo Personalizada
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

            {/* Garantía */}
            <div className="border-l-4 border-cyan-400 pl-4 py-2">
              <p className="text-blue-200 italic">
                "De empresas constructoras para el sector: Desarrollado en
                Barcelona con soporte técnico local"
              </p>
              <div className="flex items-center mt-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-cyan-400 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-blue-200 text-sm">
                  Soporte técnico en español · Horario peninsular
                </span>
              </div>
            </div>
          </div>

          {/* Sello animado */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Sello exterior */}
              <div className="w-64 h-64 rounded-full border-8 border-cyan-400 flex items-center justify-center animate-pulse-slow">
                <div className="w-56 h-56 rounded-full border-4 border-cyan-300 flex items-center justify-center">
                  {/* Sello interior animado */}
                  <div className="text-center">
                    <div className="animate-bounce-slow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 mx-auto text-cyan-300"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="mt-4">
                      <span className="text-cyan-300 text-xl font-bold block">
                        VALIDADO
                      </span>
                      <span className="text-white text-sm">
                        por Inteligencia Artificial
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elementos decorativos alrededor del sello */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-cyan-500 opacity-20 animate-ping-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-blue-500 opacity-30 animate-ping-slower"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animación de partículas */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400 opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 20 + 5}px`,
              height: `${Math.random() * 20 + 5}px`,
              animation: `float ${
                Math.random() * 10 + 10
              }s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>
    </section>
  );
}
