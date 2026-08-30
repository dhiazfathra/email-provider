# Evidence: both test runners execute and pass

**Claim:** `npm test` (Vitest) and `npm run e2e` (Playwright) both run and pass
against `email-send/frontend`.

## Command

```bash
cd email-send/frontend && npm test
```

## Output

```
npm notice run test
npm notice run vitest run

 RUN  v3.2.7 email-send/frontend

 ✓ tests/harness.test.ts (1 test) 1ms

 Test Files  1 passed (1)
      Tests  1 passed (1)
```

Exit code: 0

## Command

```bash
cd email-send/frontend && npm run e2e
```

## Output

```
npm notice run e2e
npm notice run playwright test
[WebServer] npm notice run dev
[WebServer] npm notice run next dev

Running 1 test using 1 worker

  ✓  1 e2e/harness.spec.ts:3:5 › the landing page renders its product name (259ms)

  1 passed (2.0s)
```

Exit code: 0
