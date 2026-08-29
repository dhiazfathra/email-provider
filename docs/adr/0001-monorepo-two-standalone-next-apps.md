# ADR-0001: Monorepo of two standalone Next.js apps, no workspace linking

- Status: Accepted
- Date: 2026-08-29

## Context

Two products ship from one repository: `email-send` (Plume, transactional/bulk
sending API console + marketing site) and `email-inbox` (Pane, mailbox hosting
webmail + marketing site). Each has a `frontend/` (in scope) and a `backend/`
(Go, out of scope). Both frontends must deploy independently to Vercel.

A shared workspace (npm/pnpm workspaces, Turborepo) would let the two apps share
components. But they share almost nothing: different brands, different palettes,
different layouts. Workspace linking also forces Vercel into monorepo install
mode, where the root `package.json` and lockfile drive installs for both
projects — a build break in one app can block the other.

## Decision

Each frontend is a fully standalone Next.js 16.3.3 app with its own
`package.json`, lockfile and `node_modules`. There is no root `package.json`, no
workspace protocol, no shared package. The repository root holds only git,
`docs/` and `API_CONTRACTS.md`.

Duplication between the two apps (e.g. a `useViewport` hook) is accepted: two
copies of ~15 lines is cheaper than a shared package plus its build wiring.

## Consequences

- Vercel projects each set Root Directory to `<product>/frontend` and use the
  default Next.js build; no `ignoreCommand`, no workspace install flags.
- The two apps can be on different dependency versions without coordination.
- If genuine sharing appears later (three-plus duplicated components with real
  logic), revisit and introduce a workspace then — not before.
