// Tipos para el sistema de internacionalización

export type Locale = "es" | "ca";

// Para añadir más idiomas en el futuro, simplemente añade aquí:
// export type Locale = "es" | "ca" | "eu" | "gl" | "en";

export const SUPPORTED_LOCALES: Locale[] = ["es", "ca"];

export const DEFAULT_LOCALE: Locale = "es";

export interface LocaleInfo {
  code: Locale;
  name: string;
  nativeName: string;
  flagSrc: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flagSrc: "/assets/flags/es.svg",
  },
  ca: {
    code: "ca",
    name: "Catalan",
    nativeName: "Català",
    flagSrc: "/assets/flags/cat.svg",
  },
  // Para añadir más idiomas en el futuro:
  // eu: { code: "eu", name: "Basque", nativeName: "Euskara", flagSrc: "/assets/flags/eu.svg" },
  // gl: { code: "gl", name: "Galician", nativeName: "Galego", flagSrc: "/assets/flags/gl.svg" },
  // en: { code: "en", name: "English", nativeName: "English", flagSrc: "/assets/flags/en.svg" },
};
