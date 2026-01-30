import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/i18n/types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/types";

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * Store de Zustand para el idioma de la aplicación.
 * Persiste la preferencia en localStorage.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale: Locale) => {
        // Validar que el locale sea soportado
        if (SUPPORTED_LOCALES.includes(locale)) {
          set({ locale });
          // Actualizar el atributo lang del HTML para accesibilidad
          if (typeof document !== "undefined") {
            document.documentElement.lang = locale;
          }
        }
      },
    }),
    {
      name: "playcae-language", // nombre de la key en localStorage
      // Migración en caso de que haya datos antiguos inválidos
      migrate: (persistedState: unknown) => {
        const state = persistedState as LanguageState | undefined;
        if (state && !SUPPORTED_LOCALES.includes(state.locale)) {
          return { ...state, locale: DEFAULT_LOCALE };
        }
        return state as LanguageState;
      },
    }
  )
);
