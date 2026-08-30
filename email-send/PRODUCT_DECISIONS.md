# Plume — product decisions

The single source of truth for what Plume claims, promises and enforces. Every
number, enum, limit and product commitment in the landing site, the docs page,
the console and `API_CONTRACTS.md` traces to a decision here.

Written 2026-08-30, resolving the hallucination register in
[`FRONTEND_REMEDIATION_PLAN.md`](../FRONTEND_REMEDIATION_PLAN.md).

## How to read this file

- **Status** is one of **committed** (we will build it), **deferred** (real, not
  now) or **cut** (will not exist; delete the claim, do not soften it).
- **Phase** is the phase of the remediation plan in which a committed decision
  lands. `PoC` means the proof-of-concept scope below; `later` means after it.
- A decision is authority. If copy, mock data or a contract disagrees with this
  file, the copy, mock data or contract is wrong.

## The claim rule

**A claim exists in exactly one place.** A number in the hero, the same number in
the console and the same number in the contract are three copies of one fact and
will drift apart again — that is exactly how the register below came to exist.
Any value that must appear twice is imported from one module, never retyped.

Machine-readable consequence: the committed limits live in the single fenced
block under D2, in that shape. The claims test in Phase 2 parses that block and
this file's decision table, and fails the build on a number or a promise in
product copy that is not present here.

## PoC boundary

The proof of concept has **no billing and no metering**. Nothing charges, nothing
counts against a quota, and no plan tiers exist. Out of scope for the PoC, each
with a decision below: payments and Stripe (D2, D3), engagement tracking (D4),
client SDKs (D5), the SMTP relay (D6), batch send (D8), webhook replay (D9).

## Decisions

### D1 — Stream is a closed enum

**Status:** committed (PoC). Customer-defined tags: deferred (later).
**Resolves:** H22.

The stream enum is `transactional | notifications | bulk` and nothing else. The
console's `receipts` and `broadcast` are deleted from mock data; the docs enum
and the landing copy are brought to the same three.

Stream drives reputation isolation and rate policy, so it must be a small,
backend-meaningful set rather than a labelling system. Customers who want
`receipts` as a distinction get a free-text tag field later; adding it is
additive and does not break the enum.

**Delivered:** S2, e2ed495..4fbefa7.

### D2 — No plans, no tiers, one limit set

**Status:** committed (PoC). **Resolves:** H7, H24, H25.

```
plume.limits
  send_rate_per_second: 100
  activity_retention_days: 30
  monthly_quota: none
  billing: none
```

Every surface reads these from one module. The console's 2M/month cap is deleted;
it belonged to no plan. The three conflicting retention values collapse to one.

Tiering was the root cause of H25: a per-second rate and a monthly quota were
written independently, and 100/s is 260M/month against a stated 3,000/month cap.
With no quota there is nothing for the rate to contradict. Metering and per-plan
limits return with billing, not before.

**Delivered:** S2, e2ed495..4fbefa7.

### D3 — The site states that pricing does not exist yet

**Status:** committed (PoC). **Resolves:** H19, H20. **Amended 2026-08-30.**

There is no `/pricing` route — pricing is the `PLANS` section of the landing page,
and `Pricing` in `NAV_LINKS` is one of the `href="#"` dead links from H32. The
plan cards and that nav entry are deleted; one honest paragraph saying pricing
does not exist yet takes their place on the landing page.

_(The first version of this decision described a `/pricing` route being kept.
That route was never built. The substance is unchanged.)_

The 99.99% uptime SLA, data residency, SSO, SCIM, "email support
in under an hour" and "named deliverability engineer" are **deleted** — these are
contractual and service commitments, and there is no operation behind any of
them. Softening the wording would keep the commitment and lose only the clarity.

A "not yet" statement is kept rather than removing the subject entirely, because
pricing is a question every visitor arrives with and silence is not an answer.

**Delivered:** S2, e2ed495..4fbefa7.

### D4 — Engagement tracking deferred; PoC message states are exclusive

**Status:** deferred (later). **Resolves:** H9, H5.

PoC activity filters are message states, mutually exclusive, summing to the total:
`queued | delivered | bounced | deferred | suppressed`. Opens and clicks do not
exist in the PoC, and neither does the "to inbox" latency mini-stat.

When engagement lands it takes a **second axis**, not another chip in the same
row: engagement is a subset of `delivered`, and mixing an exclusive state
partition with a non-exclusive event count in one row is what made the shipped
counts fail to add up. It also needs pixel injection, a click-tracking domain and
a privacy stance — a subsystem, not a filter.

### D5 — SDKs deferred; TypeScript and Python, generated

**Status:** deferred (later). **Resolves:** H10.

Docs show `curl` and nothing else until a client library actually ships. The six
SDK chips and their published call signatures are deleted.

When SDKs land: **TypeScript/Node first, Python second**, and no others. Those
two cover the large majority of transactional-email integrators. They are
**generated from the OpenAPI document** produced in Phase 3, plus a small
hand-written wrapper for auth, retries and idempotency keys. No hand-maintained
clients — six hand-written SDKs is six copies of the contract, which is the
drift problem again in a more expensive form.

