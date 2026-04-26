# PlayCAE frontend - Codex instructions

This file is the Codex-visible entrypoint for the frontend repo. The detailed
source of truth lives in `.codex/`.

Before making non-trivial changes, read:

- `.codex/AGENTS.md`
- `.codex/ARCHITECTURE.md`
- `.codex/CODING_STYLE.md`
- `.codex/MODULES.md`
- `.codex/CHECKLISTS.md`
- `../SECURITY_STANDARDS.md`

## Stack

- Next.js App Router + TypeScript strict.
- React, Tailwind, Radix UI, SWR, Zustand.
- i18n via `src/i18n/locales/es.json` and `src/i18n/locales/ca.json`.

## Core rules

- Prefer Server Components. Use `"use client"` only for real browser interaction,
  SWR, Zustand, effects, or event handlers.
- Keep HTTP access in `src/services/*`; components should consume hooks/services,
  not call backend URLs directly.
- Keep sensitive operations behind `src/app/api/*` route handlers. Never expose
  secrets through `NEXT_PUBLIC_*`.
- All visible copy must be translated in both locale files.
- Avoid `any`; keep contracts in `src/types/*` and `src/interfaces/*`.
- Check scale impact before adding data fetching, SWR keys, Zustand state, polling,
  retries, or user-triggered network calls.

## Critical files

Call out risk before changing:

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

## Verification

- Minimum pre-merge checks: `npm run lint` and `npm run build`.
- For UI/text changes, use the `.codex/CHECKLISTS.md` component and i18n checks.
- For secret or auth-sensitive changes, use the audit checklist and shared security
  standards.
