# 0008 — Widen the API-seam import scan

Status: needs decision (fix recommended)

## Finding

`docs/superpowers/plans/2026-08-30-plume-frontend-truthing.md:1609` — the
test only searches for the exact string `@/lib/data/`. It misses relative
data imports and direct `@/lib/mock/*` imports, though ADR-0008 requires
pages to stop importing mock data directly. The closeout grep at L1703–1705
has the same gap.

## Options

- **A. Parse import declarations properly** (AST-based) or resolve both
  `lib/data`/`lib/mock` path forms. Tradeoff: more robust, costs a bit more
  test-infra work; matches "enforce ADR-0008" as actually meant.
- **B. Leave the string grep.** Tradeoff: cheap, but a page can silently
  violate ADR-0008 via a relative import or direct mock import and CI stays
  green.

## Recommendation

**A.** Same pattern as 0005/0007 — a guard test whose match criteria are
narrower than the rule it's meant to enforce isn't a minor gap, it's the
test not doing its job. Apply the same fix to the closeout grep.
