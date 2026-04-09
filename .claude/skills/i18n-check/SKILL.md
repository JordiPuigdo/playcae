---
name: i18n-check
description: Verifica la consistencia de claves de traducción entre es.json y ca.json. Úsalo siempre que se añadan, modifiquen o eliminen textos visibles en la app.
allowed-tools: Read, Glob, Grep
---

Verifica la consistencia del sistema i18n de PlayCAE entre los dos idiomas soportados.

## Archivos a comparar

- `src/i18n/locales/es.json`
- `src/i18n/locales/ca.json`

## Qué revisar

1. **Claves faltantes**: claves presentes en `es.json` que no existen en `ca.json` o viceversa
2. **Claves vacías**: claves con valor `""` o `null` en cualquiera de los dos locales
3. **Claves huérfanas**: claves en los JSON que no aparecen en ningún archivo de `src/` (posibles residuos)
4. **Textos sin traducir**: literales de texto en castellano hardcodeados en componentes o páginas de `src/` que deberían ir por i18n
5. **Claves semánticamente inestables**: claves genéricas tipo `"text1"`, `"label"` sin contexto — alertar para renombrar

## Formato de respuesta

- Lista de claves faltantes por idioma
- Lista de claves vacías
- Lista de posibles textos hardcodeados detectados (con archivo y línea)
- Veredicto: CONSISTENTE / INCONSISTENTE (con detalle de qué corregir)

Si no hay inconsistencias: confirma "i18n consistente entre es y ca."
