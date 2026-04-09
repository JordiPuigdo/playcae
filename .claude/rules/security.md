# Seguridad — Reglas obligatorias

## Secretos y variables de entorno

- Nunca hardcodear API keys, tokens ni credenciales en código fuente.
- Todo secreto de servidor va en variables de entorno (`process.env.X`) — nunca en `NEXT_PUBLIC_*`.
- `NEXT_PUBLIC_*` es visible en el bundle del cliente — solo para URLs o config no sensible.
- Ejemplo: `RESEND_API_KEY` solo en servidor, nunca expuesta al cliente.

## Lógica sensible en BFF

- Operaciones con secretos (email, tokens externos) van por `src/app/api/*` (route handlers).
- No hacer llamadas con credenciales directamente desde componentes cliente.
- Validar y sanitizar el payload en `route.ts` antes de procesar.

## Auth y autorización

- No confiar en datos del cliente para permisos o roles.
- En dashboard: validar acceso por rol y ownership en cada operación.
- Cualquier cambio en auth requiere confirmación explícita del usuario.
- Archivos críticos de auth — no modificar sin confirmación:
  - `src/hooks/useAuthStore.ts`
  - `src/hooks/usePermissions.ts`

## Input validation

- Validar payloads en route handlers con zod u otro schema validator.
- Responder con status HTTP coherentes (`400`, `401`, `403`, `422`, `500`).
- Sanitizar HTML o strings cuando se rendericen datos externos.

## Permisos denegados (Claude Code)

- Lectura de `.env*` bloqueada.
- Lectura de `**/secrets/**` bloqueada.
