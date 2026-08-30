# API_CONTRACTS.md audit — Plume (`email-send/`) backend plan

> **Superseded in part — read `FRONTEND_REMEDIATION_PLAN.md` §0 first.**
> This audit judged the contract against `lib/mock/*.ts` and the docs page,
> treating them as the specification. They are unverified Claude-generated
> output. Two findings are wrong as a result: §1.3 "write paths missing" (the
> console has no write controls at all — those contract endpoints are invented,
> not lagging), and §1.1's use of the docs page as proof of what the send API
> is. The rest stands.

Scope: is `API_CONTRACTS.md` sufficient as the plan for building the Plume
backend and wiring the frontend to it? Then: how it sits against section **B)
Transactional / bulk email API** of `email-platforms-architecture.html`.

Verdict: **usable as a read-model contract for the console UI, not usable as a
backend plan.** The product's actual product surface — the send API — is absent
from the contract, and the console frontend is not written against these shapes.

---

## 1. Blocking gaps

### 1.1 `POST /v2/send` is not in the contract

The whole product is a send API. It appears in three places in the frontend
(`lib/mock/landing.ts:13`, `lib/mock/docs.ts:29`, `lib/mock/console.ts` SNIPPET)
and gets a full docs section with request fields, response, streams, idempotency
and errors (`lib/mock/docs.ts:82-110,180-260`) — but `API_CONTRACTS.md` never
specifies it. Everything the docs page publishes as a contract to customers is
undocumented for the team building it:

| Documented in docs page                                                                                                                     | In API_CONTRACTS.md                    |
| ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| `POST /v2/send` request (`from`, `to`, `template`, `vars`, `html/text`, `stream`, `idempotency_key`, `attachments` ≤10 MB)                  | no                                     |
| Send response (`status: queued`, `template: receipt-v3@14`, `trace_url`)                                                                    | no                                     |
| Batch send (500 messages/call, `RATE_LIMITS`)                                                                                               | no                                     |
| Webhook delivery + `Plume-Signature: t=…,v1=…` HMAC                                                                                         | no                                     |
| 9 webhook event types (`message.queued` … `domain.record_drift`)                                                                            | no                                     |
| Error codes `invalid_request`, `invalid_key`, `domain_unverified`, `suppressed_recipient`, `template_vars_mismatch`, `upstream_unavailable` | no — console uses a different envelope |
| Rate limits 100/s free, 1000/s scale, 24 h idempotency window                                                                               | no                                     |
| SMTP relay `smtp.plume.email:587` STARTTLS                                                                                                  | no                                     |
| SDKs (node, python, go, ruby, php, rust)                                                                                                    | no                                     |

The contract calls itself "Backend handoff for both products". It is not — it is
a handoff for the console's read screens.

### 1.2 No authentication for the console

`POST /v2/public/signup` exists. There is no sign-in, no session issue/refresh,
no logout, no verification-link redemption, no project list, no member/role
endpoints — yet every console endpoint is specified as "requires a session
(console cookie)" and `403 forbidden (role lacks the scope)". Pane specifies its
full auth surface (`/v1/auth/signin`, OAuth, WebAuthn); Plume specifies none.
Also no source for `{projectId}` — the sidebar picks a project but nothing lists
projects.

### 1.3 Write paths are stubs or missing

- Templates: read-only. No create/update/publish, despite `Template published`
  being an audited action (`lib/mock/console.ts` AUDIT).
- Domains: add/verify mentioned in one sentence, "not yet wired to a screen" —
  but the Domains screen renders a Pending domain with waiting DKIM/DMARC, which
  is exactly the verify flow.
- Members/roles: audited (`Member invited`, `Role changed`) but no endpoints.
- Settings changes: audited (`DMARC policy → quarantine`) but no endpoint.
- Suppressions: manual add missing (only DELETE).

### 1.4 The frontend is not written against these shapes

No component fetches anything: zero `fetch(` and zero `NEXT_PUBLIC_*` in
`email-send/frontend`. Integration is not "swap the mock module"; the mock
shapes and the contract shapes are different data models:

