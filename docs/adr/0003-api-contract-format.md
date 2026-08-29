# ADR-0003: API contracts as co-located `<page>.contract.md`

- Status: Accepted
- Date: 2026-08-29

## Context

The frontends ship against mocked data. The Go backend is written separately
against whatever this repository documents, so the contract is the actual
handoff artifact — it has to be readable by someone who never opens the React
code.

Two candidates: inline comments next to the mock data, or a co-located Markdown
file per page.

Inline comments stay close to the code but are invisible to a backend engineer
browsing the repo, and they cannot hold request/response examples without
becoming unreadable.

## Decision

Every page that needs backend data gets a co-located `<page>.contract.md` beside
its `page.tsx`. One file per page, one section per endpoint, each section
carrying:

- `METHOD /path` and a one-line purpose
- path/query parameters
- request body shape (TypeScript-ish notation)
- success response shape with a realistic example
- error cases worth naming

Mock modules under `lib/mock/` carry a one-line header pointing at the endpoint
that replaces them. Purely static marketing copy is not given an endpoint.

At the end of the build, all `*.contract.md` files are merged into a single
root-level `API_CONTRACTS.md`, grouped by product then page. The per-page files
remain the source of truth; the merged file is generated for handoff.

## Consequences

- A backend engineer can read one page's contract without reading its React.
- The consolidated file is derived, so it can drift if regenerated carelessly —
  it is rebuilt from the per-page files rather than edited directly.
- Contracts describe intent, not an implemented API; they are proposals the Go
  team can push back on.
