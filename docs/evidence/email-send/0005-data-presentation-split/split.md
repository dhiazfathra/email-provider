# Evidence: data holds no presentation

**Claim:** `lib/data/` holds only raw values — no hex colours, no gradients, no
pre-formatted relative times, no masked secrets — and counts/badges are
derived, not typed.

## Command

```bash
cd email-send/frontend
grep -rnE "#[0-9a-fA-F]{6}|linear-gradient|min ago|••••" lib/data/ ; echo "exit=$?"
```

## Output

```text
exit=1
```

No matches — the grep's own failure is the proof.

## Full suite

```bash
npm test && npm run e2e
```

```text
Test Files  6 passed (6)
     Tests  15 passed (15)
...
Running 14 tests using 2 workers
  14 passed
```

## Screenshot

`console-after.png` — `/console`, showing KPI counts that match `MESSAGES`
via `messageCounts()`/`kpisForRange()`, and the "Demo project" label instead
of the fabricated monthly-volume quota bar (D2, D13).
