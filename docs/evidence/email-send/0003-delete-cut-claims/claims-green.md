# Evidence: no fabricated metric, SDK, SMTP or plan claim remains

**Claim:** the guard now proves the landing page and docs carry no fabricated
delivery/latency/volume metric, no unshipped SDK list, no SMTP relay copy, and
no pricing plans, and that the claims test enforces it going forward.

## Command

```bash
cd email-send/frontend && npm test
```

## Output

```text
 Test Files  5 passed (5)
      Tests  13 passed (13)
```

Exit code: 0. Zero skipped — `tests/claims.test.ts` is unskipped and green.

## Screenshot

`landing-after.png` — the landing page with `HERO_STATS`, `MINI_STATS`,
`PROVIDERS`, the `SDKS`/SMTP block and `PLANS` all removed. Look for: no stat
strip under the headline, no inbox-placement bar chart, no SDK/SMTP card row,
no plan cards — replaced by the single "Plume is a proof of concept" sentence.
