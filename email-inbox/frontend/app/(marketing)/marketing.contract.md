
# Pane — Marketing site (`/`, `/product`, `/security`, `/pricing`, `/changelog`, `/privacy`, `/terms`, `/status`, `/support`, `/careers`, `/signin`, `/signup`)

Most of this site is static copy compiled into the bundle: product, security,
privacy, terms, support answers and the careers perks never call the backend.
Four things do.

## Landing hero numbers — `GET /v1/public/metrics`

Public, cacheable. Non-fatal: the page renders the bundled fallback in
`lib/mock/marketing.ts` if the call fails.

```jsonc
{
  "stats": [
    { "value": "2.4 h", "label": "Median reply time" },
    { "value": "61%", "label": "Less inbox noise" },
    { "value": "15 GB", "label": "Free storage" }
  ]
}
```

Values arrive pre-formatted; the frontend does not compute or localise them.

## Changelog — `GET /v1/public/changelog`

Query: `limit` (default 10), `cursor`.

```jsonc
{
  "releases": [
    {
      "version": "3.4",
      "releasedAt": "2026-08-22",
      "kind": "feature" | "improvement" | "fix" | "release",
      "title": "Codes lane and auto-archive",
      "items": ["One-time passcodes now route to their own lane…"]
    }
  ],
  "nextCursor": null
}
```

`kind` selects the tag colour; the UI has no other mapping, so a new value must
come with a design decision.

## Status — `GET /v1/public/status`

Public, no auth, refreshed by the client every 30 seconds.

```jsonc
{
  "overall": "operational" | "degraded" | "outage",
  "services": [
    {
      "key": "mail_delivery",
      "name": "Mail delivery",
      "note": "Inbound and outbound SMTP",
      "state": "operational" | "degraded" | "outage",
      "uptime90d": 0.9999,
      "history": [1, 1, 1, 0.4] // one entry per day, 90 max, 0–1
    }
  ],
  "incidents": [
    {
      "id": "inc_01H8...",
      "date": "2026-08-19",
      "severity": "minor" | "major",
      "title": "Search indexing lag",
      "body": "New mail took up to four minutes…",
      "durationMinutes": 72,
      "resolvedAt": "2026-08-19T11:12:00Z"
    }
  ]
}
```

`history` drives the uptime strip. The UI renders at most the last 34 entries on
desktop and hides the strip on mobile, so the array may be trimmed server-side.

This endpoint must be servable when the main app is down — it is the page people
open during an outage. Host it separately from the application backend.

## Careers — `GET /v1/public/roles`

```jsonc
{
  "roles": [
    {
      "id": "role_01H8...",
      "title": "Senior product engineer",
      "team": "Engineering",
      "location": "Remote (Europe)",
      "salaryRange": "£95k–£125k",
      "applyUrl": "https://jobs.pane.com/senior-product-engineer"
    }
  ]
}
```

Roles link out to an external applicant tracker; the mock currently points them
at `/support`.

## Sign up — `POST /v1/auth/signup`

```jsonc
{
  "name": "Maya Lindqvist",
  "email": "you@company.com",
  "password": "…", // min 12 characters, checked server-side
  "plan": "free" | "personal" | "team"
}
```

Response `201`: `{ "status": "verification_sent" }`. The client never receives a
session from this call — the account activates from the emailed link.

Errors: `400 invalid_email`, `400 weak_password` (with the failed rule named),
`409 email_taken`, `429 rate_limited`.

## Sign in — `POST /v1/auth/signin`

```jsonc
{ "email": "you@company.com", "password": "…" }
```

Response `200` sets an httpOnly session cookie and returns:

```jsonc
{ "user": { "id": "usr_…", "name": "Maya Lindqvist", "email": "…" } }
```

Errors: `401 invalid_credentials` (identical response for unknown email and
wrong password — do not disclose which), `403 mfa_required` with
`{ "challenge": "webauthn", "options": { … } }`, `429 rate_limited`.

## OAuth and passkeys

The two provider buttons start flows rather than posting credentials:

- `GET /v1/auth/oauth/google/start?redirect=/mail` → `302` to Google.
- `POST /v1/auth/webauthn/challenge` → WebAuthn request options; the browser
  signs and the client posts the assertion to
  `POST /v1/auth/webauthn/verify`.

Both land on `/mail` on success. Passwords are never sent to any endpoint other
than `/v1/auth/signin` and `/v1/auth/signup`, both over TLS.
