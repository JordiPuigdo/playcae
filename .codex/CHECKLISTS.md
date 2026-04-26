# PlayCAE frontend - Codex checklists

Codex equivalent of the Claude skills in this repo. Use these when the matching
work type appears.

## build-check

Run from `playcae/`:

1. `npm run lint`
2. `npm run build`

If a command fails, report the failing command, file/line when available, and
whether it is lint, TypeScript, or Next.js compilation.

Do not change code only to silence lint/build without understanding the issue.

## review-component

Use before closing UI, hook, service, or page changes.

- Server-first: page/layout remains server unless client behavior is required.
- TypeScript strict: no `any`, props and returns are typed.
- No client secrets: no private `process.env.*`, tokens, or credentials in client code.
- i18n complete: visible copy comes from translations and exists in `es.json` and `ca.json`.
- Correct layer: UI in components, screen logic in hooks, HTTP in services.
- Naming: components `PascalCase`, hooks `useSomething`, services `something.service.ts`.
- Reuse existing `src/components/ui/*` primitives first.
- SEO preserved for `(web)` pages: metadata/canonical/robots behavior is not regressed.
- Basic accessibility: labels, aria where needed, focus visibility, contrast.

Report each failed item with file and line.

## i18n-check

Compare:

- `src/i18n/locales/es.json`
- `src/i18n/locales/ca.json`

Check:

- Keys present in one locale and missing in the other.
- Empty or null values.
- Potential orphan keys not used under `src/`.
- Hardcoded visible Spanish/Catalan text in components/pages.
- Generic unstable keys such as `text1` or `label` without context.

Verdict: `CONSISTENT` or `INCONSISTENT`.

## audit-secrets

Scan before commit/push or any sensitive change.

Look for:

- API keys, tokens, passwords, connection strings, or long secret-like literals.
- Private `process.env.X` in browser-executed folders instead of server route handlers.
- Provider tokens such as Resend or other third-party credentials in client code.
- Secret-backed flows implemented directly in client components instead of `src/app/api/*`.
- `.env*` files accidentally tracked or exposed.

Exclude:

- `src/app/api/*` private env references when server-only.
- Documentation comments and obvious `*.example`, `*.sample`, `*.template` placeholders.

Report severity as `CRITICAL` or `WARNING`.
