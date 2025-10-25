"use client";

import { useState } from "react";
import { Shield, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    window.open("/login", "_blank");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-transform hover:scale-[1.02]"
          aria-label="Ir al inicio"
        >
          <Shield className="h-8 w-8 text-blue-700" />
          <h1 className="text-2xl font-bold text-gray-900">
            Play<span className="text-cyan-600">CAE</span>
          </h1>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 font-medium transition-colors hover:text-blue-700"
          >
            Inicio
          </Link>

          <Link
            href="/servicios"
            className="text-gray-700 font-medium transition-colors hover:text-blue-700"
          >
            Producto
          </Link>

          <Link
            href="/blog"
            className="text-gray-700 font-medium transition-colors hover:text-blue-700"
          >
            Blog
          </Link>

          <Link
            href="/contacto"
            className="text-gray-700 font-medium transition-colors hover:text-blue-700"
          >
            Contacto
          </Link>

          {/* CTA principal */}
          <Link
            href="/contacto"
            className="rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2 font-semibold text-white shadow-md transition-transform hover:scale-[1.03] hover:from-blue-700 hover:to-cyan-700"
          >
            Agenda una demo
          </Link>

          {/* Login */}
          <button
            onClick={handleLogin}
            className="rounded-full border border-cyan-500 px-5 py-2 font-semibold text-cyan-700 transition-colors hover:bg-cyan-50"
          >
            Login
          </button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
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
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg animate-fade-in">
          <nav
            className="flex flex-col space-y-4 px-4 py-6 text-right"
            aria-label="Menú móvil"
          >
            <Link
              href="/"
              className="font-semibold text-lg text-gray-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>

            <Link
              href="/servicios"
              className="font-semibold text-lg text-gray-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Producto
            </Link>

            <Link
              href="/blog"
              className="font-semibold text-lg text-gray-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>

            <Link
              href="/contacto"
              className="font-semibold text-lg text-gray-900 hover:text-blue-700 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </Link>

            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="w-[70%] ml-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-colors text-center"
            >
              Agenda una demo
            </Link>

            <button
              onClick={handleLogin}
              className="self-end font-semibold text-lg text-gray-900 hover:text-blue-700 transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
