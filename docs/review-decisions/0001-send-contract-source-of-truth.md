# 0001 — Use S1 as source of truth for the send contract

Status: needs decision

## Finding

`CONTRACT_AUDIT.md` (L156–160, L197–200) and
`docs/superpowers/plans/2026-08-30-plume-decisions-record.md` (L240–243) still
carry send-contract details (fixed `409`/`403`, attachment handling, `202`
status) copied from the old, unverified docs page instead of from the S1
decisions record. This can reintroduce features S1 cut or deferred, and can
freeze send semantics that were never actually decided.

## Options

- **A. Adopt as written** — mark the old comparison historical, replace the
  copy-from-docs instruction with D1–D20-backed design work, strip the fixed
  status-code requirements unless S1 actually records them.
  Tradeoff: correct, but requires first confirming S1 actually settled these
  codes — if it didn't, you're left with a gap to fill before S2 can proceed.
- **B. Leave as-is** — keep the docs-page-derived contract as a placeholder.
  Tradeoff: cheap now, but risks freezing send semantics nobody decided, and
  reintroduces features S1 explicitly cut.
- **C. Partial** — mark historical now (low-risk edit), defer the status-code
  strip until S1's send-contract section is confirmed complete.

## Recommendation

**A**, in two steps: first verify against S1 which of
`409`/`403`/attachment/`202` are actually decided, then edit both docs
together so they don't drift apart again. This is a correctness issue, not a
style one — shipping the S2 plan against unverified docs risks building the
wrong contract.
