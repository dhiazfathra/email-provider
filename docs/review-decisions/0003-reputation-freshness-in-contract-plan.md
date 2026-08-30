# 0003 — Add `/reputation` freshness to the contract plan

Status: needs decision

## Finding

`docs/superpowers/plans/2026-08-30-plume-decisions-record.md:251` — CONTRACT_AUDIT.md
identifies `/reputation` as slow external state requiring an `asOf`
timestamp, but the plan only adds freshness handling for `/messages` and
`/metrics`. Provider scores can appear current without a timestamp.

## Options

- **A. Add `/reputation` + define the `/messages` eventual-consistency
  window.** Tradeoff: more upfront design work in an already-heavy plan, but
  closes a real gap.
- **B. Defer to a follow-up plan/PR.** Tradeoff: faster to ship S1, but ships
  a known contract gap into the audit trail.

## Recommendation

**A** if `/reputation` display is in scope for S1/S2 at all; if it's out of
scope for this phase, say so explicitly in the plan instead of silently
omitting it — the ambiguity is the actual problem, not the omission itself.
