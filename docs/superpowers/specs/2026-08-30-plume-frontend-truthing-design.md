# S2 — Plume frontend truthing

Date: 2026-08-30
Depends on: [S1](2026-08-30-plume-remediation-decomposition-design.md) and
[`email-send/PRODUCT_DECISIONS.md`](../../../email-send/PRODUCT_DECISIONS.md)
Blocks: S3 (contract rewrite), S4 (backend)

## Goal

Make `email-send/frontend` tell the truth, and make it structurally possible to
wire to an API. Every one of H1–H37 has a decided action in the decisions record;
S2 executes them, and leaves behind the tests that stop the class of defect from
returning.

## Measured starting state

6,044 lines. `app/docs/page.tsx` 1,189, `app/page.tsx` 929, `lib/mock/console.ts`
684, `app/console/layout.tsx` 366. Three routes plus seven console routes. No test
runner, no `fetch`, no `NEXT_PUBLIC_*`, no API client.

Representative defects, verified in the source rather than assumed:

- `lib/mock/console.ts:150` — `EventStatus = "Delivered" | "Opened" | "Bounced" | "Deferred"`:
  capitalised, and mixes an engagement event into a state partition.
- `lib/mock/console.ts:160` — `stream: "receipts"`, which is not in any decided enum.
- `lib/mock/console.ts:13` — `quota.usedLabel: "1.36M of 2M sends · resets 1 Sep"`,
  a pre-formatted string carrying a quota that no plan defines.
- `lib/mock/console.ts:6` — `T1…T5` gradients and `STATUS_TINT` exported from the
  data module.
- `lib/mock/console.ts:250` — `EVENT_FILTERS` counts typed by hand against ~12
  fixture rows.
- `app/page.tsx:144,918` — nav links `href={l === "Docs" ? "/docs" : "#"}`.

## Correction to S1

D3 in the decisions record says the `/pricing` route survives as a "not yet"
page. **There is no `/pricing` route.** Plume has `/`, `/docs` and
`/console/*`; pricing is the `PLANS` section of `app/page.tsx`, and `Pricing` in
`NAV_LINKS` is one of the `href="#"` links from H32. D3 is amended in PR 7 to:
delete the `PLANS` section and its cards, drop `Pricing` from `NAV_LINKS`, and
put the "pricing does not exist yet" statement in the landing footer area. The
substance — no published prices, no SLA, no SSO, no support commitments — is
unchanged.

## Module shape

```
lib/
  enums.ts     STREAMS, MESSAGE_STATES, AUDIT_CATEGORIES, SCOPES — lowercase, `as const`
  limits.ts    SEND_RATE_PER_SECOND, ACTIVITY_RETENTION_DAYS, checked against D2
  format.ts    relativeTime(iso), maskKey(id), formatCount(n) — pure, presentation
  theme.ts     stateTint(), streamTint(), gradient() — colour keyed by enum member
  data/        raw fixtures: numbers, ISO-8601, lowercase enums
  api/         one module per resource; async; returns data/ today
```

Three rules, from D11 and D14:

1. **`data/` may not contain a formatted string.** `time: "9:41:02"` becomes
   `sent_at: "2026-08-30T09:41:02Z"`. `usedLabel` disappears entirely — no quota
   exists (D2).
2. **Counts are never stored.** Filter and badge counts are derived from the
   collection they label, so the number shown is the number present.
3. **Colour is keyed by enum at the render site.** A state with no tint is a type
   error, which is what gives the enum test something real to check.

Consequence to expect: the console's numbers become small and honest. The filter
row claims 1,462 messages over roughly a dozen fixture rows today; after D14 it
shows the dozen. Under D13's "demo project" label that is correct, and the
console will look emptier than the design screenshots.

## Tests

Vitest for data, Playwright for controls.

| Test               | Runner     | Asserts                                                                                                                                                              | Guards         |
| ------------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| `enums.test.ts`    | Vitest     | every `stream`/`state`/`category` in `data/` is an enum member; every member is reachable by a filter; every member has a tint                                       | H22, H27, D1   |
| `totals.test.ts`   | Vitest     | every displayed count equals the collection it labels; filter counts partition the total                                                                             | H8, H9, D14    |
| `claims.test.ts`   | Vitest     | parses the D2 limits block and the decision table; scans landing and docs copy for numerals, percentages and promise words; fails on anything absent from the record | the root cause |
| `controls.spec.ts` | Playwright | crawls all nine routes: no `href="#"`, no `<button>` without effect, and the range switcher, docs search and `⌘K` change rendered output                             | H29–H34, D15   |

`claims.test.ts` carries a **forbidden-phrase list** beside its numeric scan —
seeded with `SLA`, `uptime`, `guarantee`, `industry-leading`, `SSO`, `SCIM`,
`data residency`, `within an hour` — because a numeric scan alone never catches
"industry-leading uptime". Extending that list is the maintenance task the test
creates.

## Sequence

Seven PRs, each independently shippable, each with an evidence folder under
`docs/evidence/email-send/`.

