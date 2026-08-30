# 0009 — Deterministic fixture range filtering (clock dependency)

Status: needs decision

## Finding

`docs/superpowers/plans/2026-08-30-plume-frontend-truthing.md:1640` — the
message accessor compares live `Date.now()` against fixtures pinned to
2026-08-30. Once the wall clock passes ~2026-09-29, a 30-day request can
return no fixtures; before then, multiple ranges can return identical
lists. The range-switcher E2E test is time-dependent.

## Options

- **A. Inject a fixed/mock clock into the accessor for tests.** Tradeoff:
  requires a small seam (clock injection) in code the plan is still
  designing — best done now while the interface is being defined.
- **B. Generate fixture timestamps relative to the test-run clock** (e.g.
  `now - N days`) instead of pinning absolute dates. Tradeoff: simpler than
  A, no production code change, but doesn't fix the underlying
  "presentation layer depends on wall clock" smell if that matters
  elsewhere.
- **C. Leave it.** Tradeoff: a real ticking time bomb — this test will
  start failing or passing vacuously on a specific future date for reasons
  nobody will immediately connect to "it's been 30 days."

## Recommendation

**B for the test fix now** (cheapest, fully removes the date-bomb), **A
if/when the accessor itself needs a clock seam for other reasons** (e.g.
other time-window tests). Don't ship this as designed — it's tagged Heavy
Lift for a reason, but the ticking-clock failure mode is worse than the fix
effort.
