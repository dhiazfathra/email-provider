# 0005 — Exact-token vs. substring decision matching

Status: needs decision (fix recommended)

## Finding

`docs/superpowers/plans/2026-08-30-plume-frontend-truthing.md:797` —
`decided.includes(n.trim())` authorizes substrings from the entire decisions
record. A copy claim of `10` passes when only `100` appears. Rationale text
and dates can also authorize values outside committed decision fields.

## Options

- **A. Switch to exact-token comparison** (parse normalized decision values,
  compare tokens). Tradeoff: none real — straightforward bug fix.
- **B. Leave substring matching.** Tradeoff: none in its favor — a
  false-negative-permitting bug in a test meant to catch fabricated numbers.

## Recommendation

**A, unconditionally.** This isn't a product decision, it's a correctness
bug in the test itself — it's listed here rather than auto-fixed only
because it requires understanding the test's intended matching semantics
well enough to rewrite the assertion correctly, which did not clear
autofix's mechanical-fix bar. Fix before S2 lands.
