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
  flag: string;
}

export const LOCALE_INFO: Record<Locale, LocaleInfo> = {
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
  },
  ca: {
    code: "ca",
    name: "Catalan",
    nativeName: "Català",
    flag: "ᴄᴀ",
  },
  // Para añadir más idiomas en el futuro:
  // eu: {
  //   code: "eu",
  //   name: "Basque",
  //   nativeName: "Euskara",
  //   flag: "🏴",
  // },
  // gl: {
  //   code: "gl",
  //   name: "Galician",
  //   nativeName: "Galego",
  //   flag: "🏴",
  // },
  // en: {
  //   code: "en",
  //   name: "English",
  //   nativeName: "English",
  //   flag: "🇬🇧",
  // },
};
