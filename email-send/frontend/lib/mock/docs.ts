/**
 * Content for the Plume docs page. Static — the docs ship with the bundle
 * rather than coming from an endpoint. See `app/docs/docs.contract.md` for the
 * one thing that is not static (search).
 */

const V = "#dcd9ff";
const K = "#a5b4fc";
const S = "#67e8f9";
const G = "#5eead4";

export type DocsLang = "curl" | "node" | "python" | "go";

const line = (rows: [string, string][]) =>
  rows.map(([line, color]) => ({ line, color }));

export const DOCS_LANGS: { label: string; id: DocsLang }[] = [
  { label: "cURL", id: "curl" },
  { label: "Node", id: "node" },
  { label: "Python", id: "python" },
  { label: "Go", id: "go" },
];

export const QUICKSTART_CODE: Record<
  DocsLang,
  { line: string; color: string }[]
> = {
  curl: line([
    ["curl https://api.plume.email/v2/send \\", K],
    ['  -H "Authorization: Bearer $PLUME_KEY" \\', V],
    ['  -H "Content-Type: application/json" \\', V],
    ["  -d '{", V],
    ['    "from": "receipts@harbor.app",', S],
    ['    "to": "ana@northloop.io",', S],
    ['    "template": "receipt-v3",', S],
    ['    "vars": { "total": "€48.00" }', S],
    ["  }'", V],
    ["", V],
    ['→ 202 { "id": "msg_01J8K2QF7ZP" }', G],
  ]),
  node: line([
    ['import { Plume } from "@plume/sdk";', K],
    ["", V],
    ["const plume = new Plume(process.env.PLUME_KEY);", V],
    ["", V],
    ["const { id } = await plume.send({", V],
    ['  from: "receipts@harbor.app",', S],
    ['  to: "ana@northloop.io",', S],
    ['  template: "receipt-v3",', S],
    ['  vars: { total: "€48.00" },', S],
    ["});", V],
    ["", V],
    ['// id → "msg_01J8K2QF7ZP"', G],
  ]),
  python: line([
    ["from plume import Plume", K],
    ["", V],
    ['plume = Plume(os.environ["PLUME_KEY"])', V],
    ["", V],
    ["msg = plume.send(", V],
    ['    sender="receipts@harbor.app",', S],
    ['    to="ana@northloop.io",', S],
    ['    template="receipt-v3",', S],
    ['    vars={"total": "€48.00"},', S],
    [")", V],
    ["", V],
    ['# msg.id → "msg_01J8K2QF7ZP"', G],
  ]),
  go: line([
    ['client := plume.New(os.Getenv("PLUME_KEY"))', K],
    ["", V],
    ["msg, err := client.Send(ctx, &plume.Message{", V],
    ['    From:     "receipts@harbor.app",', S],
    ['    To:       []string{"ana@northloop.io"},', S],
    ['    Template: "receipt-v3",', S],
    ['    Vars:     plume.Vars{"total": "€48.00"},', S],
    ["})", V],
    ["", V],
    ['// msg.ID → "msg_01J8K2QF7ZP"', G],
  ]),
};

export const SEND_REQUEST = line([
  ["{", V],
  ['  "from": "receipts@harbor.app",', S],
  ['  "to": "ana@northloop.io",', S],
  ['  "template": "receipt-v3",', S],
  ['  "vars": {', S],
  ['    "total": "€48.00",', S],
  ['    "order_id": "H-2291"', S],
  ["  },", S],
  ['  "stream": "receipts",', S],
  ['  "idempotency_key": "H-2291-receipt"', S],
  ["}", V],
]);

export const SEND_RESPONSE = line([
  ["{", V],
  ['  "id": "msg_01J8K2QF7ZP",', S],
  ['  "status": "queued",', S],
  ['  "stream": "receipts",', S],
  ['  "template": "receipt-v3@14",', S],
  ['  "accepted_at": "2026-08-29T09:14:02Z",', S],
  ['  "trace_url": "https://plume.email/t/01J8K2QF7ZP"', S],
  ["}", V],
]);

export const WEBHOOK_SAMPLE = line([
  ["POST /hooks/plume   Plume-Signature: t=1756458842,v1=8f2c…", K],
  ["", V],
  ["{", V],
  ['  "event": "message.delivered",', S],
  ['  "id": "evt_01J8K3B9WQ",', S],
  ['  "message_id": "msg_01J8K2QF7ZP",', S],
  ['  "stream": "receipts",', S],
  ['  "recipient": "ana@northloop.io",', S],
  ['  "smtp_response": "250 2.0.0 OK 1756458841 d9-20020a17",', S],
  ['  "occurred_at": "2026-08-29T09:14:03Z"', S],
  ["}", V],
]);

