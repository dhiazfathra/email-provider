# ADR-0010: Webhook signing scheme and send idempotency

- Status: Accepted
- Date: 2026-08-30
- Related: [ADR-0003](0003-api-contract-format.md), [ADR-0009](0009-poc-scope-no-billing-metering-or-engagement.md)

## Context

The docs page shipped a webhook sample carrying `Plume-Signature: t=…,v1=…` and
a list of nine event types, and referenced an `idempotency_key` with a 24-hour
window. None of it was specified anywhere: no algorithm, no signing payload, no
secret rotation story, no replay window, and no mention in `API_CONTRACTS.md`.

A signature header without those five things is not a security feature; it is a
header. An integrator implementing against the sample would have had to guess the
algorithm, and any guess that verifies is trivially forgeable if the timestamp is
unchecked.

One of the nine event types, `domain.record_drift`, implies a continuous
per-domain DNS watcher — a scheduler, a resolver budget and a flapping policy —
that no part of the architecture acknowledges.

## Decision

**Signing.** `Plume-Signature: t=<unix-seconds>,v1=<hex>` where `v1` is
HMAC-SHA256 over `<t>.<raw request body>` using the endpoint's secret, compared in
constant time. Receivers reject a timestamp more than **5 minutes** from now.
Secrets are rotatable, with two valid concurrently during rotation. The signed
input is the raw body, before any JSON parsing or re-serialisation.

**Delivery.** Exponential backoff with a capped attempt count; exhausted
deliveries are dead-lettered and visible in the console.

**Idempotency.** `POST /v2/send` accepts an `idempotency_key`. A repeat within
24 hours returns the original result instead of sending again, enforced by a
uniqueness constraint at the outbox write.

**`domain.record_drift` is cut.** **Webhook replay is deferred** — the landing
copy promising replay after an outage is removed until an endpoint, a retention
decision and a UI exist.

## Alternatives Considered

### Signature over the parsed-and-re-serialised body

- Rejected: key ordering and whitespace differ between serialisers, so the
  receiver cannot reliably reproduce the bytes the sender signed.

### No timestamp, signature only

- Pros: simpler header
- Rejected: a captured request replays forever. The timestamp inside the signed
  payload is what bounds it.

### Idempotency deferred with everything else in the PoC

- Rejected: cheap now, expensive later. Retrofitting means reprocessing history
  to find the duplicates it should have prevented, and duplicate transactional
  email is user-visible harm.

### Keep DNS drift monitoring

- Rejected: a background watcher over every customer domain is a system, and it
  was implied by one line of an events list. Verification at add time covers the
  PoC need.

## Consequences

- The webhook contract can be implemented by an integrator without asking us
  anything, which was the actual test the shipped version failed.
- Secret rotation must exist in the console before webhooks are advertised.
- The outbox write becomes the enforcement point for idempotency, so it needs the
  uniqueness constraint from day one of the backend accept path.
