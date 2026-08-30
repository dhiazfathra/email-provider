/** `GET /v2/projects/{projectId}/domains` — statuses are lowercase (D11). */
export const DOMAINS = [
  {
    name: "harbor.app",
    state: "verified",
    volume: "912k sends / 30d",
    records: [
      {
        type: "SPF",
        state: "verified",
        value: "v=spf1 include:spf.plume.email ~all",
        ok: true,
      },
      {
        type: "DKIM",
        state: "verified",
        value: "plume._domainkey → k=rsa; p=MIIBIjAN…",
        ok: true,
      },
      {
        type: "DMARC",
        state: "verified",
        value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@harbor.app",
        ok: true,
      },
      {
        type: "Return-Path",
        state: "verified",
        value: "bounces.harbor.app → mx.plume.email",
        ok: true,
      },
    ],
  },
  {
    name: "mail.harbor.app",
    state: "verified",
    volume: "421k sends / 30d",
    records: [
      {
        type: "SPF",
        state: "verified",
        value: "v=spf1 include:spf.plume.email ~all",
        ok: true,
      },
      {
        type: "DKIM",
        state: "verified",
        value: "plume._domainkey → k=rsa; p=MIIBIjAN…",
        ok: true,
      },
      {
        type: "DMARC",
        state: "verified",
        value: "v=DMARC1; p=none; rua=mailto:dmarc@harbor.app",
        ok: true,
      },
      {
        type: "Return-Path",
        state: "verified",
        value: "bounces.mail.harbor.app → mx.plume.email",
        ok: true,
      },
    ],
  },
  {
    name: "notify.harborstaging.dev",
    state: "pending",
    volume: "0 sends / 30d",
    records: [
      {
        type: "SPF",
        state: "verified",
        value: "v=spf1 include:spf.plume.email ~all",
        ok: true,
      },
      {
        type: "DKIM",
        state: "waiting",
        value: "plume._domainkey — record not found",
        ok: false,
      },
      {
        type: "DMARC",
        state: "waiting",
        value: "no DMARC record published",
        ok: false,
      },
      {
        type: "Return-Path",
        state: "verified",
        value: "bounces.notify.harborstaging.dev",
        ok: true,
      },
    ],
  },
];

/** Plain example lines; colour is applied at the render site (D11). */
export const SNIPPET = [
  "curl https://api.plume.email/v2/send \\",
  '  -H "Authorization: Bearer $PLUME_KEY" \\',
  '  -H "Content-Type: application/json" \\',
  "  -d '{",
  '    "from": "receipts@harbor.app",',
  '    "to": "ana.ferreira@northloop.io",',
  '    "template": "receipt-v3",',
  '    "vars": { "total": "€48.00" },',
  '    "stream": "receipts"',
  "  }'",
  "",
  '→ 202 { "id": "msg_01J8K2QF7ZP" }',
];
