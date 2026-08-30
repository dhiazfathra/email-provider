# 0011 — Stale/invalid findings (batch)

Status: resolved — no action

Three CodeRabbit findings no longer match current file content. Verify once
against the current diff, then resolve the corresponding review thread as
outdated.

## Findings

1. **`docs/superpowers/plans/2026-08-30-plume-decisions-record.md:186`** —
   "replace the obsolete per-plan model." Current text already models only
   `plume.limits`; no plan/tier/quota table exists there.
2. **`docs/superpowers/plans/2026-08-30-plume-decisions-record.md:3`** —
   "put decision phase first." No `frontend → contract → backend`
   phase-order text exists at/near line 3 in current content.
3. **`docs/superpowers/specs/2026-08-30-plume-remediation-decomposition-design.md:58`**
   — MD040 fence-language conflict. No fenced code block exists at this
   location; nothing to lint.

## Recommendation

Reply "stale, not reproducible against current diff" on each thread and
resolve.
