# email-provider

Two email products in one repository, built as Next.js 16 frontends from Claude
Design mockups. The frontends are complete clickable implementations backed by
mock data; the backends are Go and live outside this repository. The handoff to
the backend team is [`API_CONTRACTS.md`](API_CONTRACTS.md).

| Product       | Brand | What it is                                             | Frontend               |
| ------------- | ----- | ------------------------------------------------------ | ---------------------- |
| `email-send`  | Plume | Transactional and bulk sending API (SendGrid, Mailgun) | `email-send/frontend`  |
| `email-inbox` | Pane  | Mailbox hosting, webmail, IMAP/SMTP (Gmail, Zoho)      | `email-inbox/frontend` |

## Deployments

Both frontends are separate Vercel projects
([ADR-0004](docs/adr/0004-vercel-deployment-configuration.md)).

| Product       | Production URL                                                                   | Last deployed |
| ------------- | -------------------------------------------------------------------------------- | ------------- |
| `email-send`  | [email-send-frontend-two.vercel.app](https://email-send-frontend-two.vercel.app) | 2026-08-30    |
| `email-inbox` | [email-inbox-frontend.vercel.app](https://email-inbox-frontend.vercel.app)       | 2026-08-30    |

## Layout

```
email-send/
  backend/    Go — out of scope for this repository
  frontend/   Next.js 16.3.3 — Plume landing, console, docs
email-inbox/
  backend/    Go — out of scope for this repository
  frontend/   Next.js 16.3.3 — Pane marketing site and mail app
docs/adr/     Architecture decision records
scripts/      build-contracts.py — regenerates API_CONTRACTS.md
```

## Routes

**Plume** (`email-send/frontend`) — 10 routes

- `/` landing
- `/docs` API documentation
- `/console` overview, plus `/console/{activity,templates,domains,keys,suppressions,audit}`

**Pane** (`email-inbox/frontend`) — 20 routes

- `/` landing, plus `/{product,security,pricing,changelog,privacy,terms,status,support,careers}`
- `/signin`, `/signup`
- `/mail` inbox, plus `/mail/{read,split,compose,popup,settings,profile}`

Every screen the mockups switched between in component state is a real route
([ADR-0005](docs/adr/0005-mail-app-screens-as-routes.md)).

## Running locally

Each frontend is standalone — there is no root `package.json` and no workspace
([ADR-0001](docs/adr/0001-monorepo-two-standalone-next-apps.md)).

```bash
cd email-send/frontend && npm install && npm run dev
```

```bash
cd email-inbox/frontend && npm install && npm run dev
```

`npm run build` and `npm run lint` work the same way in each.

## API contracts

Every page that needs backend data has a `<page>.contract.md` beside its
`page.tsx` ([ADR-0003](docs/adr/0003-api-contract-format.md)). Those files are
the source of truth; [`API_CONTRACTS.md`](API_CONTRACTS.md) is the merged handoff
copy, regenerated with:

```bash
python3 scripts/build-contracts.py
```

Nothing in the contracts is implemented — they describe what the frontends
expect, for the Go team to accept or push back on.

## Performance

Targets and the measured before/after are in
[`docs/performance.md`](docs/performance.md).

## Decisions

- [ADR-0001](docs/adr/0001-monorepo-two-standalone-next-apps.md) — monorepo of two standalone Next.js apps
- [ADR-0002](docs/adr/0002-inline-styles-ported-from-design-mockups.md) — inline styles ported from the mockups
- [ADR-0003](docs/adr/0003-api-contract-format.md) — API contract format
- [ADR-0004](docs/adr/0004-vercel-deployment-configuration.md) — Vercel deployment configuration
- [ADR-0005](docs/adr/0005-mail-app-screens-as-routes.md) — mockup screens become real routes
