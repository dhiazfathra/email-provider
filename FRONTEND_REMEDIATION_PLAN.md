# Plume (`email-send/`) — remediation plan

Order: **fix the frontend → rewrite the contract → build the backend.** This
document is the strategy for that, plus the hallucination register the first
phase works through.

## 0. Correction to `CONTRACT_AUDIT.md`

Two findings in that audit were wrong, and wrong in the same way: **I treated
`lib/mock/*.ts` and the docs page as the specification and judged the contract
against them.** They are Claude-generated design output that was never verified.
Judging a contract against unverified output ranks the hallucination above the
contract.

- **"Write paths are stubs or missing" — misdiagnosed.** The console has no write
  affordances at all. Six `<button>` elements exist in the whole app and none has
  an `onClick` except tab/filter toggles. There is no "create key", no "add
  domain", no "publish template", no "remove suppression" control anywhere. So
  `POST /keys`, `DELETE /suppressions/{address}` and the domain verify endpoints
  in the contract are not "the contract catching up to the UI" — they are
  **endpoints invented for screens that do not exist**. That is a contract
  hallucination, not a contract gap.
- **"`POST /v2/send` is absent from the contract" — right conclusion, wrong
  reason.** I cited the docs page as proof of what the send API is. The docs page
  is itself unverified fiction (§1 below). The send API must be _designed_, not
  _transcribed from the mock_.

Everything else in that audit stands, in particular the shape mismatch between
mocks and contract, the missing auth surface, and the ClickHouse consistency
conflict with architecture B.

---

## 1. Hallucination register

Claims present in the shipped frontend with no backing decision, no
implementation, and in several cases contradicting another part of the same
frontend. `S` = severity: **P** public/legal exposure, **C** internal
contradiction, **D** dead or dishonest UI.

### 1.1 Fabricated numbers presented as fact

| #   | Claim                                                                                     | Where                                        | Problem                                                                                                                                                                          | S   |
| --- | ----------------------------------------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| H1  | `99.31%` median delivery rate                                                             | `lib/mock/landing.ts` HERO_STATS             | Invented. Also the **exact same number** as the single-project "Delivered" KPI in `lib/mock/console.ts` — copy-paste, not a fleet statistic                                      | P   |
| H2  | `180 ms` API p95 latency                                                                  | HERO_STATS                                   | Invented. No service exists to have measured it                                                                                                                                  | P   |
| H3  | `4.1B` messages sent in 2026                                                              | HERO_STATS                                   | Invented. Zero messages have been sent                                                                                                                                           | P   |
| H4  | `202` "Accepted" as a mini-stat                                                           | MINI_STATS                                   | An HTTP status code rendered as a metric with a value and a label. Meaningless                                                                                                   | D   |
| H5  | `412 ms` "To inbox"                                                                       | MINI_STATS                                   | Same 412 as `latency_ms` in the message-detail payload. Reused digit                                                                                                             | P   |
| H6  | Gmail 98.7 / Outlook 96.2 / Yahoo 94.8 / iCloud 91.3                                      | landing PROVIDERS **and** console REPUTATION | Identical values in both. One is fleet-wide, one is one project. Cannot both be true                                                                                             | C   |
| H7  | `1.36M of 2M sends` quota                                                                 | console PROJECT                              | A 2M/month cap that exists in no plan. Pricing has Free 3,000/mo and Scale "pay per message, no floor"                                                                           | C   |
| H8  | Nav badges: Templates `24`, Suppressions `1.2k`                                           | console NAV                                  | `TEMPLATES` has 6 entries; `SUPPRESSIONS` has 8 rows against a stated total of 1,204                                                                                             | C   |
| H9  | Activity filter counts: All 1,462 / Delivered 1,401 / Opened 892 / Bounced 6 / Deferred 9 | console EVENT_FILTERS                        | 1401+6+9 = 1416, not 1462. 46 messages unaccounted for, and `Opened` overlaps `Delivered` with no stated relationship. The contract copied this ambiguity into `counts` verbatim | C   |

