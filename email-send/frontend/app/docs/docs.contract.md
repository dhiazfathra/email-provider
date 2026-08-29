# Plume — Docs (`/docs`)

The documentation body is static content compiled into the bundle. Only search
needs the backend.

## `GET /v2/public/docs/search?q=`

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
