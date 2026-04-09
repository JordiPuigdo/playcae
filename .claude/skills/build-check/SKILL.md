---
name: build-check
description: Ejecuta npm run lint y npm run build. Úsalo antes de cerrar cualquier cambio como verificación mínima pre-merge.
allowed-tools: Bash
---

Ejecuta en orden los comandos obligatorios pre-merge de PlayCAE frontend:

1. `npm run lint`
2. `npm run build`

Si algún comando falla:
- Muestra el error completo
- Identifica el archivo y línea afectada
- Distingue entre error de tipos TypeScript, error de lint o error de compilación Next.js
- Sugiere la causa más probable

Si ambos pasan: confirma "Lint y build OK — listo para validación manual del flujo afectado."

No modifiques código para hacer pasar el build o el lint sin confirmación del usuario.