### 1.2 Fabricated product surface

| #   | Claim                                                                                                 | Where                                         | Problem                                                                                                                            | S     |
| --- | ----------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----- |
| H10 | SDKs for node, python, go, ruby, php, rust; `@plume/sdk`, `from plume import Plume`, `plume.New(...)` | landing SDKS, docs QUICKSTART_CODE, SDK_CHIPS | Six client libraries that do not exist, with published call signatures. Highest-cost promise in the app                            | P     |
| H11 | `smtp.plume.email:587`, STARTTLS, "API key as password"                                               | landing SDKS, docs                            | An entire second ingress protocol, not in the contract, not in architecture B, not decided                                         | P     |
| H12 | `trace_url: "https://plume.email/t/01J8K2QF7ZP"`                                                      | docs SEND_RESPONSE                            | A public URL exposing a message trace. Auth model unstated — as written it is an unauthenticated link to customer message metadata | **P** |
| H13 | Batch send, 500 messages per call                                                                     | docs RATE_LIMITS                              | Referenced as a limit; the endpoint is never defined anywhere                                                                      | C     |
| H14 | Idempotency: 24 h window, `idempotency_key` field                                                     | docs                                          | Real feature with real semantics, absent from the contract entirely                                                                | C     |
| H15 | Webhook signature `Plume-Signature: t=…,v1=…`                                                         | docs WEBHOOK_SAMPLE                           | Signing scheme implied (HMAC, timestamped, versioned) but never specified: algorithm, secret rotation, replay window               | P     |
| H16 | 9 webhook event types incl. `domain.record_drift`                                                     | docs WEBHOOK_EVENTS                           | Implies continuous DNS monitoring per domain. Large hidden system, never acknowledged                                              | C     |
| H17 | "replayed into your endpoint after an outage"                                                         | landing FEATURES                              | A replay API. No endpoint, no retention decision, no UI                                                                            | P     |
| H18 | "rolls back in one click" (templates)                                                                 | landing FEATURES                              | No such control exists on the templates page                                                                                       | D     |
| H19 | `99.99% uptime SLA`, "data residency", "SSO, SCIM"                                                    | landing PLANS enterprise                      | Contractual commitments in marketing copy                                                                                          | **P** |
| H20 | "Email support in under an hour", "named deliverability engineer"                                     | landing PLANS                                 | Service commitments with no operation behind them                                                                                  | P     |
| H21 | Footer links: Status, Security, Support, API reference                                                | landing FOOTER_LINKS                          | Four pages that do not exist. Footer renders them as text, not links, which is the only reason it is not a 404 farm                | D     |

### 1.3 Contradictions between parts of the same app

| #   | Conflict                                                                                                                                                                                                                                                     | S   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --- |
| H22 | **Stream enum, three-way.** Docs `DOC_STREAMS` = `transactional, notifications, bulk`. Console data uses `transactional, receipts, notifications, broadcast`. Landing copy says "receipts, resets and bulk". No two agree                                    | C   |
| H23 | **Template versioning, two syntaxes.** Docs send response returns `"template": "receipt-v3@14"`; console templates list shows slug `receipt-v3` at `version: 3`. Either the slug carries the version or `@n` does — currently both, and the numbers disagree | C   |
| H24 | **Retention, three values.** MINI_STATS "30 d event retention"; Free plan "30-day activity retention"; Scale plan "90-day activity retention". A global stat that contradicts the plan it is sold beside                                                     | C   |
| H25 | **Rate limit vs quota.** Docs: 100 sends/second on Free. Pricing: 3,000 messages/month on Free. 100/s is 260M/month. The two limits were written independently                                                                                               | C   |
| H26 | **Activity window.** Page blurb says "the last 24 hours"; the shell's range switcher offers 24h/7d/30d; the contract's `/messages` has no range parameter at all                                                                                             | C   |
| H27 | **Audit category set.** `AUDIT` contains a `Suppressions` row; `AUDIT_CATEGORIES` omits it, so that event is unreachable by any filter. The contract inherited the bug by listing `suppressions` in its enum while the UI cannot select it                   | C   |
| H28 | Landing mock header comment names `GET /v2/public/landing`; contract defines `GET /v2/public/metrics`                                                                                                                                                        | C   |

