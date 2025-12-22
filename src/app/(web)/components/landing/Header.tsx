"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/"
            className="text-gray-700 font-medium transition-colors hover:text-playBlueDark"
          >
            Inicio
          </Link>

          <Link
            href="/servicios"
            className="text-gray-700 font-medium transition-colors hover:text-playBlueDark"
          >
            Producto
          </Link>

          <Link
            href="/blog"
            className="text-gray-700 font-medium transition-colors hover:text-playBlueDark"
          >
            Blog
          </Link>

          <Link
            href="/contacto"
            className="text-gray-700 font-medium transition-colors hover:text-playBlueDark"
          >
            Contacto
          </Link>

          {/* CTA principal */}
          <Link
            href="/contacto"
            className="rounded-full bg-gradient-to-r from-playOrange to-playOrange/80 px-6 py-2 font-semibold text-white shadow-md transition-transform hover:scale-[1.03] hover:from-playOrange/90 hover:to-playOrange/70"
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
              className="font-semibold text-lg text-gray-900 hover:text-playBlueDark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Inicio
            </Link>

            <Link
              href="/servicios"
              className="font-semibold text-lg text-gray-900 hover:text-playBlueDark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Producto
            </Link>

            <Link
              href="/blog"
              className="font-semibold text-lg text-gray-900 hover:text-playBlueDark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>

            <Link
              href="/contacto"
              className="font-semibold text-lg text-gray-900 hover:text-playBlueDark transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </Link>

            <Link
              href="/contacto"
              onClick={() => setMenuOpen(false)}
              className="w-[70%] ml-auto rounded-full bg-gradient-to-r from-playOrange to-playOrange/80 px-6 py-3 font-semibold text-white shadow-lg hover:from-playOrange/90 hover:to-playOrange/70 transition-colors text-center"
            >
              Agenda una demo
            </Link>

            <button
              onClick={handleLogin}
              className="self-end font-semibold text-lg text-gray-900 hover:text-playBlueDark transition-colors"
            >
              Login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