export const QUICKSTART_STEPS = [
  {
    n: "1",
    title: "Verify a domain",
    body: "Add the DKIM and return-path records Plume generates. Verification usually lands within a minute.",
  },
  {
    n: "2",
    title: "Create a key",
    body: "Scope it to send only. Sandbox keys work without a verified domain.",
  },
  {
    n: "3",
    title: "Post a message",
    body: "One JSON call. You get a message id back as soon as it is queued.",
  },
  {
    n: "4",
    title: "Watch the trace",
    body: "Open the id in the console to see rendering, the MTA hop and the SMTP response.",
  },
];

export const SCOPES = [
  {
    scope: "send",
    body: "Post messages and batches. The only scope most services need.",
  },
  {
    scope: "templates:write",
    body: "Create template versions and publish or roll back the live one.",
  },
  {
    scope: "activity:read",
    body: "Read message traces, events and suppression entries.",
  },
  {
    scope: "admin",
    body: "Manage domains, keys and members. Never ship this in an app.",
  },
];

export const SEND_PARAMS = [
  {
    name: "from",
    type: "string",
    req: "required",
    body: "Verified sending address. The domain must pass SPF and DKIM checks.",
  },
  {
    name: "to",
    type: "string | string[]",
    req: "required",
    body: "Up to 50 recipients per message. Suppressed addresses are rejected before queueing.",
  },
  {
    name: "template",
    type: "string",
    req: "optional",
    body: "Template name, optionally pinned to a version with @n. Omit when sending html or text.",
  },
  {
    name: "vars",
    type: "object",
    req: "optional",
    body: "Values for the template. Types are checked against the template schema.",
  },
  {
    name: "html / text",
    type: "string",
    req: "optional",
    body: "Raw body, used when no template is given. A plain-text part is generated if omitted.",
  },
  {
    name: "stream",
    type: "string",
    req: "optional",
    body: "Reputation stream. Defaults to transactional.",
  },
  {
    name: "idempotency_key",
    type: "string",
    req: "optional",
    body: "Repeat calls with the same key within 24 hours return the original message.",
  },
  {
    name: "attachments",
    type: "array",
    req: "optional",
    body: "Up to 10 MB combined, base64 encoded, with a filename and content type.",
  },
];

export const DOC_STREAMS = [
  {
    id: "transactional",
    body: "Default. Receipts, resets, alerts. Highest priority queue.",
  },
  {
    id: "notifications",
    body: "Digests and activity mail. Throttled behind transactional.",
  },
  {
    id: "bulk",
    body: "Campaigns and announcements. Separate IPs and reputation.",
  },
];

export const WEBHOOK_EVENTS = [
  "message.queued",
  "message.rendered",
  "message.delivered",
  "message.deferred",
  "message.bounced",
  "message.complained",
  "message.opened",
  "message.clicked",
  "domain.record_drift",
];

export const API_ERRORS = [
  {
    status: "400",
    code: "invalid_request",
    body: "A field is missing or the wrong type. The response names the field.",
    statusColor: "#e07a5f",
  },
  {
    status: "401",
    code: "invalid_key",
    body: "The key is unknown, revoked or from another project.",
    statusColor: "#e07a5f",
  },
  {
    status: "403",
    code: "domain_unverified",
    body: "The sending domain has no valid DKIM record yet.",
    statusColor: "#e07a5f",
  },
  {
    status: "409",
    code: "suppressed_recipient",
    body: "The address hard bounced or complained and is on the suppression list.",
    statusColor: "#c08a3e",
  },
  {
    status: "422",
    code: "template_vars_mismatch",
    body: "A required template variable is missing or has the wrong type.",
    statusColor: "#c08a3e",
  },
  {
    status: "429",
    code: "rate_limited",
    body: "Above the per-second send limit. Retry after the interval in the header.",
    statusColor: "#c08a3e",
  },
  {
    status: "503",
    code: "upstream_unavailable",
    body: "A sending pool is briefly unavailable. Retry with backoff.",
    statusColor: "#7c7ef2",
  },
];

export const RATE_LIMITS = [
  { value: "100 / s", label: "Send calls, free plan" },
  { value: "1,000 / s", label: "Send calls, Scale plan" },
  { value: "500", label: "Messages per batch call" },
  { value: "24 h", label: "Idempotency key window" },
];

export const SDK_CHIPS = [
  "node",
  "python",
  "go",
  "ruby",
  "php",
  "rust",
  "smtp.plume.email:587",
  "STARTTLS",
];

export const DOCS_SECTIONS = [
  { id: "quickstart", label: "Quickstart" },
  { id: "authentication", label: "Authentication" },
  { id: "send", label: "Send a message" },
  { id: "templates", label: "Templates and streams" },
  { id: "webhooks", label: "Webhooks" },
  { id: "errors", label: "Errors and rate limits" },
  { id: "sdks", label: "SDKs and SMTP" },
];

export const DOCS_NAV = [
  { group: "Get started", ids: ["quickstart", "authentication"] },
  { group: "API", ids: ["send", "templates", "webhooks", "errors"] },
  { group: "Libraries", ids: ["sdks"] },
];
