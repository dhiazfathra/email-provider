# 0007 — Iterate `AUDIT_CATEGORIES` not `AUDIT_ENTRIES`

Status: needs decision (fix recommended)

## Finding

`docs/superpowers/plans/2026-08-30-plume-frontend-truthing.md:1530` —
`used` is built from `AUDIT_ENTRIES`, so the assertion only rechecks values
already present in the data. A new enum member with no row or filter would
pass.

## Options

- **A. Iterate `AUDIT_CATEGORIES`** and assert every member has a reachable
  filter. Tradeoff: none — this is what the test needs to do what its name
  claims ("every category is reachable").
- **B. Leave as-is.** Tradeoff: test provides false confidence; a whole
  class of bug (new category, forgotten filter) is untestable by design.

## Recommendation

**A, unconditionally** — same class of issue as 0005: the test name promises
more than the implementation checks.
