# Coding Style — Patrones TypeScript/React del repo

## Naming y organización

- Componentes React: `PascalCase.tsx` (ej: `CompanyTable.tsx`, `AccessHistoryKPIs.tsx`)
- Hooks: `useSomething.ts` con prefijo `use` (ej: `useCompanies.ts`, `useTranslation.ts`)
- Servicios: `something.service.ts` con clase por dominio (ej: `CompanyService`, `DocumentService`)
- Tipos e interfaces: `src/types/*` y `src/interfaces/*` en `PascalCase`
- Utilidades: `src/app/utils/*` en `kebab-case` (ej: `tax-id-validation.ts`, `document-type-utils.ts`)
- Importaciones por alias `@/*` de forma predominante

## TypeScript estricto

- `strict: true` — sin `any`.
- Modelos en `src/types/*`, contratos en `src/interfaces/*`.
- Validar entrada/salida en bordes (API / formularios) con zod.
- Servicios tipados que devuelven `ApiResponse<T>`.

## Estructura de hooks de dominio

Los hooks retornan un objeto con:
- Estado: `loading`, `isLoading`, `error`, `data`
- Acciones: `create`, `update`, `refresh`, etc.

## Manejo de errores y feedback

- `HttpClient` centraliza `fetch` y normaliza errores con forma `{ status, message, data }`.
- En hooks: `try/catch` + estado local (`setError`).
- Feedback de UI con toast (`use-Toast`) en flujos de mutación.
- En `route.ts`: `NextResponse.json(..., { status })` con validaciones manuales.

## Lo que NO se usa en este repo

- No `axios` — acceso HTTP solo con `fetch` a través de `HttpClient`.
- No `react-router-dom` en `src/` — navegación con `next/navigation`.
- No Redux ni React Query — Zustand para estado global, SWR en hooks de dominio.
- No class components — solo componentes funcionales.
- No Server Actions (`"use server"` no está en `src/`).

## Inconsistencias conocidas (no replicar)

- `src/hooks/use-Toast.ts` usa guion en el nombre (excepción al patrón `useX.ts`)
- `src/services/user.services.ts` plural (excepción al patrón `*.service.ts`)
- `src/app/utils/utis.ts` parece typo — no copiar el nombre