### D6 — SMTP relay deferred

**Status:** deferred (later). **Resolves:** H11.

`smtp.plume.email:587`, STARTTLS and "API key as password" come out of the
landing page and the docs. An SMTP ingress is a second product with its own
authentication, parsing, rate limiting and abuse surface; it is not a line of
copy.

### D7 — Idempotency committed

**Status:** committed (PoC). **Resolves:** H14.

`POST /v2/send` accepts an `idempotency_key`. A repeat within **24 hours**
returns the original result rather than sending again. Enforced at the outbox
write, where the uniqueness constraint already has to exist.

Committed despite being PoC scope because it is nearly free at the write and
expensive to retrofit: without it, every client retry is a duplicate email, and
adding it later means reprocessing history to find the duplicates it should have
prevented.

### D8 — Batch send deferred

**Status:** deferred (later). **Resolves:** H13.

The "500 messages per call" rate-limit line is removed. The endpoint it limits
was never defined.

### D9 — Webhooks committed, with a specified signature

**Status:** committed (PoC) / cut / deferred. **Resolves:** H15, H16, H17.

- **Signing — committed.** `Plume-Signature: t=<unix>,v1=<hex>`, where `v1` is
  HMAC-SHA256 over `<t>.<raw body>` with the endpoint's secret. Receivers reject
  a timestamp outside a **5-minute** window (replay defence) and compare in
  constant time. Secrets are rotatable, with two valid concurrently during
  rotation. Shipping the header shape without the algorithm, the window and the
  rotation story is shipping an unimplementable security feature.
- **Retries — committed.** Exponential backoff, capped attempts, dead-lettered
  after the cap, visible in the console.
- **`domain.record_drift` — cut.** It implies a continuous per-domain DNS watcher:
  a scheduler, a resolver budget, and a flapping policy. Not acknowledged
  anywhere, not built, and not needed to verify a domain once.
- **Replay API — deferred.** "Replayed into your endpoint after an outage" is
  removed from the landing page until an endpoint, a retention decision and a UI
  exist.

### D10 — `trace_url` cut

**Status:** cut. **Resolves:** H12.

`https://plume.email/t/01J8K2QF7ZP` is removed from the send response. As
written it is an unauthenticated URL to a customer's message metadata: the auth
model was never stated, so by omission the link is public. Message traces live
behind console authentication, on the message detail screen.

### D11 — The API returns raw values; the frontend owns presentation

**Status:** committed (PoC). **Resolves:** H35.

The API returns numbers, ISO-8601 timestamps and lowercase enum members. Colour,
gradients, relative time ("2 min ago"), key masking and syntax tokenisation are
computed at the render site.

The mock modules currently hold hex colours, gradient tokens, pre-tokenised JSON
and relative timestamps, none of which any API can produce. The alternative —
serving presentation from the API — bakes today's visual design into a public
contract permanently, and makes a colour change a breaking API change.

**Delivered:** S2, e2ed495..4fbefa7.

### D12 — Template versions pin with `@n`; slugs are immutable

**Status:** committed (PoC). **Resolves:** H23.

A template has a stable slug and an integer version: `receipt@14`. The slug never
carries the version, so `receipt-v3` becomes `receipt`. Both mechanisms shipped
simultaneously and disagreed about the number.

**Delivered:** S2, e2ed495..4fbefa7.

### D13 — Fabricated metrics deleted; sample data labelled

**Status:** cut. **Resolves:** H1, H2, H3, H4, H5, H6.

Deleted: 99.31% median delivery rate, 180 ms p95, 4.1B messages sent in 2026,
`202` rendered as a mini-stat, 412 ms "to inbox", and the per-provider reputation
rates on the landing page. No message has ever been sent; there is nothing to
have measured.

The landing page states capability, not measurement. Console figures survive as
sample data only under an explicit **demo project** label. The duplicated
provider rates (H6) and the duplicated 99.31% (H1) are the claim rule's own
evidence: the same fabricated number was presented as both a fleet statistic and
a single project's KPI.

**Delivered:** S2, e2ed495..4fbefa7.

### D14 — Derived numbers are derived

**Status:** committed (PoC). **Resolves:** H8, H9.

Nav badge counts, filter counts and totals are computed from the collection they
describe. None is typed by hand. Today `Templates 24` labels six templates,
`Suppressions 1.2k` labels a stated 1,204 against eight rows, and the activity
filter counts miss 46 messages.

**Delivered:** S2, e2ed495..4fbefa7.

### D15 — Every control is real or absent

**Status:** committed (PoC) / cut. **Resolves:** H18, H21, H29, H30, H31, H32, H33, H34.

Made real, client-side: the `24h / 7d / 30d` range switcher (threaded through to
the data accessors — the same seam the API will use), docs search (an in-memory
filter over the docs sections), and `⌘K` (a keydown listener that focuses the
field).

Made real as a form: the landing email capture becomes a `<form>`; until a signup
endpoint exists it is disabled with a label saying so. There is currently no
`<form>` element anywhere in the app.

