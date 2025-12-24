"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const productoLinks = [
  {
    href: "/servicios/gestion-documentacion-cae",
    label: "Validación documental IA",
  },
  { href: "/servicios/control-accesos-fabrica", label: "Control de accesos" },
  { href: "/servicios", label: "Ver todos los servicios" },
];

const recursosLinks = [
  { href: "/que-es-cae", label: "¿Qué es la CAE?" },
  { href: "/alternativas-software-cae", label: "Alternativas CAE" },
  { href: "/blog", label: "Blog" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productoOpen, setProductoOpen] = useState(false);
  const [recursosOpen, setRecursosOpen] = useState(false);
  const productoRef = useRef<HTMLDivElement>(null);
  const recursosRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    window.open("/login", "_blank");
    setMenuOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        productoRef.current &&
        !productoRef.current.contains(event.target as Node)
      ) {
        setProductoOpen(false);
      }
      if (
        recursosRef.current &&
        !recursosRef.current.contains(event.target as Node)
      ) {
        setRecursosOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center transition-transform hover:scale-[1.02]"
          aria-label="Ir al inicio"
        >
          <Image
            src="/assets/playcae.png"
            alt="Logo Play CAE"
            width={120}
            height={40}
            className="select-none"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center space-x-6">
          {/* Producto dropdown */}
          <div ref={productoRef} className="relative">
            <button
              onClick={() => setProductoOpen(!productoOpen)}
              className="flex items-center gap-1 text-gray-700 font-medium transition-colors hover:text-playBlueDark"
            >
              Producto
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  productoOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {productoOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {productoLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setProductoOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-playGrey hover:text-playBlueDark transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/precios"
            className="text-gray-700 font-medium transition-colors hover:text-playBlueDark"
          >
            Precios
          </Link>

          {/* Recursos dropdown */}
          <div ref={recursosRef} className="relative">
            <button
              onClick={() => setRecursosOpen(!recursosOpen)}
              className="flex items-center gap-1 text-gray-700 font-medium transition-colors hover:text-playBlueDark"
            >
              Recursos
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  recursosOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {recursosOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                {recursosLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setRecursosOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-playGrey hover:text-playBlueDark transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contacto"
            className="text-gray-700 font-medium transition-colors hover:text-playBlueDark"
          >
            Contacto
          </Link>

          {/* CTA principal */}
          <Link
            href="/contacto"
            className="rounded-full bg-playOrange px-6 py-2 font-semibold text-white shadow-md transition-all hover:bg-playOrange/90 hover:scale-[1.03]"
          >
            Agenda una demo
          </Link>

          {/* Login */}
          <button
            onClick={handleLogin}
            className="rounded-full border border-playBlueDark px-5 py-2 font-semibold text-playBlueDark transition-colors hover:bg-playBlueLight/10"
          >
            Login
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Abrir menú"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white shadow-lg animate-fade-in">
          <nav
            className="flex flex-col space-y-1 px-4 py-6"
            aria-label="Menú móvil"
          >
            {/* Producto section */}
            <div className="py-2">
              <p className="text-xs uppercase text-playBlueLight font-semibold mb-2 px-2">
                Producto
              </p>
              {productoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 text-gray-900 hover:text-playBlueDark transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 my-2" />

            <Link
              href="/precios"
              className="px-2 py-2 font-medium text-gray-900 hover:text-playBlueDark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Precios
            </Link>

            <div className="border-t border-gray-100 my-2" />

            {/* Recursos section */}
            <div className="py-2">
              <p className="text-xs uppercase text-playBlueLight font-semibold mb-2 px-2">
                Recursos
              </p>
              {recursosLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-2 py-2 text-gray-900 hover:text-playBlueDark transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 my-2" />

            <Link
              href="/contacto"
              className="px-2 py-2 font-medium text-gray-900 hover:text-playBlueDark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </Link>

            <div className="pt-4 space-y-3">
              <Link
                href="/contacto"
                onClick={() => setMenuOpen(false)}
                className="block w-full rounded-full bg-playOrange px-6 py-3 font-semibold text-white shadow-lg hover:bg-playOrange/90 transition-colors text-center"
              >
                Agenda una demo
              </Link>

              <button
                onClick={handleLogin}
                className="block w-full rounded-full border border-playBlueDark px-6 py-3 font-semibold text-playBlueDark hover:bg-playBlueLight/10 transition-colors text-center"
              >
                Login
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
