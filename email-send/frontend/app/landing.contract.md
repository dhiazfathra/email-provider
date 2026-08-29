# Plume — Landing page (`/`)

Marketing page. Copy, features and plan descriptions are static and ship with the
bundle; only the numbers and the sign-up action need the backend.

## `GET /v2/public/metrics`

Fleet-wide numbers shown in the hero and the code-panel mini-stats. Public, no
auth. Cacheable — the UI treats it as advisory and renders the static fallback
in `lib/mock/landing.ts` if the call fails.

Response `200`:

```jsonc
{
  "hero": [
    { "value": "99.31%", "label": "Median delivery rate" },
    { "value": "180 ms", "label": "API p95 latency" },
    { "value": "4.1B", "label": "Messages sent in 2026" },
  ],
  "mini": [
    { "value": "202", "label": "Accepted" },
    { "value": "412 ms", "label": "To inbox" },
    { "value": "30 d", "label": "Event retention" },
  ],
  "providers": [
    { "name": "Gmail", "rate": "98.7%", "pct": "99%" },
    // pct is the bar fill width; rate is the displayed label
  ],
  "generatedAt": "2026-08-29T00:00:00Z",
}
```

Errors: any non-200 is non-fatal — render the bundled fallback.

## `POST /v2/public/signup`

The "Start" action on the bottom call-to-action and the "Get an API key" /
"Start sending free" buttons. Creates a pending account and mails a verification
link; it never returns a session or an API key directly.

Request:

```jsonc
{
  "email": "you@company.com",
  "plan": "free" | "scale" | "enterprise", // from the plan card clicked; defaults to "free"
  "source": "landing_hero" | "landing_cta" | "landing_pricing" | "landing_nav"
}
```

Response `202`:

```jsonc
{ "status": "verification_sent", "email": "you@company.com" }
```

Errors:

- `400 invalid_email` — malformed address.
- `409 already_registered` — returns `{ "status": "already_registered" }` and the
  UI routes to sign-in rather than showing an error.
- `429 rate_limited` — per-IP throttle; include `Retry-After`.

Enterprise selects "Talk to us" instead, which is a contact-form route, not this
endpoint.
