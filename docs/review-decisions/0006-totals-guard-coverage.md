# 0006 — Extend totals-guard test to every displayed count

Status: needs decision

## Finding

`docs/superpowers/plans/2026-08-30-plume-frontend-truthing.md:1345` — the
test only checks `MESSAGES` and the absence of a `count` key in message
rows. It does not check the planned audit, suppression, navigation, or KPI
counts, though the design requires every displayed count to match its
labeled collection.

## Options

- **A. Extend now** to cover all counts. Tradeoff: larger test, but matches
  the stated design requirement and catches drift in any of them.
- **B. Ship with `MESSAGES` only, extend later.** Tradeoff: the exit
  criterion ("every displayed count") isn't actually met, so this
  under-delivers on what the plan promises.

## Recommendation

**A.** The plan already documents the requirement as "every displayed
count" — partial coverage silently narrows scope without saying so.
