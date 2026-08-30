# email-send/frontend

Plume's marketing site, docs, and console — a proof of concept. The console
shows demo-project sample data (D13); there is no live backend, billing, or
account behind it.

## Commands

- `npm run dev` — start the dev server at http://localhost:3000
- `npm test` — run the Vitest suite (`tests/**/*.test.ts`)
- `npm run e2e` — run the Playwright suite against a dev server
- `npm run lint` — run ESLint
- `npm run build` — production build

## Structure

- `lib/enums.ts`, `lib/limits.ts` — the decided constants, single source
- `lib/data/` — raw fixtures, no colour, no formatted strings
- `lib/api/` — the async seam every page reads through
- `lib/format.ts`, `lib/theme.ts` — presentation, applied at the render site
