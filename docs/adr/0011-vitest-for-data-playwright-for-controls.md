# ADR-0011: Vitest for data invariants, Playwright for control behaviour

- Status: Accepted
- Date: 2026-08-30
- Related: [ADR-0007](0007-product-decisions-as-single-source-of-truth.md), [ADR-0008](0008-api-returns-raw-values-frontend-owns-presentation.md)

## Context

Neither frontend has a test of any kind. `email-send/frontend`'s dependencies are
Next, React, TypeScript and ESLint; there is no runner, no assertion library and
no CI test step.

That absence is not incidental to the 37-item defect register — it is why the
register exists. Nothing could have failed when the activity filter counts stopped
summing to their total, when `Suppressions` audit rows became unreachable by any
filter, when a stream value appeared that no enum contained, or when a button
shipped with no `onClick`. Every one of those is mechanically checkable.

The remediation's largest piece of work (the data/presentation split, ADR-0008)
touches every console page, and would be performed with no regression net at all.

## Decision

Two runners, chosen per class of claim:

- **Vitest** for data invariants that never render: enum consistency, count
  derivation, and the claims check that parses `PRODUCT_DECISIONS.md` and fails
  the build on any number or promise in copy that is absent from it.
- **Playwright** for control behaviour: crawl all nine routes and assert no
  `href="#"`, no `<button>` without an effect, and that the range switcher, docs
  search and `⌘K` change what is rendered.

The claims test **parses the decisions record at run time** rather than copying
values out of it, so a changed decision changes the test's expectations in the
same commit.

Tests land before the refactor they protect, and the claims test lands **skipped**
— the fabricated copy is still present at that point, so it is written against
real failures and unskipped by the commit that deletes them.

## Alternatives Considered

### `node --test` with `tsx`, all four checks as data or source scans

- Pros: one dev dependency; the control check becomes a regex/AST scan that covers
  every file rather than only rendered paths
- Rejected: a source scan cannot tell whether the range switcher actually changes
  output — only that a handler exists. "Looks interactive but isn't" is the exact
  defect class, and a handler that updates unused state passes the scan.

### Vitest + Testing Library + jsdom for everything

- Pros: one runner
- Rejected: jsdom renders components, not routes. The dead controls are spread
  across a layout, seven pages and a landing page; asserting per component means
  remembering to write the assertion for each.

### No tests, rely on review

- Rejected: review produced the register.

## Consequences

- CI gains a browser download and a slower job. Accepted; S3 and S4 want an e2e
  path. If CI exceeds a few minutes the control audit can degrade to a source scan.
- The claims test will flag legitimate numerals (version numbers, `⌘K`, ports).
  It carries an allowlist in which every entry states its reason — an allowlist is
  a hiding place, and the reason is what makes hiding visible.
- The numeric scan cannot catch "industry-leading uptime", so a forbidden-phrase
  list sits beside it. It is a ratchet, not a proof: each claim that slips through
  is added, with the decision record updated to match.
- Adding marketing copy now requires a decision record entry first. Intended.
