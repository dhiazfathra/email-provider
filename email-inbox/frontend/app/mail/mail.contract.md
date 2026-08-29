# Pane — Mail app (`/mail/*`)

Every endpoint requires an authenticated session (httpOnly cookie set by
`/v1/auth/signin`). All are scoped to the signed-in account; there is no account
id in the path.

Shared error envelope:

```jsonc
{ "error": { "code": "not_found", "message": "No such thread." } }
```

`401 unauthorized`, `404 not_found` and `429 rate_limited` apply throughout and
are not repeated per endpoint.

## Shell — `GET /v1/mailboxes`

Sidebar folders and their badge counts. One call per session; the counts refresh
over the realtime channel below rather than by polling.

```jsonc
{
  "mailboxes": [
    {
      "key": "inbox",
      "name": "Inbox",
      "unread": 12,
      "total": 4820
    }
  ],
  "storage": { "usedBytes": 6120000000, "limitBytes": 16100000000, "pct": 38 }
}
```

Keys are fixed: `inbox`, `starred`, `snoozed`, `sent`, `drafts`, `archive`. The
UI renders `pct` directly.

## List — `GET /v1/mailboxes/{mailbox}/threads`

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
      "messageCount": 3
    }
  ],
  "categoryCounts": {
    "primary": 7,
    "social": 2,
    "promotions": 2,
    "newsletters": 2,
    "otp": 2
  },
  "nextCursor": "eyJ0IjoiMjAyNi0..."
}
```

`categoryCounts` are unread counts for the lane chips and cover the whole
mailbox, not the current page. `preview` is server-trimmed to about 120
characters — the client does not truncate, it ellipsises with CSS.

The avatar tint is derived client-side from the row index, matching the mockup.
If the backend later stores real avatars, add `sender.avatarUrl` and the client
will prefer it.

## Thread — `GET /v1/threads/{threadId}`

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
          "downloadUrl": "/v1/attachments/att_01H8.../download"
        }
      ]
    }
  ]
}
```

`bodyHtml` is untrusted remote content: it must be sanitised server-side and
rendered in a sandboxed frame with remote images blocked until the reader opts
in. The current mock renders plain paragraphs and does not exercise this — the
sanitiser is a backend requirement, not a frontend one.

## Thread actions

- `POST /v1/threads/{threadId}/read` — body `{ "read": true }`.
- `POST /v1/threads/{threadId}/star` — body `{ "starred": true }`.
- `POST /v1/threads/{threadId}/archive` — no body.
- `POST /v1/threads/{threadId}/snooze` — body `{ "until": "2026-08-31T08:00:00Z" }`.
- `POST /v1/threads/{threadId}/move` — body
  `{ "category": "primary", "applyToSender": true }`. `applyToSender` is the
  "apply to sender" correction the support page describes; it retrains lane
  assignment for that sender on this account only.

All return `204`. The UI applies them optimistically and reverts on failure.

## Drafts — `GET|PUT /v1/drafts/{draftId}`, `POST /v1/drafts`

`POST` creates and returns `{ "id": "dft_…" }`. `PUT` autosaves:

```jsonc
{
  "to": [{ "name": "Maya Lindqvist", "address": "maya@studio.co" }],
  "cc": [],
  "bcc": [],
  "subject": "Re: Frosted panels for the v3 shell",
  "bodyHtml": "<p>Looks good on my side…</p>",
  "inReplyTo": "msg_01J8K2QF7ZP",
  "attachmentIds": []
}
```

Response `200` returns the saved draft plus `savedAt`, which backs the "Draft
saved" label. Autosave is debounced client-side to one call every few seconds.

## Send — `POST /v1/drafts/{draftId}/send`

Body: `{ "sendAt": null }` for now, or an ISO timestamp for the send-later
feature the changelog describes.

Response `202`: `{ "messageId": "msg_…", "scheduledFor": null }`.

Errors: `400 no_recipients`, `413 attachments_too_large` (25 MB combined),
`422 invalid_address` naming the offending address.

## Settings — `GET|PATCH /v1/me/settings`

`PATCH` takes a partial object; only changed keys are sent.

```jsonc
{
  "appearance": { "dark": false, "accent": "iris", "wallpaper": "aurora" },
  "inbox": {
    "conversationView": true,
    "previewText": true,
    "density": "comfortable"
  },
  "notifications": { "desktop": true, "sounds": true, "dailyDigest": false },
  "privacy": {
    "readReceipts": false,
    "twoFactor": true,
    "blockedSenders": 14
  },
  "automation": {
    "autoArchiveOtp": false,
    "activeFilters": 9,
    "signature": "default"
  }
}
```

Dark mode is currently client-only state; once this endpoint exists the toggle
writes through so the choice follows the account across devices, as the settings
page claims.

## Profile — `GET /v1/me`

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
    "avgReplyMinutes": 144
  },
  "signature": {
    "name": "Anneke Vos",
    "role": "Product Design · Pane",
    "phone": "+46 70 555 01 22"
  }
}
```

The UI formats `stats` for display; unlike the Plume console, these arrive as
numbers because the profile page shows them in one fixed locale.

## Realtime — `GET /v1/stream` (Server-Sent Events)

New mail, read-state changes from other devices, and mailbox counts. Events:

```
event: thread.received   data: { "mailbox": "inbox", "thread": { … } }
event: thread.updated    data: { "id": "thr_…", "unread": false }
event: mailbox.counts    data: { "inbox": 12, "drafts": 2 }
```

SSE rather than WebSockets: the stream is one-directional, and every mutation
above is a plain HTTP call. The client reconnects with `Last-Event-ID`.
