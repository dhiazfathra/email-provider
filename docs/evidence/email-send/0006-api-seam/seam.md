# Evidence: every console page reads through the api seam

**Claim:** no `app/**/*.tsx` file imports `@/lib/data/*` directly; every
console page calls an async accessor in `lib/api/`.

## Before (failing)

```text
 ❯ tests/seam.test.ts:14:21
   expected [ "app/console/activity/page.tsx", "app/console/audit/page.tsx",
     "app/console/domains/page.tsx", "app/console/keys/page.tsx",
     "app/console/layout.tsx", "app/console/page.tsx",
     "app/console/suppressions/page.tsx", "app/console/templates/page.tsx" ]
   to deeply equal []
```

## After

```bash
cd email-send/frontend && npm test
```

```text
 ✓ tests/seam.test.ts (1 test) 3ms
 Test Files  7 passed (7)
      Tests  18 passed (18)
```

```bash
cd email-send/frontend && npm run e2e
```

```text
Running 14 tests using 2 workers
  14 passed
```

Exit code: 0 for both.
