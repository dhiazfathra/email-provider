# ADR-0008: The API returns raw values; the frontend owns presentation

- Status: Accepted
- Date: 2026-08-30
- Amends: [ADR-0002](0002-inline-styles-ported-from-design-mockups.md)
- Related: [ADR-0007](0007-product-decisions-as-single-source-of-truth.md)

## Context

ADR-0002 ported the mockups' data as literally as their styles. The result is
that `lib/mock/*.ts` holds presentation, not data: hex colours
(`deltaColor: "#0e8f80"`), gradient tokens (`tint: T1`), relative timestamps
(`"2 min ago"`, `"Yesterday 17:30"`), API keys pre-masked with `••••`, and JSON
samples pre-tokenised as `{line, color}[]`.

No API can produce any of it. A backend cannot know that a delta is teal, that
"2 min ago" is the right phrasing at render time, or how many bullet characters
belong in a masked key. Every console screen would have to be rewritten before it
could be wired to anything — and the mock modules are what `API_CONTRACTS.md` was
generated from, so the contract had begun to describe colours.

The app also has no `fetch`, no `NEXT_PUBLIC_*` variable and no client module:
there is no seam where a real call could replace a mock.

## Decision

The API returns numbers, ISO-8601 timestamps and lowercase enum members. Colour,
gradients, relative time, masking, currency and number formatting, and syntax
tokenisation are computed at the render site.

Data reaches pages through `email-send/frontend/lib/api.ts` — one module per
resource, async, returning the mocks today. After the split, no page imports
`lib/mock/*` directly, and the backend lands behind an unchanged call site.

## Alternatives Considered

### Serve presentation from the API

- Pros: components stay as the mockups wrote them; no rewrite
- Rejected: it freezes today's visual design into a public contract. A palette
  change becomes a breaking API change, and every future client — SDK, mobile,
  a partner — inherits one product's CSS.

### Keep mocks as they are and translate in a per-page adapter

- Pros: smallest immediate diff
- Rejected: one adapter per page is the same transformation written seven times,
  and it hides the true integration cost until the backend is ready to land.

## Consequences

- This is the largest single piece of frontend work in the remediation: every
  console page is touched.
- The guard tests (enum consistency, totals, no dead controls) are written
  _before_ this refactor, not after, because there is currently nothing to catch
  a regression while doing it.
- After it, "swap mock for fetch" is genuinely a module swap.
- Relative timestamps become live rather than frozen, which changes rendered
  output between server and client; the render site formats from an ISO value,
  so this is a hydration concern to handle per component.
