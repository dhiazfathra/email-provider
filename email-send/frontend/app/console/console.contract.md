# Plume — Console (`/console/*`)

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

## Shell — `GET /v2/projects/{projectId}`

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

## Overview — `GET /v2/projects/{projectId}/metrics?range=7d`

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

## Overview — `GET /v2/projects/{projectId}/metrics/timeseries?range=7d&buckets=14`

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

## Overview — `GET /v2/projects/{projectId}/streams?range=7d`

Top-streams card, ordered by volume descending, max 8.

```jsonc
{
  "streams": [{ "name": "transactional", "count": 642118, "share": 1.0 }],
}
```

`share` is relative to the largest stream, not to the total — it is a bar width.

## Overview — `GET /v2/projects/{projectId}/reputation`

```jsonc
{
  "providers": [
    { "provider": "gmail", "label": "Gmail", "score": 98.7, "state": "good" },
  ],
}
```

`state` is `good` | `watch` | `poor` and selects the dot and score colour.

## Activity — `GET /v2/projects/{projectId}/messages`

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

## Activity — `GET /v2/projects/{projectId}/messages/{messageId}`

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

## Templates — `GET /v2/projects/{projectId}/templates`

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

## Domains — `GET /v2/projects/{projectId}/domains`

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

## API keys — `GET /v2/projects/{projectId}/keys`

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
{ "id": "key_...", "token": "plume_live_sk_9f2b...4c71", "shownOnce": true }
```

`DELETE /v2/projects/{projectId}/keys/{id}` revokes immediately; in-flight
requests using the key fail with `401`.

## Suppressions — `GET /v2/projects/{projectId}/suppressions`

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

## Audit log — `GET /v2/projects/{projectId}/audit`

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
