"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Shield, Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogin = () => {
    window.open("/login", "_blank");
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Play CAE</h1>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-4">
          <a
            href="#how-it-works"
            className="text-black transition-colors hover:text-primary"
          >
            ¿Cómo funciona?
          </a>
          <a
            href="#contact"
            className="text-black transition-colors hover:text-primary"
          >
            Contacto
          </a>
          <a href="#contact">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700">
              Agenda una demo
            </Button>
          </a>
          <Button variant="outline" onClick={handleLogin}>
            Login
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white shadow-lg">
          <nav className="flex flex-col space-y-4 px-4 py-6 text-right">
            <a
              href="#how-it-works"
              className="font-bold text-lg tracking-wide text-gray-900 hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              ¿Cómo funciona?
            </a>
            <a
              href="#contact"
              className="font-bold text-lg tracking-wide text-gray-900 hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Contacto
            </a>
            <button
              onClick={handleLogin}
              className="font-bold text-lg tracking-wide text-gray-900 hover:text-primary transition-colors"
            >
              Login
            </button>
            <a href="#contact" onClick={() => setMenuOpen(false)}>
              <div className="w-[70%] ml-auto rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 font-semibold text-white shadow-lg hover:from-blue-700 hover:to-cyan-700 transition-colors text-center">
                Agenda una demo
              </div>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
