# PlayCAE - MODULES

## Inventario de módulos existentes

| Módulo | Qué expone | Qué consume (colecciones / otros módulos) |
|---|---|---|
| `app-shell` (`src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`) | Layout raíz, metadata global, GA script, `robots()`, `sitemap()` | `styles/global.css`, `components/ui/Toaster`, `next/script`, configuración SEO global |
| `app-web` (`src/app/(web)/*`) | Rutas públicas: landing, servicios, precios, contacto, legal, blog, login, register, onboarding | `components` de landing y formularios, `hooks` (`useTranslation`, `useAuthStore`, `useLead`, `useCompanies`, `useWorkers`), `i18n/server` (en `precios`), endpoint local `/api/contact` |
| `app-dashboard` (`src/app/(dashboard)/dashboard/*`) | Rutas internas: dashboard, companies, company detail, documents, audit, system-audit, access-history, subcontractors, configuration, settings | `components` de dominio, `components/ui`, `hooks` (`useCompanies`, `useWorkers`, `useDocuments`, `useAccessHistory`, `useAudit`, `useUserConfiguration`, `useAuthStore`) |
| `app-kiosk` (`src/app/(kiosk)/access-control`) | Flujo de control de accesos (validación/check-in/check-out) | `AccessService`, `useAuthStore`, `useTranslation`, `components/ui` |
| `api-local` (`src/app/api/contact/route.ts`) | Endpoint `POST /api/contact` | `resend`, request JSON (`name`, `email`, `message`), consumidor principal: `app-web/components/ContactForm.tsx` |
| `services-core` (`src/services/http-client.ts`) | `HttpClient` (`get/post/upload/put/delete`) + manejo uniforme de `ApiResponse`/errores | API externa vía `fetch`, `interfaces/api-response` |
| `services-domain` (`src/services/*.service.ts`) | Clientes de backend: `LoginService`, `CompanyService`, `WorkerService`, `DocumentService`, `AccessService`, `AdminAuditService`, `UserService`, `UserConfigurationService`, `LeadService` | `HttpClient`, tipos (`src/types/*`), colecciones backend: `/api/auth/login`, `/api/companies`, `/api/workers`, `/api/documents`, `/api/access`, `/api/admin/*`, `/api/Users`, `/api/userconfiguration`, `/api/leads` |
| `hooks-state` (`useAuthStore`, `useLanguageStore`, `useAuthSession`, `usePermissions`) | Estado de sesión/idioma, expiración de sesión, control de acceso por rol | `zustand`, `zustand/persist`, `LoginService`, `types/user`, `i18n/types` |
| `hooks-domain` (`useCompanies`, `useWorkers`, `useDocuments`, `useAccessHistory`, `useAudit`, `useUserConfiguration`, `useLead`, `useUsers`, `useDocumentValidation`, `use-Toast`, `useTranslation`) | Lógica de negocio de UI y fetch/cache para pantallas | `services-domain`, `services-core`, `types`, `interfaces`, `i18n`, `date-fns/dayjs`, `components/ui/Toast` |
| `components-ui` (`src/components/ui/*`) | Primitivas UI (`Button`, `Card`, `Dialog`, `Table`, `Tabs`, `Toast`, `SideBar`, `Header`, etc.) | Radix UI, `app/utils/utis` (`cn`), `hooks` en `Header`/`SideBar` |
| `components-domain` (`src/components/*` excepto `ui`) | Componentes funcionales de empresas, trabajadores, documentos, historial de accesos, formularios y branding | `hooks-domain`, `hooks-state`, `types`, `app/utils/*`, `components-ui` |
| `i18n` (`src/i18n/*`) | `getTranslations`, `getServerTranslations`, `useTranslation` support (`types`, locales `es/ca`) | `cookies` (`next/headers`) en server, `hooks/useLanguageStore` en cliente, `locales/*.json` |
| `contracts` (`src/types/*`, `src/interfaces/*`) | Modelos de dominio y contrato de respuesta/errores (`ApiResponse`, `ApiError`) | Consumido por `services`, `hooks`, `components`, `app` |
| `utils` (`src/app/utils/*`) | Utilidades transversales: `cn`, fechas, enums, validación fiscal, tipo de documento | `types` (`company`, `worker`, `document`), consumido por `components` y `components-ui` |
| `styles` (`src/styles/global.css`) | Tokens CSS, estilos base globales y animaciones | Importado por `app-shell` |

## Notas de consumo por colecciones backend (reales)

- `auth`: `LoginService` -> `POST /api/auth/login`
- `companies`: `CompanyService` -> `/api/companies/*` (status, activate/deactivate relation, subcontractors, parent-companies, resend welcome email, type, internal-prevention)
- `workers`: `WorkerService` -> `/api/workers/*` (incluye `bulk/:companyId`)
- `documents`: `DocumentService` -> `/api/documents/*` (upload, manual-validation, history, open)
- `access`: `AccessService` -> `/api/access/*` (validate, checkin, checkout, filtros, history)
- `admin-audit`: `AdminAuditService` -> `/api/admin/audit-logs`, `/api/admin/document-notifications/by-affected-user/:id`, `/api/admin/email-registry`
- `users`: `UserService` -> `POST /api/Users`
- `userconfiguration`: `UserConfigurationService` -> `/api/userconfiguration/*` (logo upload/update/delete/get)
- `leads`: `LeadService` -> `POST /api/leads`
- `contact-local`: route local `POST /api/contact`

## Archivos críticos (no modificar sin revisión manual)

- `next.config.ts`
- `src/app/layout.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/api/contact/route.ts`
- `src/services/http-client.ts`
- `src/hooks/useAuthStore.ts`
- `src/hooks/usePermissions.ts`
- `src/i18n/server.ts`
- `src/hooks/useLanguageStore.ts`
- `src/types/user.ts`
- `src/interfaces/api-response.ts`

## Dependencias entre módulos (dirección de consumo)

1. `app-web` -> `components-domain` -> (`hooks-domain` + `hooks-state`) -> `services-domain` -> `services-core` -> API externa
2. `app-dashboard` -> `components-domain` -> (`hooks-domain` + `hooks-state`) -> `services-domain` -> `services-core` -> API externa
3. `app-kiosk` -> (`hooks-state` + `services-domain` + `components-ui`) -> API externa
4. `api-local` (`/api/contact`) -> `resend` (sin pasar por `services-domain`)
5. `components-ui` -> `utils` y, en casos puntuales (`Header`, `SideBar`), `hooks-state`
6. `hooks-domain` -> `types/interfaces` + `services-domain` (+ `services-core` en algunos hooks)
7. `i18n` es transversal: lo consumen `app-web`, `hooks`, `components`
8. `contracts` (`types/interfaces`) y `utils` son base transversal para `services`, `hooks`, `components` y `app`

## Dependencias especiales detectadas

- Acoplamiento inverso existente: `src/services/user.services.ts` importa tipos desde `src/hooks/useUsers.ts` (`CreateUserRequest`, `CreateUserResponse`).
- Esto rompe la dirección habitual `hooks -> services`; mantenerlo en cuenta antes de refactors.
