import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Locale } from "@/i18n/types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "@/i18n/types";

/**
 * Nombre de la cookie donde se guarda el idioma (sincronizado con server.ts)
 */
const LANGUAGE_COOKIE_NAME = "playcae-language";

/**
 * Guarda el idioma en una cookie para que los Server Components puedan leerlo
 */
function setLanguageCookie(locale: Locale) {
  if (typeof document !== "undefined") {
    // Cookie válida por 1 año, accesible desde todo el sitio
    document.cookie = `${LANGUAGE_COOKIE_NAME}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

interface LanguageState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

/**
 * Store de Zustand para el idioma de la aplicación.
 * Persiste la preferencia en localStorage y sincroniza con cookie para SSR.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      locale: DEFAULT_LOCALE,
      setLocale: (locale: Locale) => {
        // Validar que el locale sea soportado
        if (SUPPORTED_LOCALES.includes(locale)) {
          set({ locale });
          // Sincronizar con cookie para Server Components
          setLanguageCookie(locale);
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
      // Sincronizar cookie cuando se rehidrata desde localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.locale) {
          setLanguageCookie(state.locale);
        }
      },
    }
  )
);