| Contract                                                                                     | Mock actually consumed by UI                                                                                               |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `quota: {used, limit, pct, resetsAt}`                                                        | `quota: {usedLabel: "1.36M of 2M sends · resets 1 Sep", pct}` — one prebuilt string                                        |
| KPI `{key, label, value, delta, direction, sentiment, spark[]}`                              | `{label, value, delta, deltaColor: "#0e8f80", dip}` — hex colour + `dip` flag, spark computed client-side by `sparkBars()` |
| timeseries fractions `0.72`                                                                  | `"58%"` strings from `deliverySeries()`                                                                                    |
| `streams[].{count: number, share: 1.0}`                                                      | `{count: "642,118", pct: "100%", tint: <gradient>}`                                                                        |
| reputation `{provider, label, score, state}`                                                 | `{label, value, color: "#0e8f80"}`                                                                                         |
| status `delivered\|opened\|bounced\|deferred`                                                | `"Delivered"\|"Opened"\|…` capitalised, keys of `STATUS_TINT`                                                              |
| message trace `{step, label, detail, state, at}`                                             | `{step, detail, dot, line}` — colours, no state                                                                            |
| `payload` object, client pretty-prints                                                       | pre-tokenised `{line, color}[]` array                                                                                      |
| domains `state: "verified"`, records `{type: "RETURN_PATH", expected, observed, checkedAt}`  | `state: "Verified"`, `{type: "Return-Path", value, ok}`                                                                    |
| keys `{id, name, prefix, last4, scope: "full", environment, lastUsedAt}`                     | `{name, token: "plume_live_sk_9f2b••••••••4c71", scope: "Full access", used: "2 min ago"}`                                 |
| audit `{actor:{type,label}, action, actionLabel, target, source:{ip,channel}, at, category}` | `{actor, action, target, source: "203.0.113.24 · Console", when: "9:44 · today", category, tint}`                          |

