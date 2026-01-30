import type { Locale } from "./types";
import { DEFAULT_LOCALE } from "./types";

// Importar traducciones
import es from "./locales/es.json";
import ca from "./locales/ca.json";

// Tipo inferido de las traducciones
export type Translations = typeof es;

// Mapa de traducciones por locale
const translations: Record<Locale, Translations> = {
  es,
  ca,
};

/**
 * Obtiene las traducciones para un idioma específico
 */
export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations[DEFAULT_LOCALE];
}

/**
 * Función para interpolar variables en strings de traducción
 * Ejemplo: interpolate("Hola {name}", { name: "Juan" }) => "Hola Juan"
 */
export function interpolate(
  text: string,
  variables: Record<string, string | number>
): string {
  return text.replace(/{(\w+)}/g, (_, key) => {
    return variables[key]?.toString() || `{${key}}`;
  });
}

// Re-exportar tipos
export * from "./types";
