# email-provider

Two email products in one repository, built as Next.js 16 frontends from Claude
Design mockups. The frontends are complete clickable implementations backed by
mock data; the backends are Go and live outside this repository. The handoff to
the backend team is `API_CONTRACTS.md`.

| Product       | Brand | What it is                                             | Frontend               | Status      |
| ------------- | ----- | ------------------------------------------------------ | ---------------------- | ----------- |
| `email-send`  | Plume | Transactional and bulk sending API (SendGrid, Mailgun) | `email-send/frontend`  | in progress |
| `email-inbox` | Pane  | Mailbox hosting, webmail, IMAP/SMTP (Gmail, Zoho)      | `email-inbox/frontend` | not started |

## Layout

```
email-send/
  backend/    Go — out of scope for this repository
  frontend/   Next.js 16.3.3 — Plume landing, console, docs
email-inbox/
  backend/    Go — out of scope for this repository
  frontend/   Next.js 16.3.3 — Pane landing, email list, reader, compose
docs/adr/     Architecture decision records
API_CONTRACTS.md   Consolidated backend handoff (generated from per-page contracts)
```

## Deployments

Both frontends are separate Vercel projects. See
[ADR-0004](docs/adr/0004-vercel-deployment-configuration.md) for the project
configuration.

| Product       | Production URL                                                           | Last deployed |
| ------------- | ------------------------------------------------------------------------ | ------------- |
| `email-send`  | [email-send-frontend.vercel.app](https://email-send-frontend.vercel.app) | 2026-08-29    |
| `email-inbox` | _pending_                                                                | _pending_     |

## Running locally

Each frontend is standalone — there is no root `package.json` and no workspace
([ADR-0001](docs/adr/0001-monorepo-two-standalone-next-apps.md)).

```bash
cd email-send/frontend && npm install && npm run dev
```

## API contracts

Every page that needs backend data has a `<page>.contract.md` beside its
`page.tsx` ([ADR-0003](docs/adr/0003-api-contract-format.md)). Those files are
the source of truth; `API_CONTRACTS.md` at the root is the merged handoff copy.

## Decisions

- [ADR-0001](docs/adr/0001-monorepo-two-standalone-next-apps.md) — monorepo of two standalone Next.js apps
- [ADR-0002](docs/adr/0002-inline-styles-ported-from-design-mockups.md) — inline styles ported from the mockups
- [ADR-0003](docs/adr/0003-api-contract-format.md) — API contract format
- [ADR-0004](docs/adr/0004-vercel-deployment-configuration.md) — Vercel deployment configuration