Two systemic decisions are unresolved and they contradict each other inside the
same file: the contract says the backend pre-formats numbers ("the frontend does
not localise"), but the mocks pre-format **presentation** too — colours,
gradients, tint tokens, relative timestamps ("2 min ago", "Yesterday 17:30").
Someone has to decide where the presentation layer lives, and either way every
console page needs rewriting. That work is not acknowledged anywhere.

### 1.5 Enum drift the contract will break on

- Audit `category` enum omits `suppressions`… no, it includes it — but the UI's
  `AUDIT_CATEGORIES` omits `Suppressions` while `AUDIT` contains a
  `Suppressions` row, so that event is silently unfilterable today. Contract
  inherits the bug.
- Docs streams are `transactional | notifications | bulk`
  (`lib/mock/docs.ts` DOC_STREAMS); console mock streams include `broadcast`
  and `receipts`. Contract treats `stream` as a free string. Pick one.
- `lib/mock/landing.ts:1` names `GET /v2/public/landing`; contract says
  `GET /v2/public/metrics`. Stale pointer.

### 1.6 Smaller correctness notes

- Landing `providers[]` carries both `rate: "98.7%"` and `pct: "99%"` — two
  representations of one number; drop `pct`, it's a CSS width.
- `POST /v2/public/signup` `409 already_registered` returning a body while being
  an error status forces the client to treat 409 as success. Make it `202` with
  a status field, or accept that the "errors" section lies.
- Audit export returns `202` + mailed link, but the response body is unspecified
  (job id shape? poll endpoint? none exists).
- `messages` `counts` "must reflect the whole window" — no window parameter
  exists on that endpoint (`range` is absent), so "the window" is undefined.
- No pagination on templates, domains, keys, reputation — fine now, unbounded
  later.
- No `Idempotency-Key` handling on any mutating console endpoint.
- Generator drift: `python3 scripts/build-contracts.py` rewrites
  `API_CONTRACTS.md` with 26 changed lines against the committed copy (the
  committed file is Prettier-formatted, the generator output is not). Anyone
  following the "rebuild it rather than editing here" instruction produces a
  dirty diff. Add the formatter to the script or a check to CI.

---

## 2. What the contract gets right

- One file per page, generated, with an ADR behind the format (ADR-0003) — the
  drift risk between screen and contract is structurally handled.
- Failure semantics stated per endpoint, including which failures are non-fatal
  and render bundled fallbacks. Rare and valuable.
- Security calls that belong to the backend are named as backend duties:
  key shown once then hashed, identical response for unknown-email vs
  wrong-password, sanitise `bodyHtml` server-side, host status page separately.
- Explicitly invites pushback ("Nothing below is implemented"). Correct posture.

---

## 3. Against B) in `email-platforms-architecture.html`

B describes an accept-then-deliver pipeline: `POST /send` validates tenant,
template and suppression list, writes an outbox row, returns `202`; workers pull
from Kafka/NATS, sign DKIM, hand to Postfix/Haraka with an IP pool manager;
bounce/complaint webhooks feed the suppression list; ClickHouse stores events and
forwards tenant webhooks via the outbox pattern again.

**Where they agree**

- `202` accept semantics. Architecture B's `API-->>Tenant: 202 accepted` matches
  the docs page's `→ 202 { "id": … }` and `"status": "queued"`.
- Suppression enforced in the accept path (B's ADR candidate) is exactly the
  docs' `409 suppressed_recipient` on the send call.
- Event vocabulary lines up: sent/opened/clicked/bounced/complained in B vs the
  9 `WEBHOOK_EVENTS`.
- Tenant webhook delivery in B ↔ `Plume-Signature` webhooks in the docs.
- Per-tenant rate limiting in B's `A2` ↔ the plan's `RATE_LIMITS` and
  `429 rate_limited`.

**Where the contract has nothing to say**

- The entire delivery half of B: queue, workers, MTA, IP pool/warmup, retries.
  Not the contract's job, but it means the contract covers roughly the accept
  path's _console_ and none of B's deep module.
- B's ClickHouse event store is the source for every console read endpoint
  (`/messages`, `/metrics`, `/metrics/timeseries`, `/streams`, `/reputation`).
  The contract specifies these as if they were plain reads and never states the
  consistency window. On an event store fed asynchronously, "a message just
  accepted" will not be in `/messages` for some seconds. The UI has no
  pending/unknown state for that. **This is the one real architectural conflict.**
- `/reputation` per-provider scores map to B's Postmaster/SNDS feedback, which B
  correctly flags as external state on a slow loop. The contract presents them as
  a fresh read with no `asOf` timestamp. Add one.
- B: "feedback loop (bounce → suppression) must be synchronous enough to block
  re-sends". The contract's `DELETE /suppressions/{address}` lets the console
  race that loop, and the contract punts the complaint-removal policy to "a
  backend policy call". Under B, removing a complaint suppression is a
  compliance violation, not a preference. Decide it now: refuse it.
- B's dedicated IPs / IP pool manager surfaces nothing in the console — no IP
  pool screen, no warmup progress, no per-pool reputation. For a SendGrid
  competitor that is a missing product surface, not just a missing endpoint.
- Idempotency (24 h window, per docs) is an accept-path property in B's outbox
  write. The contract never mentions it.
- `/v2/projects/{projectId}` is the only tenancy primitive; B says "per
  tenant/IP" pools. Project ↔ tenant ↔ IP pool relation is undefined.

**Verdict on fit:** no contradiction of B's shape, but the contract sits entirely
on B's left-hand accept box plus a read model over B's ClickHouse. Use B for
build order; the contract cannot drive it.

---

## 4. What to add before this is a plan

1. `email-send/frontend/app/docs/docs.contract.md` currently claims only search
   needs the backend. It should carry the **public API contract** the docs page
   already publishes: `POST /v2/send`, batch, webhooks + signature scheme, the
   `API_ERRORS` table, rate limits, idempotency, SMTP relay. That is the product.
2. A `console-auth.contract.md`: signin, session, verification redemption,
   project list, members and roles.
3. Write paths: template publish, domain add/verify, member invite, settings,
   suppression add.
4. One decision, written down: **who owns presentation** — pre-formatted strings
   and colours from the backend, or raw values plus a frontend format layer.
   Then budget the console-page rewrite that follows either way. Today's console
   cannot consume today's contract.
5. Staleness/consistency: `asOf` on `/reputation` and `/metrics`, and a stated
   eventual-consistency window on `/messages` given B's async event store.
6. Fix `lib/mock/landing.ts:1` (`/v2/public/landing`), the `Suppressions` audit
   category gap, the stream enum split, and make `build-contracts.py` output
   byte-identical to the committed file.