Removed: "Export CSV", `href="#"` nav links, the footer links to Status, Security,
Support and API reference, and the "rolls back in one click" template claim — no
such control exists.

Nothing ships that looks interactive and is not. Dishonest affordances are the
same failure as dishonest numbers, expressed in JSX.

**Delivered:** S2, e2ed495..4fbefa7.

### D16 — One activity window

**Status:** committed (PoC). **Resolves:** H26.

The range switcher is the only window control, and `range` is a real parameter
carried to the data layer and later to `GET /v2/messages`. The "last 24 hours"
page blurb, which contradicted the switcher, is removed.

**Delivered:** S2, e2ed495..4fbefa7.

### D17 — Audit categories derive from the audit event enum

**Status:** committed (PoC). **Resolves:** H27.

Every category a row can carry is selectable. Today `Suppressions` rows exist and
no filter can reach them, and the contract inherited the unreachable member.

**Delivered:** S2, e2ed495..4fbefa7.

### D18 — Public metrics endpoint is `GET /v2/public/metrics`

**Status:** committed (PoC). **Resolves:** H28.

The mock's `GET /v2/public/landing` header comment is corrected.

**Delivered:** S2, e2ed495..4fbefa7.

### D19 — A data seam and four guard tests

**Status:** committed (PoC). **Resolves:** H36.

Every page reads through `lib/api.ts` (one module per resource, async, returning
mocks today). No page imports `lib/mock/*` after that. Four tests:

1. **Enum consistency** — every `stream`, `status` and `category` in the data is
   in the enum, and every enum member is reachable by some filter (D1, D17).
2. **Totals** — badge and filter counts reconcile with the data they label (D14).
3. **No dead controls** — every rendered `<button>` has a handler and every `<a>`
   a real href (D15).
4. **Claims** — product copy contains no number or promise absent from this file.

The fourth is the fix for the root cause. The app currently has no tests, no
`fetch`, and no API client of any kind.

**Delivered:** S2, e2ed495..4fbefa7.

### D20 — The contract generator is byte-exact, checked in CI

**Status:** committed (PoC). **Resolves:** H37.

`scripts/build-contracts.py` output must equal the committed `API_CONTRACTS.md`
byte for byte, and CI fails on a difference. Today regenerating produces 26 lines
of diff because the committed copy is Prettier-formatted, so nobody regenerates
the file that is supposed to be generated.

## Disposition of the hallucination register

Every entry from `FRONTEND_REMEDIATION_PLAN.md` §1, with the decision that
resolves it and the action taken.

| H   | Claim                              | Decision | Action  |
| --- | ---------------------------------- | -------- | ------- |
| H1  | 99.31% median delivery rate        | D13      | delete  |
| H2  | 180 ms API p95                     | D13      | delete  |
| H3  | 4.1B messages sent in 2026         | D13      | delete  |
| H4  | `202` as a mini-stat               | D13      | delete  |
| H5  | 412 ms "to inbox"                  | D13, D4  | delete  |
| H6  | Per-provider reputation rates      | D13      | delete  |
| H7  | 1.36M of 2M sends quota            | D2       | delete  |
| H8  | Nav badges 24 / 1.2k               | D14      | derive  |
| H9  | Activity filter counts             | D14, D4  | derive  |
| H10 | Six client SDKs                    | D5       | defer   |
| H11 | SMTP relay                         | D6       | defer   |
| H12 | `trace_url`                        | D10      | delete  |
| H13 | Batch send, 500 per call           | D8       | defer   |
| H14 | Idempotency                        | D7       | build   |
| H15 | Webhook signature                  | D9       | build   |
| H16 | `domain.record_drift`              | D9       | delete  |
| H17 | Webhook replay                     | D9       | defer   |
| H18 | Template "one-click rollback"      | D15      | delete  |
| H19 | SLA, data residency, SSO, SCIM     | D3       | delete  |
| H20 | Support response commitments       | D3       | delete  |
| H21 | Footer links to four missing pages | D15      | delete  |
| H22 | Stream enum, three-way conflict    | D1       | rewrite |
| H23 | Template versioning, two syntaxes  | D12      | rewrite |
| H24 | Retention, three values            | D2       | rewrite |
| H25 | Rate limit vs quota                | D2       | rewrite |
| H26 | Activity window conflict           | D16      | rewrite |
| H27 | Unreachable audit category         | D17      | derive  |
| H28 | `landing` vs `metrics` endpoint    | D18      | rewrite |
| H29 | Range switcher with no consumer    | D15, D16 | build   |
| H30 | Docs search and `⌘K`               | D15      | build   |
| H31 | Landing email capture              | D15      | build   |
| H32 | `href="#"` nav links               | D15      | delete  |
| H33 | "Export CSV"                       | D15      | delete  |
| H34 | Missing console write controls     | D15      | delete  |
| H35 | Presentation baked into data       | D11      | rewrite |
| H36 | No tests, no API seam              | D19      | build   |
| H37 | Contract generator drift           | D20      | build   |

Exit criterion met: every H-number above carries a decision and a status.
