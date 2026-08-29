# ADR-0004: One Vercel project per frontend, deployed from its own directory

- Status: Accepted
- Date: 2026-08-29

## Context

Two frontends live in one repository and must deploy independently
([ADR-0001](0001-monorepo-two-standalone-next-apps.md)). Vercel offers two ways
to handle this: one project with a monorepo build that emits both apps, or one
project per app with a Root Directory pointing into the tree.

A single project cannot give the two products separate domains, separate
environment variables or separate rollback histories, and a failing build in one
product would block deploying the other.

## Decision

Two Vercel projects under the `envision-labs-projects-71c0945a` scope:

| Project                | Root Directory         | Framework | Build        |
| ---------------------- | ---------------------- | --------- | ------------ |
| `email-send-frontend`  | `email-send/frontend`  | Next.js   | `next build` |
| `email-inbox-frontend` | `email-inbox/frontend` | Next.js   | `next build` |

Each project is linked with `vercel link --project <name>` run from inside that
frontend directory, which writes a local `.vercel/` (git-ignored) and makes the
directory the deployment root. Build command, output directory and install
command are all Vercel's Next.js defaults — nothing is overridden.

No environment variables are set. The frontends are mock-data only
([ADR-0003](0003-api-contract-format.md)); when the Go backends exist, each
project gets its own `NEXT_PUBLIC_API_BASE_URL` rather than a shared one.

`vercel link` also writes a `.env.local` (OIDC token) and a frontend-level
`.gitignore` covering `.vercel` and `.env*`. Both are kept — the local ignore
files are what stop credentials reaching git.

## Consequences

- Each product has its own production URL, own rollbacks, own build failures.
- Deploys are made from the CLI (`vercel deploy --prod`) inside the frontend
  directory. Connecting the Git integration later needs the same Root Directory
  value set in each project's settings; the CLI link does not set it for
  Git-triggered builds.
- Adding a third product means a third project, not a change to a shared build.
