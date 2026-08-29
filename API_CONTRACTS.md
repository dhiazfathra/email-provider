# API contracts

Backend handoff for both products. The frontends run on mock data; these are the
endpoints they are written against.

**This file is generated.** The source of truth is the `*.contract.md` file
beside each page ([ADR-0003](docs/adr/0003-api-contract-format.md)). Rebuild it
with `scripts/build-contracts.py` rather than editing here.

Nothing below is implemented. Treat every shape as a proposal the Go team can
push back on.

## Contents

- **Plume — email-send**
  - [Landing page](#plume-landing-page) — `email-send/frontend/app/landing.contract.md`
  - [Console](#plume-console) — `email-send/frontend/app/console/console.contract.md`
  - [Docs](#plume-docs) — `email-send/frontend/app/docs/docs.contract.md`
- **Pane — email-inbox**
  - [Marketing site](#pane-marketing-site) — `email-inbox/frontend/app/(marketing)/marketing.contract.md`
  - [Mail app](#pane-mail-app) — `email-inbox/frontend/app/mail/mail.contract.md`

---

# Plume — email-send

## Plume Landing page

_Source: `email-send/frontend/app/landing.contract.md`_

Marketing page. Copy, features and plan descriptions are static and ship with the
bundle; only the numbers and the sign-up action need the backend.

#### `GET /v2/public/metrics`

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

#### `POST /v2/public/signup`

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

## Plume Console

_Source: `email-send/frontend/app/console/console.contract.md`_

Every endpoint requires a session (console cookie) or a read-scoped API key, and
is scoped to one project. `{projectId}` is the project selected in the sidebar.
Time ranges use `range=24h|7d|30d`.

Standard error envelope for all console endpoints:

```jsonc
{ "error": { "code": "not_found", "message": "No such project." } }
```

`401 unauthorized`, `403 forbidden` (role lacks the scope), `404 not_found` and
`429 rate_limited` apply to every endpoint below and are not repeated per
section.

#### Shell — `GET /v2/projects/{projectId}`

Sidebar project card and monthly quota bar. Called once per console page load.

```jsonc
{
  "id": "prj_01H8...",
  "name": "Harbor",
  "environment": "prod",
  "initial": "H",
  "quota": {
    "used": 1360000,
    "limit": 2000000,
    "pct": 68,
    "resetsAt": "2026-09-01T00:00:00Z",
  },
}
```

The UI renders `pct` directly; it does not recompute from used/limit, so the
backend owns rounding.

#### Overview — `GET /v2/projects/{projectId}/metrics?range=7d`

The four KPI cards, plus the sparkline behind each.

```jsonc
{
  "range": "7d",
  "kpis": [
    {
      "key": "sent",
      "label": "Sent",
      "value": "1,362,004",
      "delta": "+8.4%",
      "direction": "up" | "down",
      "sentiment": "good" | "bad", // drives the delta colour
      "spark": [12, 18, 25, 9] // relative bar heights, 16–22 points
    }
  ]
}
```

Keys are fixed: `sent`, `delivered`, `bounced`, `complaints`. `value` and
`delta` arrive pre-formatted — the frontend does not localise numbers.

#### Overview — `GET /v2/projects/{projectId}/metrics/timeseries?range=7d&buckets=14`

Stacked delivery chart. `buckets` is a hint (7 on mobile, 14 on desktop); the
backend may return fewer.

```jsonc
{
  "buckets": [
    {
      "label": "15",
      "delivered": 0.72,
      "opened": 0.19,
      "bounced": 0.03, // fractions of the bucket total, 0–1
    },
  ],
}
```

#### Overview — `GET /v2/projects/{projectId}/streams?range=7d`

Top-streams card, ordered by volume descending, max 8.

```jsonc
{
  "streams": [{ "name": "transactional", "count": 642118, "share": 1.0 }],
}
```

`share` is relative to the largest stream, not to the total — it is a bar width.

#### Overview — `GET /v2/projects/{projectId}/reputation`

```jsonc
{
  "providers": [
    { "provider": "gmail", "label": "Gmail", "score": 98.7, "state": "good" },
  ],
}
```

`state` is `good` | `watch` | `poor` and selects the dot and score colour.

#### Activity — `GET /v2/projects/{projectId}/messages`

Query: `status` (`delivered|opened|bounced|deferred`, omit for all), `stream`,
`limit` (default 50, max 200), `cursor`.

```jsonc
{
  "messages": [
    {
      "id": "msg_01J8K2QF7ZP",
      "to": "ana.ferreira@northloop.io",
      "subject": "Your Harbor receipt #48213",
      "stream": "receipts",
      "status": "delivered",
      "acceptedAt": "2026-08-29T09:41:02Z",
    },
  ],
  "counts": {
    "all": 1462,
    "delivered": 1401,
    "opened": 892,
    "bounced": 6,
    "deferred": 9,
  },
  "nextCursor": "eyJ0IjoiMjAyNi0...",
}
```

`counts` drives the filter chips and must reflect the whole window, not the
current page.

#### Activity — `GET /v2/projects/{projectId}/messages/{messageId}`

The expanded trace panel under the table.

```jsonc
{
  "id": "msg_01J8K2QF7ZP",
  "subject": "Your Harbor receipt #48213",
  "status": "delivered",
  "trace": [
    {
      "step": "accepted",
      "label": "Accepted by API",
      "detail": "POST /v2/send · 202 · 09:41:02",
      "state": "ok" | "warn" | "fail",
      "at": "2026-08-29T09:41:02Z"
    }
  ],
  "payload": {
    "id": "msg_01J8K2QF7ZP",
    "stream": "receipts",
    "from": "receipts@harbor.app",
    "to": "ana.ferreira@northloop.io",
    "template": "receipt-v3",
    "smtp_response": "250 2.0.0 OK",
    "latency_ms": 412
  }
}
```

`payload` is rendered as pretty-printed JSON. The backend decides what it
contains; the UI does not reshape it. For a bounce, `smtp_response` carries the
raw rejection (`550 5.1.1 recipient rejected`) — that is the point of the panel.

#### Templates — `GET /v2/projects/{projectId}/templates`

```jsonc
{
  "templates": [
    {
      "slug": "receipt-v3",
      "name": "Receipt",
      "version": 3,
      "sends30d": 412908,
      "openRate": 0.542,
      "updatedAt": "2026-08-28T09:12:00Z",
    },
  ],
}
```

The card thumbnail is a placeholder gradient chosen client-side from the slug —
no asset is fetched.

#### Domains — `GET /v2/projects/{projectId}/domains`

```jsonc
{
  "domains": [
    {
      "name": "harbor.app",
      "state": "verified" | "pending" | "failed",
      "sends30d": 912000,
      "records": [
        {
          "type": "SPF" | "DKIM" | "DMARC" | "RETURN_PATH",
          "state": "verified" | "waiting" | "failed",
          "expected": "v=spf1 include:spf.plume.email ~all",
          "observed": "v=spf1 include:spf.plume.email ~all",
          "checkedAt": "2026-08-29T09:00:00Z"
        }
      ]
    }
  ]
}
```

A record card shows `observed` when present and `expected` when the record is
missing. Domain-level `state` is derived by the backend, not by the UI.

Related, not yet wired to a screen: `POST /v2/projects/{projectId}/domains` to
add one, and `POST /v2/projects/{projectId}/domains/{name}/verify` to force a
re-check.

#### API keys — `GET /v2/projects/{projectId}/keys`

```jsonc
{
  "keys": [
    {
      "id": "key_01H8...",
      "name": "Production server",
      "prefix": "plume_live_sk_9f2b",
      "last4": "4c71",
      "scope": "full" | "send" | "read",
      "environment": "live" | "test",
      "lastUsedAt": "2026-08-29T09:42:00Z"
    }
  ]
}
```

The secret is never returned here. `POST /v2/projects/{projectId}/keys` returns
the full token exactly once in its `201` response:

```jsonc
{ "id": "key_...", "token": "<the full key, shown once>", "shownOnce": true }
```

`DELETE /v2/projects/{projectId}/keys/{id}` revokes immediately; in-flight
requests using the key fail with `401`.

#### Suppressions — `GET /v2/projects/{projectId}/suppressions`

Query: `reason` (`hard_bounce|complaint|unsubscribe`), `limit`, `cursor`,
`q` (address prefix search).

```jsonc
{
  "stats": {
    "total": 1204,
    "hardBounces": 812,
    "complaints": 96,
    "unsubscribes": 296,
  },
  "entries": [
    {
      "address": "old.address@defunctcorp.com",
      "reason": "hard_bounce",
      "source": "SMTP 550 5.1.1",
      "addedAt": "2026-08-28T14:02:00Z",
    },
  ],
  "nextCursor": null,
}
```

`DELETE /v2/projects/{projectId}/suppressions/{address}` removes an entry and
writes an audit event. Removing a complaint suppression should be refused or
gated — that is a backend policy call, not a UI one.

#### Audit log — `GET /v2/projects/{projectId}/audit`

Query: `category` (`keys|templates|domains|members|security|suppressions`),
`limit`, `cursor`.

```jsonc
{
  "events": [
    {
      "id": "aud_01H8...",
      "actor": { "type": "user" | "api_key" | "system", "label": "Maya Ellery" },
      "action": "key.created",
      "actionLabel": "Key created",
      "target": "plume_live_sk_4a08…b1e9",
      "source": { "ip": "203.0.113.24", "channel": "console" },
      "at": "2026-08-29T09:44:00Z",
      "category": "keys"
    }
  ],
  "counts": { "all": 10, "keys": 2, "templates": 2 },
  "nextCursor": null
}
```

Events are append-only and retained 400 days.

`GET /v2/projects/{projectId}/audit/export?format=csv` backs the Export CSV
button — it returns `202` with a job id and mails a signed link, rather than
streaming, because the window can be large.

## Plume Docs

_Source: `email-send/frontend/app/docs/docs.contract.md`_

The documentation body is static content compiled into the bundle. Only search
needs the backend.

#### `GET /v2/public/docs/search?q=`

Backs the header search field and its ⌘K palette. Public, no auth.

Query: `q` (min 2 characters), `limit` (default 8, max 25).

Response `200`:

```jsonc
{
  "results": [
    {
      "sectionId": "send",
      "title": "Send a message",
      "snippet": "…validated against your suppression list…",
      "anchor": "/docs#send",
      "score": 0.82,
    },
  ],
}
```

Errors:

- `400 query_too_short` — fewer than 2 characters.
- Any failure is non-fatal: the field falls back to no results rather than
  showing an error, since the page content is present either way.

Note for the backend: the search index is over the same section ids the page
renders (`quickstart`, `authentication`, `send`, `templates`, `webhooks`,
`errors`, `sdks`). If the docs move to a CMS later, `anchor` must keep pointing
at a real fragment on this page.

---

# Pane — email-inbox

## Pane Marketing site

_Source: `email-inbox/frontend/app/(marketing)/marketing.contract.md`_

Most of this site is static copy compiled into the bundle: product, security,
privacy, terms, support answers and the careers perks never call the backend.
Four things do.

#### Landing hero numbers — `GET /v1/public/metrics`

Public, cacheable. Non-fatal: the page renders the bundled fallback in
`lib/mock/marketing.ts` if the call fails.

```jsonc
{
  "stats": [
    { "value": "2.4 h", "label": "Median reply time" },
    { "value": "61%", "label": "Less inbox noise" },
    { "value": "15 GB", "label": "Free storage" },
  ],
}
```

Values arrive pre-formatted; the frontend does not compute or localise them.

#### Changelog — `GET /v1/public/changelog`

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

#### Status — `GET /v1/public/status`

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

#### Careers — `GET /v1/public/roles`

```jsonc
{
  "roles": [
    {
      "id": "role_01H8...",
      "title": "Senior product engineer",
      "team": "Engineering",
      "location": "Remote (Europe)",
      "salaryRange": "£95k–£125k",
      "applyUrl": "https://jobs.pane.com/senior-product-engineer",
    },
  ],
}
```

Roles link out to an external applicant tracker; the mock currently points them
at `/support`.

#### Sign up — `POST /v1/auth/signup`

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

#### Sign in — `POST /v1/auth/signin`

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

#### OAuth and passkeys

The two provider buttons start flows rather than posting credentials:

- `GET /v1/auth/oauth/google/start?redirect=/mail` → `302` to Google.
- `POST /v1/auth/webauthn/challenge` → WebAuthn request options; the browser
  signs and the client posts the assertion to
  `POST /v1/auth/webauthn/verify`.

Both land on `/mail` on success. Passwords are never sent to any endpoint other
than `/v1/auth/signin` and `/v1/auth/signup`, both over TLS.

## Pane Mail app

_Source: `email-inbox/frontend/app/mail/mail.contract.md`_

Every endpoint requires an authenticated session (httpOnly cookie set by
`/v1/auth/signin`). All are scoped to the signed-in account; there is no account
id in the path.

Shared error envelope:

```jsonc
{ "error": { "code": "not_found", "message": "No such thread." } }
```

`401 unauthorized`, `404 not_found` and `429 rate_limited` apply throughout and
are not repeated per endpoint.

#### Shell — `GET /v1/mailboxes`

Sidebar folders and their badge counts. One call per session; the counts refresh
over the realtime channel below rather than by polling.

```jsonc
{
  "mailboxes": [
    {
      "key": "inbox",
      "name": "Inbox",
      "unread": 12,
      "total": 4820,
    },
  ],
  "storage": { "usedBytes": 6120000000, "limitBytes": 16100000000, "pct": 38 },
}
```

Keys are fixed: `inbox`, `starred`, `snoozed`, `sent`, `drafts`, `archive`. The
UI renders `pct` directly.

#### List — `GET /v1/mailboxes/{mailbox}/threads`

Query: `category` (`primary|social|promotions|newsletters|otp`), `filter`
(`all|unread|attachments`), `limit` (default 50, max 200), `cursor`, `q`.

```jsonc
{
  "threads": [
    {
      "id": "thr_01J8K2QF7ZP",
      "sender": { "name": "Maya Lindqvist", "address": "maya@studio.co" },
      "subject": "Frosted panels for the v3 shell",
      "preview": "Pushed the new blur tokens — take a look before standup",
      "receivedAt": "2026-08-30T09:42:00Z",
      "unread": true,
      "starred": false,
      "hasAttachments": true,
      "labels": ["Design"],
      "category": "primary",
      "messageCount": 3,
    },
  ],
  "categoryCounts": {
    "primary": 7,
    "social": 2,
    "promotions": 2,
    "newsletters": 2,
    "otp": 2,
  },
  "nextCursor": "eyJ0IjoiMjAyNi0...",
}
```

`categoryCounts` are unread counts for the lane chips and cover the whole
mailbox, not the current page. `preview` is server-trimmed to about 120
characters — the client does not truncate, it ellipsises with CSS.

The avatar tint is derived client-side from the row index, matching the mockup.
If the backend later stores real avatars, add `sender.avatarUrl` and the client
will prefer it.

#### Thread — `GET /v1/threads/{threadId}`

Opening a thread. Marks nothing as read on its own — see the mutation below.

```jsonc
{
  "id": "thr_01J8K2QF7ZP",
  "subject": "Frosted panels for the v3 shell",
  "position": { "index": 1, "total": 12 }, // powers "1 of 12"
  "messages": [
    {
      "id": "msg_01J8K2QF7ZP",
      "from": { "name": "Maya Lindqvist", "address": "maya@studio.co" },
      "to": [{ "name": "Anneke Vos", "address": "anneke@pane.mail" }],
      "sentAt": "2026-08-30T09:42:00Z",
      "bodyHtml": "<p>Morning — I pushed the new blur tokens…</p>",
      "bodyText": "Morning — I pushed the new blur tokens…",
      "signature": { "name": "Maya Lindqvist", "role": "Product Design" },
      "attachments": [
        {
          "id": "att_01H8...",
          "filename": "blur-tokens-v3.json",
          "sizeBytes": 18432,
          "contentType": "application/json",
          "downloadUrl": "/v1/attachments/att_01H8.../download",
        },
      ],
    },
  ],
}
```

`bodyHtml` is untrusted remote content: it must be sanitised server-side and
rendered in a sandboxed frame with remote images blocked until the reader opts
in. The current mock renders plain paragraphs and does not exercise this — the
sanitiser is a backend requirement, not a frontend one.

#### Thread actions

- `POST /v1/threads/{threadId}/read` — body `{ "read": true }`.
- `POST /v1/threads/{threadId}/star` — body `{ "starred": true }`.
- `POST /v1/threads/{threadId}/archive` — no body.
- `POST /v1/threads/{threadId}/snooze` — body `{ "until": "2026-08-31T08:00:00Z" }`.
- `POST /v1/threads/{threadId}/move` — body
  `{ "category": "primary", "applyToSender": true }`. `applyToSender` is the
  "apply to sender" correction the support page describes; it retrains lane
  assignment for that sender on this account only.

All return `204`. The UI applies them optimistically and reverts on failure.

#### Drafts — `GET|PUT /v1/drafts/{draftId}`, `POST /v1/drafts`

`POST` creates and returns `{ "id": "dft_…" }`. `PUT` autosaves:

```jsonc
{
  "to": [{ "name": "Maya Lindqvist", "address": "maya@studio.co" }],
  "cc": [],
  "bcc": [],
  "subject": "Re: Frosted panels for the v3 shell",
  "bodyHtml": "<p>Looks good on my side…</p>",
  "inReplyTo": "msg_01J8K2QF7ZP",
  "attachmentIds": [],
}
```

Response `200` returns the saved draft plus `savedAt`, which backs the "Draft
saved" label. Autosave is debounced client-side to one call every few seconds.

#### Send — `POST /v1/drafts/{draftId}/send`

Body: `{ "sendAt": null }` for now, or an ISO timestamp for the send-later
feature the changelog describes.

Response `202`: `{ "messageId": "msg_…", "scheduledFor": null }`.

Errors: `400 no_recipients`, `413 attachments_too_large` (25 MB combined),
`422 invalid_address` naming the offending address.

#### Settings — `GET|PATCH /v1/me/settings`

`PATCH` takes a partial object; only changed keys are sent.

```jsonc
{
  "appearance": { "dark": false, "accent": "iris", "wallpaper": "aurora" },
  "inbox": {
    "conversationView": true,
    "previewText": true,
    "density": "comfortable",
  },
  "notifications": { "desktop": true, "sounds": true, "dailyDigest": false },
  "privacy": {
    "readReceipts": false,
    "twoFactor": true,
    "blockedSenders": 14,
  },
  "automation": {
    "autoArchiveOtp": false,
    "activeFilters": 9,
    "signature": "default",
  },
}
```

Dark mode is currently client-only state; once this endpoint exists the toggle
writes through so the choice follows the account across devices, as the settings
page claims.

#### Profile — `GET /v1/me`

```jsonc
{
  "id": "usr_01H8...",
  "name": "Anneke Vos",
  "primaryAddress": "anneke@pane.mail",
  "headline": "Product design, Stockholm",
  "aliases": ["a.vos@pane.mail", "hello@annekevos.se"],
  "recoveryPhone": "+46 70 555 01 22",
  "locale": "en-GB",
  "timeZone": "Europe/Stockholm",
  "memberSince": "2019-04-02",
  "stats": {
    "conversations": 18402,
    "storageBytes": 6120000000,
    "avgReplyMinutes": 144,
  },
  "signature": {
    "name": "Anneke Vos",
    "role": "Product Design · Pane",
    "phone": "+46 70 555 01 22",
  },
}
```

The UI formats `stats` for display; unlike the Plume console, these arrive as
numbers because the profile page shows them in one fixed locale.

#### Realtime — `GET /v1/stream` (Server-Sent Events)

New mail, read-state changes from other devices, and mailbox counts. Events:

```
event: thread.received   data: { "mailbox": "inbox", "thread": { … } }
event: thread.updated    data: { "id": "thr_…", "unread": false }
event: mailbox.counts    data: { "inbox": 12, "drafts": 2 }
```

SSE rather than WebSockets: the stream is one-directional, and every mutation
above is a plain HTTP call. The client reconnects with `Last-Event-ID`.
