# Plume remediation — decomposition and Spec 1 (product decisions)

Date: 2026-08-30
Source: [`FRONTEND_REMEDIATION_PLAN.md`](../../../FRONTEND_REMEDIATION_PLAN.md)

## Problem

The Plume frontend shipped as a complete-looking product built from Claude
design output that was never verified. Fiction was written into three layers —
marketing copy, the docs page and console mock data — independently, so the
layers contradict each other; `API_CONTRACTS.md` was then generated from the
fiction and inherited it. Thirty-seven distinct defects are catalogued in the
plan's hallucination register: fabricated metrics, an invented second ingress
protocol, contractual commitments in marketing copy, three mutually exclusive
stream enums, and controls that render as interactive and do nothing.

Fixing the contract first would re-launder the same claims. The order is:
decisions, then frontend, then contract, then backend.

## Decomposition

The work is four specs, strictly sequential — each consumes the previous one's
output as its source of truth.

| Spec                       | Output                                                        | Depends on |
| -------------------------- | ------------------------------------------------------------- | ---------- |
| **S1 — Product decisions** | `email-send/PRODUCT_DECISIONS.md`                             | —          |
| **S2 — Frontend truthing** | Truthful frontend, `lib/api.ts` seam, four guard tests        | S1         |
| **S3 — Contract rewrite**  | `API_CONTRACTS.md`, `send.contract.md`, auth surface, OpenAPI | S2         |
| **S4 — Backend**           | Accept path, delivery, event store, tenant webhooks           | S3         |

This document specifies **S1**. S2–S4 get their own specs.

## Scope of the proof of concept

No billing, no metering, no payment integration. That constraint decides several
otherwise-open questions (see D2, D3 in the register) and is recorded in the
output file rather than here, so that a reader of the decisions never has to find
this spec.

## S1: what it produces

One file, `email-send/PRODUCT_DECISIONS.md`, structured as:

1. **Reading rules** — the three statuses (`committed`, `deferred`, `cut`) and
   the rule that the file outranks any copy, mock or contract that disagrees.
2. **The claim rule** — a claim exists in exactly one place; a value needed twice
   is imported from one module.
3. **PoC boundary** — what is explicitly out of scope, each pointing at the
   decision that put it there.
4. **Decisions D1–D20** — each with status, the H-numbers it resolves, and the
   reasoning. The reasoning is the point: a status with no _why_ gets re-litigated
   in three months, which is how the register grew in the first place.
5. **Disposition table** — all of H1–H37, each mapped to its deciding decision
   and an action verb (`delete` / `rewrite` / `derive` / `build` / `defer`).

## Interface: how S2 consumes it

The file is authority, not narrative, and one consumer is a test rather than a
person. Two structural requirements follow:

- **Committed limits live in one fenced block** (D2), in a fixed
  `key: value` shape. The Phase 2 claims test parses that block, not prose.
- **Every decision has a stable `Dn` identifier** and every register entry a
  stable `Hn`. S2's commits, S3's contract sections and S4's tickets cite them.

The claims test fails the build when product copy contains a number or a service
promise that does not appear in this file. That test — not the deletions — is the
fix for the root cause; the deletions clean up the instance, the test prevents
the class.

## Decisions in outline

D1 stream enum closed to `transactional | notifications | bulk`. D2 no plans, no
tiers, one limit set (100 sends/sec, 30-day retention, no quota, no billing).
D3 pricing page states pricing does not exist yet; SLA, residency, SSO, SCIM and
support-time commitments deleted. D4 engagement tracking deferred, PoC message
states exclusive. D5 SDKs deferred, then TypeScript and Python generated from
OpenAPI. D6 SMTP relay deferred. D7 idempotency committed. D8 batch send
deferred. D9 webhooks committed with HMAC-SHA256, 5-minute replay window and
rotation; DNS drift events cut; replay API deferred. D10 `trace_url` cut. D11 API
returns raw values, frontend owns presentation. D12 immutable slug plus `@n`
version pin. D13 fabricated metrics deleted, sample data labelled. D14 derived
numbers derived. D15 every control real or absent. D16 one activity window.
D17 audit categories derived from the event enum. D18 `GET /v2/public/metrics`.
D19 `lib/api.ts` seam and four guard tests. D20 byte-exact contract generator,
checked in CI.

Full text and reasoning: `email-send/PRODUCT_DECISIONS.md`.

## Rejected alternatives

- **Fix the contract first.** The contract's defects are inherited, not original.
  Rewriting it against unverified screens copies the fiction into the artifact the
  backend team builds from.
- **Soften the unbacked claims rather than delete them.** A softened SLA is still
  an SLA. Deletion is the only edit that removes the commitment.
- **Keep the plan tiers as "planned pricing".** Re-imports the quota-versus-rate
  contradiction the decision exists to remove, in exchange for cards nobody can
  buy.
- **One spec for all four phases.** The phases have different audiences and
  different definitions of done, and phase 2's data/presentation split alone is a
  multi-week body of work.

## Consequences

- The landing page loses its stat strip, its SDK row, its SMTP section and most
  of its pricing page. Sections that collapse without their fiction had no
  content.
- S2 becomes mechanical: each of H1–H37 has a decided action, so the frontend
  work is execution rather than judgement.
- S3 gains an exit criterion in both directions — every endpoint maps to a screen
  or a documented public commitment, and every screen's data need maps to an
  endpoint.
- Any future claim not in the decisions file fails CI. The cost is a real one:
  adding a number to marketing copy now requires editing a decision record first.
  That is the intended friction.

## Exit criteria for S1

- Every H1–H37 appears with a decision and a status.
- No `TBD`, no unresolved question, no decision without reasoning.
- The committed-limits block is machine-parseable.
- ADRs recorded for the decisions that outlive the PoC.
