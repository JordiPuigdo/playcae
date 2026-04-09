# Arquitectura — Reglas del App Router

## Route groups y separación de dominio

```
src/app/(web)/         → marketing/SEO — páginas públicas
src/app/(dashboard)/   → app autenticada — operativa
src/app/(kiosk)/       → flujo de control de accesos
src/app/api/           → route handlers locales (BFF puntual)
```

No mezclar lógica de marketing con lógica de producto.
No mezclar rutas públicas con rutas autenticadas en el mismo route group.

## Server-first

- Si una página no necesita interacción en cliente → Server Component.
- Evitar `"use client"` en `page.tsx` y `layout.tsx` salvo necesidad real.
- Patrón recomendado: `page.tsx` como Server Component + subcomponente cliente aislado (`Client*.tsx`) para la parte interactiva.

## Capas y dirección de consumo

```
app/* → components → hooks → services → API externa (NEXT_PUBLIC_PLAYCAE_API)
                           → types / interfaces
i18n (transversal)
utils (transversal)
```

- `services/*` centraliza el acceso HTTP — no hacer fetch directo en componentes.
- `hooks/*` orquesta estado y lógica de pantalla — consumen services, no al revés.
- `types/*` e `interfaces/*` son base transversal — no importar desde hooks ni services.

## Acoplamiento inverso conocido (no replicar)

- `src/services/user.services.ts` importa tipos desde `src/hooks/useUsers.ts` — excepción existente, no extender este patrón.

## BFF local (src/app/api/)

Solo para operaciones que requieren secretos de servidor (ej: email con Resend).
El resto del tráfico de negocio sale del browser directamente a la API externa.

## Archivos de composición — no modificar sin revisión manual

- `next.config.ts`
- `src/app/layout.tsx`
- `src/services/http-client.ts`
- `src/interfaces/api-response.ts`
