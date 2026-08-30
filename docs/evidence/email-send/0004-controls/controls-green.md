# Evidence: every control is real

**Claim:** `e2e/controls.spec.ts` fails against the pre-fix app (dead links,
inert range switcher, inert search, non-functional ⌘K, a bare `<input>` with
no `<form>`) and passes once each control is wired or removed.

## Before (Task 14, first run)

```text
5 failed
  e2e/controls.spec.ts:16:7 › / has no dead links
  e2e/controls.spec.ts:23:5 › the range switcher changes what is rendered
  e2e/controls.spec.ts:32:5 › docs search filters the sections
  e2e/controls.spec.ts:41:5 › Cmd+K focuses the docs search field
  e2e/controls.spec.ts:47:5 › the landing email capture is a form
8 passed (51.1s)
```

## After (Tasks 15–17)

```bash
cd email-send/frontend && npm run e2e
```

```text
Running 14 tests using 2 workers
  ✓ 14 passed (4.3s)
```

Exit code: 0.

## Screenshot

`cmdk-focus.png` — `/docs` with the search field populated with "webhook",
showing the sidebar nav filtered to only the sections whose label matches.
