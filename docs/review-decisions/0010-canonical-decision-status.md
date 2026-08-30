# 0010 — One canonical status per decision (D9, D15)

Status: needs decision

## Finding

`email-send/PRODUCT_DECISIONS.md:153` (also applies to L226) — `Status` is
declared as a single value, but D9 and D15 place multiple statuses in the
same field. A consumer can't safely determine whether the decision is
committed, deferred, or cut.

## Options

- **A. Split each combined decision into separately-statused
  sub-decisions.** Tradeoff: more entries, but each has an unambiguous
  status — matches the file's own declared schema.
- **B. Define and validate a structured status schema** that can
  legitimately hold multiple sub-statuses (e.g.
  `Status: {main: committed, h16: deferred}`). Tradeoff: more upfront schema
  work, but avoids proliferating near-duplicate decision entries if D9/D15
  are genuinely one decision with sub-parts.
- **C. Leave combined free-text status.** Tradeoff: this is the bug being
  reported — any downstream tooling (including the S1 decisions-record
  parser this same PR is building) can't reliably parse it.

## Recommendation

**A** if D9/D15 are really independent decisions merged into one entry for
convenience; **B** if they're genuinely one decision with linked
sub-decisions. Either way, **not C** — this file is explicitly the "single
source of truth" (ADR-0007) other docs and a parser are being built to
consume; an ambiguous status field undermines that role directly.
