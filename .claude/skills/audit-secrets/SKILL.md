---
name: audit-secrets
description: Escanea el repositorio en busca de secretos hardcodeados o lógica sensible expuesta al cliente. Ejecutar antes de cualquier commit o push.
allowed-tools: Glob, Grep, Read
---

Escanea el repositorio de PlayCAE frontend en busca de secretos o información sensible expuesta.

## Patrones a detectar

1. **Secretos hardcodeados**: API keys, tokens, passwords asignados a literales de string en código fuente
2. **Variables privadas en cliente**: uso de `process.env.X` (sin `NEXT_PUBLIC_`) en archivos bajo `src/app/(web)`, `src/app/(dashboard)`, `src/app/(kiosk)` o `src/components/` — estas no funcionan en cliente y pueden indicar un intento de exponer datos de servidor
3. **Tokens en cliente**: referencias a `RESEND_API_KEY`, tokens de terceros u otras credenciales en código que se ejecuta en el browser
4. **Lógica BFF sin ruta API**: operaciones con secretos que se hacen directamente desde un componente cliente en lugar de pasar por `src/app/api/*`
5. **`.env*` en git**: verificar que `.env` y `.env.local` están en `.gitignore`

## Exclusiones

- `src/app/api/*` — aquí sí pueden aparecer `process.env` privadas (es servidor)
- Referencias en comentarios de documentación
- Archivos `*.example`, `*.sample`

## Formato de respuesta

Para cada hallazgo:
- **Severidad**: CRÍTICO (no debe llegar a git) / ADVERTENCIA (revisar contexto)
- Archivo y línea exacta
- Tipo de problema detectado

Si no se detecta nada: confirma "Sin secretos ni exposiciones detectadas en el escaneo."
