# 0004 — Include `app/page.tsx` copy in the claims scan

Status: needs decision

## Finding

`docs/superpowers/plans/2026-08-30-plume-frontend-truthing.md:784` —
`COPY_FILES` only scans two mock files, but Task 10 adds product copy
directly in `app/page.tsx` (L894–898), which `claims.test.ts` can't see.
Numerals or promise phrases in page JSX can bypass the test, so the exit
criterion isn't fully enforced.

## Options

- **A. Add `app/page.tsx` to `COPY_FILES`.** Tradeoff: simplest, but couples
  the test to page structure — copy added elsewhere later needs the same
  treatment.
- **B. Centralize all product copy into the scanned mock/data sources**,
  keep `app/page.tsx` presentation-only. Tradeoff: more refactor now, but
  matches the plan's own separation-of-concerns goal (ADR-0008) and makes
  the claims scan exhaustive by construction rather than by a maintained
  file list.

## Recommendation

**B.** This plan's whole thesis is "don't let unverified claims leak into
the frontend" — a copy source that's structurally outside the scan defeats
the exit criterion. Worth the refactor.
