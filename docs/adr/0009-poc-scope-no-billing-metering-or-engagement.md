# ADR-0009: The proof of concept has no billing, metering or engagement tracking

- Status: Accepted
- Date: 2026-08-30
- Related: [ADR-0007](0007-product-decisions-as-single-source-of-truth.md)

## Context

Plume is being built as a proof of concept first. Payments are explicitly out of
scope, but the shipped frontend published a full commercial surface anyway: plan
tiers, a 3,000/month free quota, a 2M/month cap belonging to no plan, three
different retention values, a 100 sends/second rate limit sitting beside a
monthly quota it exceeds by five orders of magnitude, open-tracking metrics, an
SMTP relay, and six SDKs.

Each of those is a subsystem that was described but not decided. The activity
filter counts are the clearest symptom: `All 1,462 / Delivered 1,401 / Opened 892
/ Bounced 6 / Deferred 9` does not reconcile, because an exclusive partition of
delivery states and a non-exclusive engagement event were stacked in one row.
That is not an arithmetic slip; it is two unrelated concepts sharing a widget.

## Decision

The PoC ships one limit set and no commerce:

```yaml
send_rate_per_second: 100
activity_retention_days: 30
monthly_quota: none
billing: none
```

No plans, no tiers, no metering. The landing page's plan cards are deleted and
replaced by a statement that pricing does not exist yet (there is no `/pricing`
route; pricing was a section, and the `Pricing` nav entry was a dead link).

Deferred, in the decisions record, with their copy removed until they
ship: engagement tracking (opens and clicks), client SDKs, the SMTP relay, batch
send and webhook replay.

PoC activity filters are message states only — `queued | delivered | bounced |
deferred | suppressed` — mutually exclusive and summing to the total. When
engagement lands it takes a **second axis**, always a subset of `delivered`.

Idempotency is the one exception to "defer what is not needed": it is committed
now, because it is nearly free at the outbox write and expensive to retrofit.
Without it, every client retry is a duplicate email.

## Alternatives Considered

### Two plans (free tier plus usage), numbers softened

- Pros: keeps the pricing page that exists; a rate and a quota can be made
  consistent with each other
- Rejected: with no metering there is nothing to enforce a quota, so the tiers
  are decoration that must nonetheless be kept consistent across three surfaces
  forever.

### Keep the engagement filters, define the overlap in prose

- Pros: no UI change
- Rejected: the counts still visibly fail to add up for any reader, and it
  commits the product to open tracking — pixel injection, a click-tracking
  domain, and a privacy stance nobody has taken.

### Cut the deferred features outright rather than deferring them

- Rejected: SMTP, SDKs and engagement are wanted, just not now. `deferred` and
  `cut` are different statuses precisely so the record distinguishes "not yet"
  from "never" — but both delete the copy today.

## Consequences

- Rate limit and quota can no longer contradict each other, because there is only
  one of them.
- Retention is a single number in a single module, read by every surface.
- Engagement returning later is a UI change (a second axis) plus a subsystem, not
  a filter chip — the decision record says so, so the shape is not re-litigated.
- When billing arrives, tiers must be introduced with metering in the same change.
