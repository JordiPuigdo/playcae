"use client";

import React, { useEffect, useState } from "react";

type Particle = {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
};

function Particles({ count = 15 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Genera partículas solo en cliente
    const generated: Particle[] = Array.from({ length: count }, () => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 5,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(generated);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-cyan-400 opacity-20"
          style={{
            top: p.top,
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-cyan-800 py-24">
      {/* Fondos decorativos */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-white" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-cyan-500" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center justify-between lg:flex-row">
          {/* Columna izquierda */}
          <div className="mb-12 w-full lg:mb-0 lg:w-1/2">
            <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              Transforma tu gestión PRL: <br />
              <span className="text-cyan-300">Menos Riesgo, Más Control</span>
            </h2>

            <p className="mb-8 max-w-xl text-xl text-blue-100">
              Obtén el sello{" "}
              <span className="rounded-md bg-blue-700 px-2 py-1 text-cyan-300">
                #Cumplimiento100%
              </span>{" "}
              verificable para inspecciones de Trabajo
            </p>

            {/* CTAs */}
            <div className="mb-10 flex flex-col gap-4 sm:flex-row">
              <button className="flex items-center justify-center rounded-full bg-white px-8 py-4 font-bold text-blue-900 shadow-lg transition-transform hover:scale-105 hover:shadow-xl">
                Prueba Gratis 30 Días
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button className="flex items-center justify-center rounded-full border-2 border-cyan-400 bg-transparent px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-cyan-500/20">
                Solicitar Demo Personalizada
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
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
              <p className="italic text-blue-200">
                "De empresas constructoras para el sector: Desarrollado en
                Barcelona con soporte técnico local"
              </p>
              <div className="mt-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-5 w-5 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-blue-200">
                  Soporte técnico en español · Horario peninsular
                </span>
              </div>
            </div>
          </div>

          {/* Columna derecha: sello */}
          <div className="flex w-full justify-center lg:w-1/2">
            <div className="relative">
              <div className="flex h-64 w-64 items-center justify-center rounded-full border-8 border-cyan-400 animate-pulse-slow">
                <div className="flex h-56 w-56 items-center justify-center rounded-full border-4 border-cyan-300">
                  <div className="text-center">
                    <div className="animate-bounce-slow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-20 w-20 text-cyan-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="mt-4">
                      <span className="block text-xl font-bold text-cyan-300">
                        VALIDADO
                      </span>
                      <span className="text-sm text-white">
                        por Inteligencia Artificial
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorativos */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-cyan-500 opacity-20 animate-ping-slow" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-blue-500 opacity-30 animate-ping-slower" />
            </div>
          </div>
        </div>
      </div>

      {/* Partículas flotantes */}
      <Particles count={15} />
    </section>
  );
}
