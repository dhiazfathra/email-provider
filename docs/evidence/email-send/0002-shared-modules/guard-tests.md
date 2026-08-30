# Evidence: shared modules and guard tests are green

**Claim:** the enum, limits, format and theme modules are single-source, and
the guard tests over them pass, with the claims test skipped pending PR 3's
deletions.

## Command

```bash
cd email-send/frontend && npm test
```

## Output

```text
 ✓ tests/enums.test.ts (3 tests) 3ms
 ✓ tests/limits.test.ts (2 tests) 2ms
 ✓ tests/harness.test.ts (1 test) 1ms
 ↓ tests/claims.test.ts (2 tests | 2 skipped)
 ✓ tests/format.test.ts (5 tests) 19ms

 Test Files  4 passed | 1 skipped (5)
      Tests  11 passed | 2 skipped (13)
```

Exit code: 0

## PR 3 worklist (claims test unskipped once, showing today's offenders)

The claims test cannot run unskipped yet — `lib/mock/landing.ts` and
`lib/mock/docs.ts` still contain the fabricated stats, SDK list, and SMTP copy
that PR 3 deletes. That deletion list is enumerated in the plan's Task 10 and
Task 11 (`HERO_STATS`, `MINI_STATS`, `PROVIDERS`, `SDKS`, `PLANS`, the SMTP
paragraph, `trace_url`, the batch-send rate row, `domain.record_drift`).