| PR  | Work                                                                                                                                                                                                               | Done when                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| 1   | Vitest, Playwright, `docs/evidence/` scaffold, `npm test` / `npm run e2e`                                                                                                                                          | both runners green; README documents the commands                |
| 2   | `enums.ts`, `limits.ts`, `format.ts`, `theme.ts`; enum, totals, claims tests                                                                                                                                       | enum and totals green; claims **skipped**, linking PR 3          |
| 3   | Delete every `cut` claim: hero stats, providers, mini-stats, SDK chips and code, SMTP, plan cards, `Pricing` nav entry, SLA/SSO/SCIM/support copy, `trace_url`, batch limit, `domain.record_drift`, rollback claim | claims test unskipped and green                                  |
| 4   | Controls: range switcher threaded to accessors, docs search, `⌘K`, email capture as a disabled `<form>`; remove Export CSV, `href="#"`, dead footer links                                                          | `controls.spec.ts` green on all nine routes                      |
| 5   | Data/presentation split, page by page; lowercase enums, ISO timestamps, derived counts, `@n` template pins                                                                                                         | `data/` free of colour and formatted strings; totals still green |
| 6   | `lib/api/*` seam; every page converted                                                                                                                                                                             | no page imports `data/` directly                                 |
| 7   | Evidence pack, README, D3 correction in the decisions record and ADR-0009                                                                                                                                          | all four tests green; every PR has its evidence folder           |

The claims test lands skipped on purpose. Written after the deletions it would be
fitted to already-clean copy and never proven to fail; written before them, PR 3
is what turns it green, and the failure list is the actual defect list.

## Risk register

Risks are tracked here rather than discovered later. **Address** means it is
handled inside S2; **revisit** means it is accepted now with a stated trigger.

| R   | Risk                                                                                                                  | Disposition | Trigger / mitigation                                                                                                                                                                                                 |
| --- | --------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | PR 5 touches every console page with no way to be small; a regression is invisible without tests                      | **address** | PRs 2 and 4 land first; that ordering is the entire reason for the sequence. PR 5 is committed page by page, each commit green.                                                                                      |
| R2  | The claims test flags legitimate numerals (version numbers, `⌘K`, port numbers)                                       | **address** | Allowlist from the start, every entry with a one-line reason, reviewed like code. An allowlist is a hiding place — that is why the reason is mandatory.                                                              |
| R3  | The forbidden-phrase list catches only phrasings we thought of                                                        | **revisit** | Accepted: it is a ratchet, not a proof. Revisit when a claim reaches production copy that neither scan caught — add the phrasing, and record it in the decisions file.                                               |
| R4  | Playwright adds a browser download to CI                                                                              | **revisit** | Accepted; S3 and S4 want an e2e path anyway. Revisit if CI time exceeds ~5 minutes — the control audit can degrade to a static source scan.                                                                          |
| R5  | Relative timestamps become live, so server and client renders can differ (hydration)                                  | **address** | `format.relativeTime` is called in a client component from an ISO value; the server renders the absolute date. Verified per page in PR 5's evidence.                                                                 |
| R6  | Demo console data becomes visibly sparse, and someone re-inflates it later                                            | **revisit** | The totals test blocks typed counts, but not a larger fixture. Revisit by deciding whether the demo project gets a generated fixture of realistic size — a decision for the decisions record, not an edit to a mock. |
| R7  | `email-inbox` (Pane) was built the same way and is unaudited                                                          | **revisit** | Out of S2's scope. Trigger: before Pane's next feature or any public launch, run the same audit and give it its own decisions record. S2 leaves the shared evidence convention ready for it.                         |
| R8  | The API seam in PR 6 is designed against mocks, so its shape may not survive S3's real contract                       | **revisit** | Accepted deliberately: the seam's value is that call sites stop importing fixtures. Revisit during S3 — if an endpoint's shape forces a signature change, that is one module, not seven pages.                       |
| R9  | `app/docs/page.tsx` (1,189 lines) and `app/page.tsx` (929) are too large to reason about, and PR 3 edits both heavily | **revisit** | Not split in S2: splitting them while deleting from them makes the diff unreviewable. Trigger: after PR 7, extract per-section components before any new landing or docs content is added.                           |
| R10 | The decisions record and the tests could drift if a decision changes and no test does                                 | **address** | `claims.test.ts` parses the record at run time rather than copying its values, so a changed decision changes the test's expectations in the same commit.                                                             |

## Out of scope

Contract edits (S3), backend (S4), the Pane app (R7), engagement tracking, SMTP,
SDKs, batch send and webhook replay (all deferred in the decisions record), and
any visual redesign — S2 deletes and restructures, it does not restyle.

## Exit criteria

- No `href="#"` anywhere; no stateful control without a consumer.
- No number or promise in copy that is absent from `PRODUCT_DECISIONS.md`.
- `data/` contains no colour, gradient, formatted string or relative timestamp.
- Every page reads through `lib/api/`; no page imports `data/`.
- Four tests green in CI.
- One evidence folder per PR, each with exact commands and full output.