### 1.4 Dead and dishonest UI

| #   | Thing                                                                                                            | Reality                                                                                                                                                                                       | S   |
| --- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| H29 | Range switcher `24h / 7d / 30d`                                                                                  | `useState` in `app/console/layout.tsx:20`, **no consumer**. Clicking changes a highlight and nothing else                                                                                     | D   |
| H30 | Docs search field + `⌘K` badge                                                                                   | `<input type="search">` with no value, no handler, no key listener anywhere in the app. The contract specifies `GET /v2/public/docs/search` and "its ⌘K palette" — the palette does not exist | D   |
| H31 | Landing email capture `you@company.com`                                                                          | Bare `<input type="email">`. **No `<form>` element exists anywhere in the app.** Cannot submit                                                                                                | D   |
| H32 | Nav links Product / Deliverability / Pricing                                                                     | `href="#"`                                                                                                                                                                                    | D   |
| H33 | "Export CSV" (audit)                                                                                             | The only real `<button>` with no `onClick` in the app                                                                                                                                         | D   |
| H34 | Every console CTA implied by the contract (create key, add domain, verify, publish template, delete suppression) | No control exists                                                                                                                                                                             | D   |

### 1.5 Structural

| #   | Thing                                                                                                                                                                                                                                                                                                                     | S   |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| H35 | Presentation baked into data: hex colours (`deltaColor: "#0e8f80"`), gradients (`tint: T1`), relative timestamps (`"2 min ago"`, `"Yesterday 17:30"`), pre-tokenised JSON as `{line, color}[]`, masked key strings with `••••`. None of this can come from an API. Every screen must be refactored before any integration | C   |
| H36 | No test of any kind, no `fetch`, no `NEXT_PUBLIC_*`, no API client module. The app cannot be wired to anything without new plumbing                                                                                                                                                                                       | C   |
| H37 | `scripts/build-contracts.py` regenerates `API_CONTRACTS.md` with 26 lines of diff against the committed copy (committed file is Prettier-formatted, generator output is not)                                                                                                                                              | C   |

---

## 2. Strategy

The failure mode to design against: **fiction was written into three layers
(marketing copy, docs, console data) independently, so the layers contradict each
other, and then the contract was generated from the fiction and inherited it.**
Fixing the contract first would just re-launder the same claims. Hence the order
the user proposed is right, with one addition — a decisions document _above_ the
frontend, because otherwise "fix the frontend" has nothing to be fixed against.

```
PRODUCT_DECISIONS.md   ← new, the only source of truth
        ↓ frontend is made to match it (or made to admit it doesn't know)
   frontend + mocks
        ↓ contract is regenerated from verified screens
   API_CONTRACTS.md
        ↓
      backend
```

Rule for every phase: **a claim is allowed to exist in exactly one place.** A
number in the hero, a number in the console and a number in the contract are
three copies of one fact and will drift again. Numbers that must appear twice get
imported from one module.

---

## Phase 1 — Decisions (before touching code)

Produce `email-send/PRODUCT_DECISIONS.md`. Not a spec, a list of resolved
questions. Each entry: decision, date, and whether it is **committed**
(we will build it), **deferred** (real, not now), or **cut**.

Must resolve, at minimum:

1. **Stream model.** One enum. (H22) Recommend `transactional | notifications | bulk`,
   and treat `receipts`/`broadcast` in console data as customer-defined labels —
   which means the model is "system stream + free-text tag", or it means the enum
   is closed. Decide which.
