"use client";

import { useCallback, useMemo } from "react";
import { useLanguageStore } from "./useLanguageStore";
import {
  getTranslations,
  interpolate,
  type Translations,
  type Locale,
  LOCALE_INFO,
  SUPPORTED_LOCALES,
} from "@/i18n";

type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

export type TranslationKey = NestedKeyOf<Translations>;

/**
 * Hook para obtener traducciones en la aplicación.
 *
 * @example
 * const { t, locale, setLocale } = useTranslation();
 *
 * // Uso básico
 * t('common.save') // "Guardar" o "Desar"
 *
 * // Con interpolación
 * t('dashboard.welcome', { name: 'Juan' }) // "Bienvenido, Juan"
 */
export function useTranslation() {
  const { locale, setLocale } = useLanguageStore();

  const translations = useMemo(() => getTranslations(locale), [locale]);

  /**
   * Función para obtener una traducción por su key
   */
  const t = useCallback(
    (key: TranslationKey, variables?: Record<string, string | number>): string => {
      // Navegar por el objeto de traducciones usando la key
      const keys = key.split(".");
      let value: unknown = translations;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = (value as Record<string, unknown>)[k];
        } else {
          // Si no se encuentra la key, devolver la key misma (para debug)
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }

      if (typeof value !== "string") {
        console.warn(`Translation value is not a string for key: ${key}`);
        return key;
      }

      // Si hay variables, interpolar
      if (variables) {
        return interpolate(value, variables);
      }

      return value;
    },
    [translations]
  );

  return {
    t,
    locale,
    setLocale,
    locales: SUPPORTED_LOCALES,
    localeInfo: LOCALE_INFO,
  };
}

/**
 * Hook para obtener solo el locale actual (sin re-render en cambios de traducciones)
 */
export function useLocale(): Locale {
  return useLanguageStore((state) => state.locale);
}
