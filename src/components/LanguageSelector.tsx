"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { Locale } from "@/i18n/types";

interface LanguageSelectorProps {
  /** Variante visual del selector */
  variant?: "default" | "minimal" | "button";
  /** Mostrar bandera */
  showFlag?: boolean;
  /** Mostrar nombre del idioma */
  showName?: boolean;
  /** Clase CSS adicional */
  className?: string;
}

export default function LanguageSelector({
  variant = "default",
  showFlag = true,
  showName = true,
  className = "",
}: LanguageSelectorProps) {
  const { locale, setLocale, locales, localeInfo } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const currentLocale = localeInfo[locale];

  // Estilos según variante
  const buttonStyles = {
    default:
      "flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors",
    minimal:
      "flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-100 transition-colors text-sm",
    button:
      "flex items-center gap-2 px-4 py-2 rounded-full bg-playGrey hover:bg-gray-200 transition-colors font-medium",
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonStyles[variant]}
        aria-label="Seleccionar idioma"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {variant === "minimal" && <Globe className="h-4 w-4 text-gray-500" />}
        {showFlag && <span className="text-lg">{currentLocale.flag}</span>}
        {showName && (
          <span className="text-gray-700">{currentLocale.nativeName}</span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full mt-1 min-w-[140px] bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50"
          role="listbox"
          aria-label="Idiomas disponibles"
        >
          {locales.map((localeCode) => {
            const info = localeInfo[localeCode];
            const isSelected = localeCode === locale;

            return (
              <button
                key={localeCode}
                onClick={() => handleSelectLocale(localeCode)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                  isSelected
                    ? "bg-playGrey text-playBlueDark font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <span className="text-lg">{info.flag}</span>
                <span>{info.nativeName}</span>
                {isSelected && (
                  <span className="ml-auto text-playOrange">✓</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