2. **Template versioning.** Slug-carries-version or `@n` pinning, not both. (H23)
   Recommend immutable slug + `@n`, so `receipt` at `@14`, and fix all mock data.
3. **Plans and limits, one table.** Monthly quota, per-second rate, retention, per
   plan — resolving H7, H24, H25 together. Every other surface reads from it.
4. **Ingress surfaces.** REST only, or REST + SMTP relay (H11)? SMTP relay is a
   second product. Recommend: cut from v1 copy, keep as deferred.
5. **SDKs.** Which, if any, exist at launch (H10). Recommend: `curl` +
   one language, everything else removed from the page until it ships.
6. **Idempotency** (H14) — recommend committed, it is cheap at the outbox write
   and expensive to retrofit.
7. **Batch send** (H13) — recommend deferred, remove the limit line.
8. **Webhooks**: signing scheme, retry/backoff policy, replay (H15, H17), and
   whether `domain.record_drift` implies a DNS watcher (H16).
9. **`trace_url`** (H12): drop it, or define its auth. Do not ship an
   unauthenticated link to message metadata by omission.
10. **Legal/marketing claims** (H19, H20): SLA, data residency, SSO/SCIM,
    support response times. Anything not signed off gets deleted, not softened.
11. **Presentation ownership** (H35): backend returns raw values + enums, frontend
    owns formatting and colour. Recommend this; the alternative bakes UI decisions
    into a public API forever.
12. **Metric semantics** (H9): is `opened` a subset of `delivered`? What does
    `All` count? Define once, in words, before anything computes it.

Exit criterion: every H-number above appears in that file with a status.

## Phase 2 — Frontend truthing

Work in this order; each step is independently shippable.

**2a. Delete unbacked claims.** Every `P`-severity row that Phase 1 marked _cut_
comes out of `lib/mock/landing.ts` and `lib/mock/docs.ts`. Not rephrased —
deleted. The page must survive with less copy; if a section collapses without its
fiction, that section had no content.

**2b. Make surviving numbers honest.** Hero stats, provider rates and mini-stats
either (i) become clearly-labelled illustrative examples, (ii) get sourced from a
real measurement, or (iii) go. There is no fourth option in which the site claims
`4.1B messages` before sending one. Recommend: replace the hero stat strip with
product claims that are true today, and keep the _console_ numbers as sample data
behind an explicit "demo project" label.

**2c. One source per fact.** Extract `email-send/frontend/lib/plans.ts` (or
similar) holding the plan/limit/retention table from decision 3, and have
landing, docs and console read from it. Kills H7, H24, H25 permanently. Same for
the stream enum and status enum: one `lib/enums.ts`, imported everywhere,
lowercase, with a display-label map at the render site. Kills H22, H27.

**2d. Fix the arithmetic.** H9 counts recomputed from the definitions in decision 12. H8 badges derived from the data they label, never typed by hand.

**2e. Dead UI: make real, or remove.** For each of H29–H34 the choice is binary.
Recommended split:

- **Make real, client-side, now:** range switcher (thread `range` through to the
  mock accessors — this is also the exact seam the API will use later); docs
  search (filter over `DOCS_SECTIONS` in memory, no backend needed); `⌘K` (a
  keydown listener that focuses the field, ~5 lines).
- **Make real as a form:** landing email capture becomes a `<form>` that posts to
  the signup endpoint once it exists; until then, disabled with an honest label.
- **Remove:** Export CSV, `href="#"` nav links, dead footer links — or ship the
  pages behind them.
  Nothing ships that looks interactive and isn't. That is what generated this
  whole problem class.

**2f. Separate data from presentation** (H35). Rewrite the mock modules to hold
raw values only — numbers, ISO timestamps, lowercase enums — and move colours,
gradients, masking and relative-time rendering into the components. This is the
largest single piece of work and the one that makes integration possible at all;
after it, "swap mock for fetch" is genuinely a module swap.

