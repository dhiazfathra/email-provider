# ADR-0007: A product decisions record is the single source of truth for claims

- Status: Accepted
- Date: 2026-08-30
- Related: [ADR-0002](0002-inline-styles-ported-from-design-mockups.md), [ADR-0003](0003-api-contract-format.md)

## Context

Both frontends were built from Claude Design mockups and their mock data was
treated as specification. An audit of `email-send` found 37 distinct claims with
no backing decision: fabricated fleet metrics (99.31% delivery, 4.1B messages
sent, 180 ms p95), six client SDKs with published call signatures, an SMTP relay,
a 99.99% uptime SLA, SSO and SCIM.

Worse than any single claim was the shape of the failure. Fiction was written
into three layers — marketing copy, the docs page and console mock data —
independently, so the layers disagreed with each other: three incompatible stream
enums, three retention values, a per-second rate 80,000× the monthly quota beside
it, and the same invented delivery rate presented once as a fleet statistic and
once as one project's KPI. `API_CONTRACTS.md` is generated from those screens, so
it inherited the contradictions and handed them to the backend team.

Deleting the bad claims fixes the instances. Nothing in the repository would stop
the next screen from inventing the next set.

## Decision

`email-send/PRODUCT_DECISIONS.md` is the single source of truth for every number,
enum, limit and product promise. Each decision carries an identifier, a status of
`committed`, `deferred` or `cut`, and its reasoning. Copy, mock data and the API
contract are downstream of it: where they disagree, they are wrong.

Two mechanisms enforce it rather than requesting it:

- **The claim rule.** A claim exists in exactly one place. A value needed on two
  screens is imported from one module, never retyped. Committed limits live in a
  single fenced, machine-parseable block in the decisions file.
- **A claims test.** Product copy is scanned for numbers and service promises;
  the build fails on any not present in the decisions file.

## Alternatives Considered

### Fix the contract first, then the frontend

- Pros: unblocks the backend team soonest
- Rejected: the contract's defects are inherited. Regenerating it from unverified
  screens launders the same fiction into the artifact the backend builds from.

### Delete the bad claims, no decisions file, no test

- Pros: much smaller change
- Rejected: fixes 37 instances of a class that will reoccur the moment another
  screen is designed. The register is evidence that unverified design output
  becomes specification by default.

### Soften unbacked claims instead of deleting them

- Rejected: a hedged SLA is still an SLA. Only deletion removes the commitment.

## Consequences

- Adding a number to marketing copy now requires editing a decision record first.
  That friction is the point of the ADR.
- The Plume landing page loses its stat strip, SDK row and SMTP section, and its
  pricing page becomes a "not yet" statement. Sections that cannot survive
  without invented numbers had no content.
- Remediation is ordered decisions → frontend → contract → backend, one spec each.
- `email-inbox` (Pane) was built the same way and has not been audited. This ADR
  applies to it as soon as it is; the decisions file would be a sibling.
