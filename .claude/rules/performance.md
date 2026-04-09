# Performance — Reglas de rendimiento

## Baseline de concurrencia

Diseñar para un mínimo de 20 usuarios concurrentes.
Antes de cerrar cualquier cambio, evaluar qué ocurre con 100 usuarios simultáneos:
- ¿Hay riesgo de render loop o refresh loop?
- ¿Cuántas requests genera cada acción de usuario?
- ¿Hay paginación si la colección puede crecer?
- ¿Qué pasa si la latencia supera 2s?

## Server vs Client — decisión rápida

Usar Server Component cuando:
- La página es SEO/content (`(web)`)
- La data puede resolverse en servidor sin interacción
- No hay handlers de eventos de UI complejos

Usar Client Component cuando:
- Hay estado interactivo (formularios, filtros, modales)
- Se usa `useEffect`, SWR, Zustand, listeners de navegador

No meter `"use client"` en layouts o páginas completas sin justificación.

## SWR y data fetching

- Claves SWR estables y semánticas.
- Optimistic updates solo si hay rollback claro.
- Evitar waterfalls: no anidar `await` en serie cuando se puede paralelizar.
- Consolidar llamadas cuando sea posible.

## Renders

- `useMemo` y `useCallback` solo cuando el cálculo o callback tiene coste real.
- Evitar derive-state innecesario.
- Mantener render estable — no crear objetos/arrays nuevos en cada render sin memoización.

## Assets y red

- Usar `next/image` para imágenes — gestión automática de tamaño y formato.
- Cuidar peso de imágenes y recursos de la landing.
- Evitar importar librerías pesadas en páginas donde no se usan.

## i18n y SSR

- Las traducciones se cargan en servidor para páginas SSR — no duplicar fetch.
- Mantener cookie `playcae-language` sincronizada para SSR correcto.