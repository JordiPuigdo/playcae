---
name: review-component
description: Valida un componente o página nueva/modificada contra el Definition of Done del proyecto. Úsalo antes de cerrar cualquier cambio de UI, hooks o servicios.
allowed-tools: Read, Glob, Grep
---

Revisa el componente o página indicado por el usuario contra el DoD de PlayCAE frontend.

## Checklist obligatorio

1. [ ] **Server-first**: ¿podría ser Server Component? Si es Client Component, ¿hay justificación real?
2. [ ] **TypeScript estricto**: sin `any`, tipos explícitos en props y retornos
3. [ ] **Sin secretos en cliente**: no hay `process.env.X` no-pública, tokens ni credenciales en código cliente
4. [ ] **i18n completo**: todos los textos visibles salen de traducciones (`useTranslation` o `getTranslations`); si se añadió clave nueva, existe en `es.json` y `ca.json`
5. [ ] **Capa correcta**: lógica en hooks, acceso HTTP en services, UI en components
6. [ ] **Naming**: PascalCase para componentes, `useSomething` para hooks, `something.service.ts` para services
7. [ ] **Componentes UI reutilizados**: se usan primitivas de `src/components/ui/*` antes de crear nuevas
8. [ ] **Sin regresión SEO**: si afecta a `(web)`, el `metadata` export sigue presente y correcto
9. [ ] **Accesibilidad básica**: `aria-*`, labels en formularios, foco visible, contraste adecuado

## Formato de respuesta

Para cada punto del checklist:
- ✅ si cumple
- ❌ si falla — con archivo, línea y descripción del problema

Al finalizar: indica si el componente está listo para merge o qué debe corregirse primero.
