"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

type Particle = {
  top: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
};

function Particles({ count = 15 }: { count?: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    // Respeta prefers-reduced-motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setReduced(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);

    if (!reduced) {
      const generated: Particle[] = Array.from({ length: count }, () => ({
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 20 + 5,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }));
      setParticles(generated);
    } else {
      setParticles([]);
    }

    return () => mq.removeEventListener?.("change", handler);
  }, [count, reduced]);

  if (reduced) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-playBlueLight/20"
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
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden bg-gradient-to-br from-playBlueDark to-playBlueLight py-24 text-white"
      aria-labelledby="footer-title"
    >
      {/* Fondos decorativos */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-white" />
        <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-playOrange" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
          {/* Columna izquierda: claim + CTAs */}
          <div className="w-full lg:w-1/2">
            <h2
              id="footer-title"
              className="mb-6 text-4xl font-bold leading-tight md:text-5xl"
            >
              Transforma tu gestión PRL: <br />
              <span className="text-playOrange">Menos Riesgo, Más Control</span>
            </h2>

            <p className="mb-8 max-w-xl text-xl text-playGrey">
              Obtén el sello{" "}
              <span className="rounded-md bg-playBlueLight px-2 py-1 text-white">
                #Cumplimiento100%
              </span>{" "}
              verificable para inspecciones de Trabajo
            </p>

            {/* CTAs: usa Link para navegación */}
            <div
              className="mb-10 flex flex-col gap-4 sm:flex-row"
              role="group"
              aria-label="Acciones principales"
            >
              <Link
                href="/signup"
                className="flex items-center justify-center rounded-full bg-playOrange px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl hover:bg-playOrange/90"
                aria-label="Crear cuenta gratis en PlayCAE"
              >
                Prueba Gratis 30 Días
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>

              <Link
                href="/contacto"
                className="flex items-center justify-center rounded-full border-2 border-playOrange bg-transparent px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-playOrange/20"
                aria-label="Solicitar demo personalizada de PlayCAE"
              >
                Solicitar Demo Personalizada
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>

            {/* Garantía */}
            <div className="border-l-4 border-cyan-400 pl-4 py-2">
              <p className="italic text-blue-200">
                “De empresas constructoras para el sector: desarrollado en
                Barcelona con soporte técnico local”
              </p>
              <div className="mt-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1 h-5 w-5 text-cyan-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
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

          {/* Columna derecha: sello (sin cambios visuales) */}
          <div className="flex w-full justify-center lg:w-1/2">
            <div className="relative" aria-hidden="true">
              <div className="flex h-64 w-64 items-center justify-center rounded-full border-8 border-playOrange animate-pulse-slow">
                <div className="flex h-56 w-56 items-center justify-center rounded-full border-4 border-playOrange/60">
                  <div className="text-center">
                    <div className="animate-bounce-slow">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto h-20 w-20 text-playOrange"
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
                      <span className="block text-xl font-bold text-playOrange">
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
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-playOrange opacity-20 animate-ping-slow" />
              <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-playBlueLight opacity-30 animate-ping-slower" />
            </div>
          </div>
        </div>

        {/* NAV de footer: enlaces clave + legales */}
        <div
          className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
          role="navigation"
          aria-label="Enlaces del sitio"
        >
          <div>
            <h3 className="mb-4 text-lg font-semibold text-playOrange">
              Producto
            </h3>
            <ul className="space-y-2 text-playGrey">
              <li>
                <Link
                  href="/servicios/gestion-documentacion-cae"
                  className="hover:underline"
                >
                  Validación PRL y CAE
                </Link>
              </li>
              <li>
                <Link
                  href="/servicios/control-accesos-fabrica"
                  className="hover:underline"
                >
                  Control de accesos
                </Link>
              </li>
              <li>
                <Link href="/precios" className="hover:underline">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="hover:underline">
                  Todos los servicios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-playOrange">
              Recursos
            </h3>
            <ul className="space-y-2 text-playGrey">
              <li>
                <Link href="/que-es-cae" className="hover:underline">
                  ¿Qué es la CAE?
                </Link>
              </li>
              <li>
                <Link
                  href="/alternativas-software-cae"
                  className="hover:underline"
                >
                  Alternativas CAE
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-playOrange">
              Compañía
            </h3>
            <ul className="space-y-2 text-playGrey">
              <li>
                <Link href="/contacto" className="hover:underline">
                  Contacto
                </Link>
              </li>
              <li>
                <a
                  href="mailto:soporte@playcae.com"
                  className="hover:underline"
                >
                  soporte@playcae.com
                </a>
              </li>
              <li>
                <a href="tel:+34600123456" className="hover:underline">
                  +34 628 735 826
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold text-playOrange">
              Legal
            </h3>
            <ul className="space-y-2 text-playGrey">
              <li>
                <Link href="/legal/aviso-legal" className="hover:underline">
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="hover:underline">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:underline">
                  Política de cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="mt-12 border-t border-white/10 pt-6 text-sm text-playGrey flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} PlayCAE. Todos los derechos reservados.</p>
          <p className="opacity-90">
            Operamos en España · Cumplimiento LSSI y RGPD ·{" "}
            <Link href="/sitemap.xml" className="underline">
              Sitemap
            </Link>
          </p>
        </div>
      </div>

      <Particles count={15} />
    </footer>
  );
}
