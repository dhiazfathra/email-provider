# 0002 — Keep Playwright mandatory vs. source-scan fallback

Status: needs decision

## Finding

`docs/adr/0011-vitest-for-data-playwright-for-controls.md:65` proposes a
source-scan fallback for the control audit, but the same ADR's Alternatives
section rejects source scans because they can't prove rendered behavior —
self-contradicting.

## Options

- **A. Keep Playwright mandatory**, address runtime concerns via
  parallelization/job-splitting instead.
  Tradeoff: no CI-time regression risk from silently-passing dead controls;
  costs some CI setup work to parallelize.
- **B. Allow the source-scan fallback** for cases where Playwright is flaky
  or slow.
  Tradeoff: reintroduces exactly the blind spot the ADR was written to
  close — a control can be dead in the rendered DOM and still "pass."

## Recommendation

**A.** An ADR that argues against X in one section and then permits X in
another is a contradiction, not a nuance — fix it to be internally
consistent. Splitting/parallelizing Playwright is the safer lever for
runtime.
