# PlayCAE (dashboard) - DECISIONS

Registro de decisiones de diseño no evidentes a partir del código.

---

## Gestión de usuarios + páginas públicas de contraseña

**Contexto.** Nueva pantalla SuperAdmin para gestionar usuarios y flujo público de restablecimiento de contraseña.

- **Pantalla `/dashboard/users`.** `page.tsx` (server) + `UsersClient.tsx` (client). Reutiliza
  `UsersTable` (patrón de `CompanyTable`: `TableCard` + `useSortableTable` + `DeleteConfirmationModal`),
  `UserFormModal` (Dialog + Select de rol) y `use-Toast`. La tabla muestra Email, Rol (badge), Estado
  y Alta (`formatDate`, DD/MM/YYYY). Acciones: editar, reenviar contraseña, activar/inactivar, eliminar.
- **Gating.** El enlace del sidebar vive en el bloque `isSuperAdmin`; además `UsersClient` corta si
  `role !== SuperAdmin`. El backend es la barrera real (403).
- **Borrado.** Confirmación simple (decisión del usuario) con aviso fuerte de que borra TODO en cascada.
- **Servicio.** `user.services.ts` añade `update` (PUT `/{id}/profile`), `setActive` (PATCH `/{id}/active`),
  `remove` (DELETE) y `sendPasswordReset` (POST `/{id}/send-password-reset`). `useUsers` pasa de solo
  `createUser` a cargar la lista + acciones con recarga.
- **Páginas públicas** en `(web)`: `reset-password` (lee `token` de la query, requiere `Suspense` por
  `useSearchParams`) y `forgot-password` (arregla el enlace muerto del login). Usan `PasswordService`
  con `HttpClient("", true)` (skipRefresh, endpoints públicos). Respuesta uniforme en forgot para no
  revelar si el email existe.
- **i18n.** Solo se añadió la clave compartida `dashboard.sidebar.users` (es/ca). El texto de la UI de
  gestión va en español embebido, siguiendo el precedente de la página de login (permitido: código en
  inglés, texto visible en español).