**2g. Introduce the seam.** One `lib/api.ts` per resource, exporting async
functions that today return the mocks. Every page calls it. No page imports
`lib/mock/*` directly afterwards. The backend then lands behind an unchanged
call site.

**2h. Add the tests that would have caught this.** Cheap and high value:

- an enum-consistency test (every `stream`/`status`/`category` in mock data is in
  the enum, and every enum member is reachable by a filter — H27),
- a totals test (filter counts reconcile — H9, H8),
- a no-dead-controls test (every rendered `<button>`/`<a>` has a handler or a real
  href — H29–H34),
- a claims test: a checked-in list of marketing claims, failing if copy contains
  a number or an SLA not present in `PRODUCT_DECISIONS.md`.
  The last one is the actual fix for the root cause.

Exit criteria: no `href="#"`; no stateful control without a consumer; no number in
copy absent from the decisions file; `lib/mock` free of colours and formatted
strings; every page fetching through `lib/api.ts`; the four tests green.

## Phase 3 — Contract rewrite

Only now, and generated from screens that are true.

1. **Delete invented endpoints.** Anything with no UI and no decision behind it
   goes, or moves to an explicit "planned, not built" appendix. `POST /keys`,
   `DELETE /suppressions/{address}`, the domain verify endpoints, `docs/search`'s
   ⌘K palette — each either gets a screen in phase 2 or leaves the contract.
2. **Write the send API properly.** `POST /v2/send` is a design task now, not a
   transcription: request shape, idempotency, suppression rejection (`409`),
   domain-unverified (`403`), attachment limits, and the `202` body. It belongs in
   its own `send.contract.md`, not smuggled into a docs page.
3. **Write the auth surface.** Signin, session lifetime and refresh, verification
   redemption, project list, members and roles — everything the console endpoints
   already assume exists.
4. **Reconcile with architecture B.** Two things from the previous audit survive
   and must be written into the contract:
   - **Consistency window.** Console reads are served from an asynchronously-fed
     event store. State it, give `/messages` and `/metrics` an `asOf`, and give
     the UI a "not yet visible" state for a just-accepted message.
   - **Suppression removal is a compliance action, not a preference.** Complaint
     suppressions: refuse removal. Decide it in the contract, do not defer it to
     "a backend policy call".
5. **Normalise the envelope.** The console's `{error:{code,message}}` and the
   docs' `{status, code}` error table are two systems. One.
6. **Fix the generator** so `build-contracts.py` output is byte-identical to the
   committed file, and put the check in CI (H37). Otherwise the "source of truth"
   file is never regenerated because doing so dirties the tree.

Exit criterion: every endpoint in `API_CONTRACTS.md` maps to a screen or a
documented public API commitment, and every screen's data need maps to an
endpoint. Both directions.

## Phase 4 — Backend

Then architecture B's shape applies as drawn, and the build order it recommends
holds. Sequence within it:

1. Accept path only: auth, projects, keys, `POST /v2/send` writing to the outbox,
   suppression + domain checks at accept, idempotency. Returns `202`. Nothing
   delivers yet — this is testable end to end against the frontend.
2. Delivery: queue, workers, DKIM, MTA, retries. Suppression fed from bounces.
3. Event store + the console read endpoints, with the consistency window the
   contract now states.
4. Tenant webhooks, using the outbox pattern a second time.

---

## 3. What to do first

Phase 1 decisions 1, 3, 11 and 12 (stream enum, plan/limit table, presentation
ownership, metric semantics). They are four answers, they unblock most of phase
2, and every one of them is a question only you can answer — no amount of code
reading resolves them.

Phase 2f (data/presentation split) is the long pole: budget it as the real work,
because every console page is touched and there are currently no tests to catch a
regression while doing it. Do 2h's tests before 2f, not after.
