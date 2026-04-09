@.codex/AGENTS.md

## Claude Code — contexto adicional

Stack: Next.js (App Router) + TypeScript strict + Tailwind + Radix UI + SWR + Zustand.
Entorno Windows. Scripts de hooks en PowerShell (.ps1).

### Reglas modulares (.claude/rules/)

Cargadas por sesión o por archivo abierto:
- `architecture.md` → route groups, server-first, capas del front
- `security.md` → secretos en env, BFF, no lógica sensible en cliente
- `coding-style.md` → naming TypeScript/React, patrones del repo
- `performance.md` → SSR/CSR, SWR, rerenders, waterfalls, i18n

### Subagentes (.claude/agents/)

- `performance-reviewer` → detecta rerenders, waterfalls y client-heavy pages (solo lectura)
- `refactor-guard` → planifica refactors seguros respetando dependencias de módulos (solo lectura)
- `scale-architect` → valida impacto de escala a 1/10/50/100 usuarios concurrentes (solo lectura)

### Skills disponibles

- `/build-check` → npm run lint + npm run build (verificación mínima pre-merge)
- `/review-component` → checklist DoD para componentes y páginas nuevas/modificadas
- `/i18n-check` → verifica consistencia de claves entre es.json y ca.json
- `/audit-secrets` → escanea secretos hardcodeados o lógica sensible expuesta al cliente

### Archivos críticos — confirmar con el usuario antes de modificar

- `next.config.ts`
- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/api/contact/route.ts`
- `src/services/http-client.ts`
- `src/hooks/useAuthStore.ts`
- `src/hooks/usePermissions.ts`
- `src/i18n/server.ts`
- `src/hooks/useLanguageStore.ts`
