# Evidence: S2 exit criteria

## No dead links

```bash
cd email-send/frontend && grep -rn 'href="#"' app/ ; echo "exit=$?"
```

```text
exit=1
```

## No presentation in data modules

```bash
grep -rnE "#[0-9a-fA-F]{6}|linear-gradient" lib/data/ ; echo "exit=$?"
```

```text
exit=1
```

## No page bypasses the api seam

```bash
grep -rn "@/lib/data/" app/ ; echo "exit=$?"
```

```text
exit=1
```

## Full pipeline

```bash
npm run lint && npm test && npm run e2e && npm run build
```

- `npm run lint` — exit 0, no findings
- `npm test` — 7 files, 18 tests passed
- `npm run e2e` — 14 tests passed
- `npm run build` — compiled and generated all 11 static pages

All four commands exited 0.
