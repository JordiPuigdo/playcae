# PlayCAE - ARCHITECTURE

## Alcance
Este documento describe la arquitectura que existe hoy en este repo.
No define arquitectura objetivo futura.

## Flujo del sistema (estado real)

### Flujo principal
`Browser -> Next.js (App Router) -> UI (Server/Client Components) -> API externa PlayCAE`

### Flujo detalle por tipo de pantalla

1. Web publica (`src/app/(web)`)
- Browser solicita una ruta publica.
- Next.js resuelve layout/page del App Router.
- En varias paginas se renderiza en servidor con metadata SEO.
- En componentes interactivos se hidrata cliente (`"use client"`).
- Si hay llamadas de negocio, se hacen desde cliente usando `src/services/*` hacia `NEXT_PUBLIC_PLAYCAE_API`.

2. Dashboard autenticado (`src/app/(dashboard)`)
- La mayoria de pantallas son Client Components.
- Los hooks (`src/hooks/*`) usan SWR y servicios tipados.
- Los servicios consumen API externa de PlayCAE.
- Estado de sesion y contexto de usuario se guarda en Zustand persistido.

3. Kiosk (`src/app/(kiosk)/access-control`)
- Pantalla cliente para flujo de control de accesos.
- Mismo patron de hooks + services hacia API externa.

4. Contacto web (`src/app/(web)/components/ContactForm.tsx`)
- Browser envia `POST /api/contact` (route handler local de Next.js).
- `src/app/api/contact/route.ts` valida datos y envia email con Resend.
- Respuesta JSON al cliente y redireccion a gracias.

## Tech stack actual

- Framework: Next.js (App Router)
- Lenguaje: TypeScript (`strict: true`)
- UI: React 19 + Tailwind CSS + Radix UI + CVA
- Estado cliente: Zustand (`useAuthStore`, `useLanguageStore`)
- Data fetching cliente: SWR (hooks de dominio)
- i18n: sistema propio (`src/i18n`) con cookie `playcae-language`
- Email transaccional: Resend (via route handler local)
- SEO tecnico: metadata por pagina, `sitemap.ts`, `robots.ts`

## Como se comunica frontend con backend

## 1) Canal dominante: cliente -> API externa
- `src/services/*.service.ts` construye URLs con `process.env.NEXT_PUBLIC_PLAYCAE_API`.
- `HttpClient` centraliza `GET/POST/PUT/DELETE` y parseo de `ApiResponse`.
- Los hooks de dominio (`useCompanies`, `useWorkers`, etc.) consumen esos servicios.
- Resultado: el browser llama directamente al backend de negocio (no pasa por BFF local para la mayoria de endpoints).

## 2) Canal local Next.js: browser -> `/api/contact`
- Solo existe un route handler local hoy: `src/app/api/contact/route.ts`.
- Se usa para enviar emails (Resend) y ocultar ese paso del cliente.

## 3) Sesion/autenticacion en frontend
- Login via endpoint externo (`/api/auth/login`) usando `LoginService`.
- Estado guardado en Zustand persist (`auth-storage`).
- Expiracion gestionada en cliente con `useAuthSession`.
- `HttpClient` actual no inyecta header `Authorization` de forma global.

## Decisiones de diseno ya tomadas (y por que)

1. App Router con route groups (`(web)`, `(dashboard)`, `(kiosk)`).
- Motivo: separar claramente marketing, producto interno y kiosk.

2. Capa `services` + `hooks`.
- Motivo: separar acceso HTTP de logica de UI y facilitar mantenimiento.

3. Zustand para estado global minimo.
- Motivo: sesion e idioma necesitan persistencia entre paginas.

4. SWR para datos de dashboard.
- Motivo: cache/revalidacion sencilla en cliente para pantallas operativas.

5. SEO first en web publica.
- Motivo: captacion organica (metadata, OG, robots, sitemap, JSON-LD).

6. i18n mixto server/client.
- Motivo: permitir SSR de textos en paginas concretas (ej. precios) y cambio de idioma en cliente.

7. Seguridad base en Next config.
- Motivo: headers de seguridad y redireccion canonica de dominio.

## Lo que NO existe hoy (importante para no inventar)

1. No hay capa backend propia completa dentro de este repo.
- Solo hay un route handler local (`/api/contact`).

2. No hay ORM ni acceso a base de datos en este repo.
- No hay Prisma/Drizzle/TypeORM ni modelos de DB locales.

3. No hay middleware de Next para auth global.
- No existe `middleware.ts` para proteger rutas en servidor.

4. No hay Server Actions implementadas.
- El flujo mutacion actual va por cliente + servicios HTTP.

5. No hay suite de tests automatizados en el proyecto.
- No hay estructura de tests ni scripts de test en `package.json`.

6. No hay pipeline CI/CD definido en `.github/workflows`.

7. No hay capa de observabilidad central (tracing/metrics/logging estructurado).

8. No hay cache server avanzada (revalidateTag/unstable_cache) aplicada a dominio.

9. No hay BFF completo para todas las llamadas de negocio.
- La mayoria de endpoints se consumen directo desde browser a API externa.
