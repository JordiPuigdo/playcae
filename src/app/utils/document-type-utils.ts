import { DocumentType } from "@/types/worker";

// Tipo para la función de traducción que acepta cualquier string como clave
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TranslateFunction = (key: any, variables?: Record<string, string | number>) => string;

/**
 * Helper para obtener el nombre traducido de un DocumentType
 * Usa el ID del documento como clave de traducción, con fallback al nombre de BD
 */
export const getDocumentTypeName = (
  documentType: DocumentType | undefined,
  t: TranslateFunction
): string => {
  if (!documentType) return "";
  
  const translationKey = `documentTypes.${documentType.id}` as const;
  const translated = t(translationKey as any);
  
  // Si la traducción devuelve la misma clave, usar el nombre de BD como fallback
  if (translated === translationKey) {
    return documentType.name;
  }
  
  return translated;
};

/**
 * Helper para obtener el nombre traducido dado solo un ID
 * Útil cuando no tienes el objeto DocumentType completo
 */
export const getDocumentTypeNameById = (
  id: string,
  t: TranslateFunction,
  fallbackName?: string
): string => {
  const translationKey = `documentTypes.${id}` as const;
  const translated = t(translationKey as any);
  
  if (translated === translationKey) {
    return fallbackName || id;
  }
  
  return translated;
};
