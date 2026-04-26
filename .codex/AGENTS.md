# PlayCAE - AGENTS.md

Guia de trabajo para contribuir en este repo con foco en:
- escalabilidad
- performance
- clean code
- server-side por defecto
- velocidad de entrega (vibe coding con guardrails)

Leer tambien antes de cambios no triviales:
- `../AGENTS.md` (entrada visible para Codex)
- `ARCHITECTURE.md`
- `CODING_STYLE.md`
- `MODULES.md`
- `CHECKLISTS.md`
- `../../SECURITY_STANDARDS.md` (RGPD/PRL/ISO/OWASP)

## 1) Contexto de la app

Stack principal:
- Next.js (App Router)
- TypeScript estricto (`strict: true`)
- Tailwind CSS + componentes UI internos
- SWR para data fetching en cliente
- Zustand para estado de sesion y preferencias
- i18n propio (`es`, `ca`) con cookie para SSR

Estructura actual relevante:
- `src/app/(web)` -> marketing/SEO
- `src/app/(dashboard)` -> app autenticada
- `src/app/(kiosk)` -> control de accesos
- `src/app/api/*` -> route handlers (BFF / backend-for-frontend)
- `src/services/*` -> clientes API tipados
- `src/hooks/*` -> hooks de dominio + SWR + Zustand
- `src/components/*` -> componentes reutilizables

## 2) Principios no negociables

1. Server-first.
   - Si una pagina no necesita interaccion en cliente, debe ser Server Component.
   - Evitar `"use client"` en `page.tsx` salvo necesidad real.

2. Seguridad antes que comodidad.
   - Nunca hardcodear secretos.
   - Todo secreto va en variables de entorno del servidor.
   - Cualquier logica sensible va por `src/app/api/*` (BFF), no directo desde cliente.

3. Tipado fuerte end-to-end.
   - Sin `any`.
   - Modelos en `src/types` y contratos en `src/interfaces`.
   - Validar entrada/salida en bordes (API/forms) con schemas (preferente: zod).

4. Performance por defecto.
   - Reducir JS en cliente.
   - Cargar solo lo necesario.
   - Mantener render estable y evitar rerenders evitables.

5. Clean code pragmatico.
   - Funciones cortas, nombres claros, una responsabilidad por modulo.
   - Comentarios solo cuando aportan contexto no obvio.

## 3) Estrategia SSR/CSR (decision rapida)

Usar Server Component cuando:
- la pagina es SEO/content (`(web)`)
- la data puede resolverse en servidor
- no hay handlers de eventos de UI complejos

Usar Client Component cuando:
- hay estado interactivo local (formularios, filtros, modales)
- se usa `useEffect`, SWR, Zustand, listeners de navegador

Patron recomendado:
- `page.tsx` server
- subcomponente cliente aislado para interaccion (`Client*.tsx`)

## 4) Convenciones de data layer

1. Acceso a backend:
- Centralizar llamadas en `src/services/*`.
- Reutilizar `HttpClient`.
- Mantener firmas tipadas (`ApiResponse<T>`, `ApiError`).

2. Dashboard y datos vivos:
- SWR en hooks de dominio (`useCompanies`, `useWorkers`, etc).
- Claves SWR estables y semanticas.
- Optimistic updates solo si hay rollback claro.

3. BFF en `app/api` para:
- secretos (emails, tokens, credenciales)
- normalizacion de payloads
- proteccion anti-abuso (rate limit/captcha/honeypot si aplica)

## 5) Estado global

Zustand permitido solo para estado cross-cutting:
- sesion/auth (`useAuthStore`)
- idioma/preferencias (`useLanguageStore`)

No usar store global para estado que puede vivir:
- en componente local
- en URL (`searchParams`) cuando son filtros

## 6) i18n

Fuentes:
- `src/i18n/locales/es.json`
- `src/i18n/locales/ca.json`

Reglas:
- Cualquier texto visible debe salir de traducciones.
- Las claves deben ser estables y semanticas.
- Si se agrega key en `es`, agregar su equivalente en `ca`.
- Mantener sincronizada cookie `playcae-language` para SSR.

## 7) UI y estilos

Reglas de UI:
- Reusar componentes de `src/components/ui/*` antes de crear nuevos.
- Priorizar tokens de marca definidos en `tailwind.config.ts`.
- Evitar estilos inline salvo casos muy puntuales.
- Mantener accesibilidad basica: `aria-*`, labels, foco visible, contraste.

## 8) Reglas de seguridad obligatorias

1. Secrets:
- Nunca subir API keys al repo.
- Ejemplo: Resend debe usar `process.env.RESEND_API_KEY` en servidor.

2. Inputs:
- Validar siempre payloads en `route.ts`.
- Sanitizar HTML/string cuando sea necesario.

3. Auth/autorizacion:
- No confiar en datos del cliente para permisos.
- En dashboard, validar acceso por rol y ownership.

## 9) Reglas de performance obligatorias

1. Evitar client-heavy pages:
- No meter `"use client"` en layouts/paginas completas sin justificar.

2. Render:
- Memoizar calculos costosos (`useMemo`) y callbacks solo cuando aporte.
- Evitar derive-state innecesario.

3. Assets:
- Usar `next/image` cuando aplique.
- Cuidar peso de imagenes y recursos de landing.

4. Network:
- Evitar waterfalls.
- Consolidar llamadas cuando sea posible.

## 10) Estructura y naming

Nombres:
- Componentes: `PascalCase.tsx`
- Hooks: `useSomething.ts`
- Servicios: `something.service.ts`
- Tipos: `src/types/*`

Rutas:
- Mantener segmentacion por dominio: `(web)`, `(dashboard)`, `(kiosk)`.
- No mezclar logica de marketing con logica de producto.

## 11) Calidad minima antes de merge

Comandos obligatorios:
- `npm run lint`
- `npm run build`

Checklists Codex:
- Usar `CHECKLISTS.md` para `build-check`, `review-component`,
  `i18n-check` y `audit-secrets`.

Checklist:
1. Sin errores de lint/types/build.
2. Sin secretos en codigo.
3. Sin regresiones de SEO en paginas web (metadata/canonical/robots).
4. Sin romper i18n (keys faltantes).
5. Sin mover logica sensible al cliente.

## 12) Definition of Done para cambios

Un cambio esta terminado cuando:
1. Resuelve el problema de negocio.
2. Respeta server-first y seguridad.
3. Mantiene o mejora performance.
4. Queda tipado, legible y mantenible.
5. Incluye validacion minima manual del flujo afectado.

## 13) Vibe coding con control

Se permite iterar rapido, pero siempre con estas barandillas:
1. Primero funcionalidad correcta.
2. Luego refactor pequeno para claridad.
3. Cierre con lint + build.

Mover rapido si, deuda gratuita no.

## 14) Scale Gate obligatorio (nueva regla)

Antes de escribir codigo, el agente debe dejar por escrito:
1. Impacto esperado para 1/10/50/100 usuarios concurrentes.
2. Riesgo de bucles de render/refetch (`useEffect`, SWR, Zustand).
3. Numero de llamadas de red por accion de usuario (objetivo O(1)).
4. Estrategia de degradacion si la API tarda mas de 2s.
5. Plan minimo de verificacion de concurrencia.

Si no puede responder esos 5 puntos, debe pedir contexto antes de implementar.
Usar plantilla: `.codex/SCALE_REVIEW_TEMPLATE.md`.
