# PlayCAE - CODING STYLE (estado actual del repo)

Este documento describe patrones que ya existen en el código.
No es una guía aspiracional; es un mapa real del estilo actual.

## 1) Patrones que se usan consistentemente

## Naming y organización

- Componentes React en `PascalCase` y archivo `PascalCase.tsx` (ej: `CompanyTable.tsx`, `AccessHistoryKPIs.tsx`).
- Hooks en `camelCase` con prefijo `use` (ej: `useCompanies.ts`, `useAccessHistory.ts`, `useTranslation.ts`).
- Servicios con sufijo `.service.ts` y clases por dominio (ej: `CompanyService`, `DocumentService`, `AccessService`).
- Tipos e interfaces en `src/types/*` y `src/interfaces/*` con `PascalCase` para interfaces/enums.
- Utilidades en `src/app/utils/*`, con naming mayormente `kebab-case` (ej: `tax-id-validation.ts`, `document-type-utils.ts`).

## Estructura por capas

- Separación clara por capas:
  - UI/routing: `src/app/*`, `src/components/*`
  - Estado y lógica de pantalla: `src/hooks/*`
  - Acceso HTTP: `src/services/*`
  - Contratos/tipos: `src/types/*`, `src/interfaces/*`
  - Utilidades compartidas: `src/app/utils/*`
- En App Router se usa segmentación por route groups:
  - `src/app/(web)`
  - `src/app/(dashboard)`
  - `src/app/(kiosk)`
  - `src/app/api`

## Estilo de implementación

- Importación por alias `@/*` de forma predominante.
- Hooks de dominio que retornan objeto con:
  - estado (`loading`, `isLoading`, `error`, `data`)
  - acciones (`create`, `update`, `refresh`, etc.)
- Servicios tipados que devuelven `ApiResponse<T>`.
- Uso de `useMemo`, `useCallback` y `useEffect` en hooks/componentes con estado derivado y fetch.
- Uso de Tailwind + componentes UI base en `src/components/ui/*`.
- SEO en rutas web con `export const metadata` y JSON-LD en varias páginas.

## Patrones de errores y estados

- `HttpClient` centraliza `fetch` y normaliza errores con forma `{ status, message, data }`.
- En hooks se maneja error con `try/catch` + estado local (`setError`) y en algunos casos se relanza (`throw`).
- Feedback de UI con toast (`use-Toast`) en flujos de mutación.
- En `route.ts` se responde con `NextResponse.json(..., { status })` y validaciones manuales.

## 2) Patrones que se evitan (observado en el repo)

- No se usa `axios`; el acceso HTTP es con `fetch` (a través de `HttpClient`).
- No se usa `react-router-dom` en el código de `src` (navegación con `next/navigation`).
- No se usa Redux ni React Query; estado global con Zustand y fetch en hooks/SWR.
- No hay class components de React; se usan componentes funcionales.
- No hay carpeta backend propia con controladores/repositorios en este repo; backend de negocio es externo.

## 3) Estructura de carpetas en frontend y backend

## Frontend (este repo)

```text
src/
  app/
    (web)/                 # marketing/public pages
    (dashboard)/dashboard/ # app autenticada
    (kiosk)/               # flujo kiosk
    api/contact/route.ts   # endpoint local puntual
    utils/                 # utilidades compartidas de frontend
    layout.tsx             # shell global
    robots.ts / sitemap.ts # SEO técnico
  components/
    ui/                    # design primitives (Button, Card, Dialog, etc.)
    *.tsx                  # componentes de dominio
  hooks/                   # estado + lógica de pantallas
  services/                # clientes API (backend externo)
  types/                   # modelos de dominio
  interfaces/              # contratos comunes (ApiResponse/ApiError)
  i18n/                    # locales + helpers server/client
  styles/global.css        # estilos globales
```

## Backend (dentro de este repo)

```text
src/app/api/
  contact/route.ts
```

Solo existe este endpoint local.
El resto de la lógica de negocio y datos está en una API externa consumida por `src/services/*`.

## 4) Lo que NO hacemos (aunque otros proyectos sí lo hagan)

- No usamos Server Actions (`"use server"` no está en `src`).
- No usamos `middleware.ts` para auth/routing global del lado servidor.
- No tenemos ORM ni capa DB en este repo (sin Prisma/Drizzle/TypeORM locales).
- No tenemos suite de tests automatizados configurada (sin estructura de tests ni script `test`).
- No hay workflows de CI/CD en `.github/workflows`.
- No hay BFF completo: casi todo el tráfico de negocio sale del browser a `NEXT_PUBLIC_PLAYCAE_API`.

## 5) Desviaciones/inconsistencias actuales (para tenerlas en cuenta)

- `src/hooks/use-Toast.ts` usa guion en el nombre (excepción al patrón `useX.ts`).
- `src/services/user.services.ts` rompe el patrón de nombre singular `*.service.ts`.
- `src/app/utils/utis.ts` parece typo nominal respecto a `utils`.
- Acoplamiento inverso puntual: `src/services/user.services.ts` importa tipos desde `src/hooks/useUsers.ts`.
