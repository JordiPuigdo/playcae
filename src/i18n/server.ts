import { cookies } from "next/headers";
import type { Locale } from "./types";
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from "./types";
import es from "./locales/es.json";
import ca from "./locales/ca.json";

export type Translations = typeof es;

const translations: Record<Locale, Translations> = {
  es,
  ca,
};

/**
 * Nombre de la cookie donde se guarda el idioma
 */
export const LANGUAGE_COOKIE_NAME = "playcae-language";

/**
 * Obtiene las traducciones para Server Components.
 * Lee el idioma desde las cookies del request.
 */
export async function getServerTranslations(): Promise<Translations> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  // Validar que sea un locale soportado
  const locale: Locale =
    langCookie && SUPPORTED_LOCALES.includes(langCookie as Locale)
      ? (langCookie as Locale)
      : DEFAULT_LOCALE;

  return translations[locale];
}

/**
 * Obtiene el locale actual desde las cookies (para Server Components)
 */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const langCookie = cookieStore.get(LANGUAGE_COOKIE_NAME)?.value;

  return langCookie && SUPPORTED_LOCALES.includes(langCookie as Locale)
    ? (langCookie as Locale)
    : DEFAULT_LOCALE;
}

/**
 * Función para interpolar variables en strings de traducción (server-side)
 */
export function interpolate(
  text: string,
  variables: Record<string, string | number>
): string {
  return text.replace(/{(\w+)}/g, (_, key) => {
    return variables[key]?.toString() || `{${key}}`;
  });
}
