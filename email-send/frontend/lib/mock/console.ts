/**
 * Mock data for the Plume console. Each block names the endpoint that replaces
 * it — see `app/console/console.contract.md`.
 */

export const T1 = "linear-gradient(140deg,#7c7ef2,#a78bfa)";
export const T2 = "linear-gradient(140deg,#7dd3fc,#818cf8)";
export const T3 = "linear-gradient(140deg,#67e8f9,#5eead4)";
export const T4 = "linear-gradient(140deg,#c4b5fd,#8b8cf6)";
export const T5 = "linear-gradient(140deg,#c084fc,#f0abfc)";

/** `GET /v2/projects/{projectId}` */
export const PROJECT = {
  initial: "H",
  name: "Harbor · prod",
  quota: { usedLabel: "1.36M of 2M sends · resets 1 Sep", pct: 68 },
};

export const NAV = [
  { href: "/console", glyph: "◧", label: "Overview", badge: "" },
  { href: "/console/activity", glyph: "▤", label: "Activity", badge: "" },
  { href: "/console/templates", glyph: "✎", label: "Templates", badge: "24" },
  { href: "/console/domains", glyph: "◍", label: "Domains", badge: "3" },
  { href: "/console/keys", glyph: "⌘", label: "API keys", badge: "" },
  {
    href: "/console/suppressions",
    glyph: "⊘",
    label: "Suppressions",
    badge: "1.2k",
  },
  { href: "/console/audit", glyph: "◈", label: "Audit log", badge: "" },
];

export const PAGE_META: Record<string, { title: string; blurb: string }> = {
  "/console": {
    title: "Overview",
    blurb:
      "Delivery, engagement and reputation across every stream in this project.",
  },
  "/console/activity": {
    title: "Activity",
    blurb:
      "Every message Plume accepted in the last 24 hours, with its delivery trace.",
  },
  "/console/templates": {
    title: "Templates",
    blurb:
      "Versioned templates rendered server-side. Variables are validated before send.",
  },
  "/console/domains": {
    title: "Sending domains",
    blurb:
      "SPF, DKIM, DMARC and return-path status for each domain on this project.",
  },
  "/console/keys": {
    title: "API keys",
    blurb:
      "Scoped keys per environment. Keys are shown once at creation and hashed after.",
  },
  "/console/suppressions": {
    title: "Suppressions",
    blurb: "Addresses Plume will refuse to send to, and why they were added.",
  },
  "/console/audit": {
    title: "Audit log",
    blurb:
      "Every configuration change made in this project, who made it and from where.",
  },
};

export const RANGES = ["24h", "7d", "30d"] as const;
export type Range = (typeof RANGES)[number];

/** `GET /v2/projects/{projectId}/metrics?range=` */
export const KPIS = [
  {
    label: "Sent",
    value: "1,362,004",
    delta: "+8.4%",
    deltaColor: "#0e8f80",
    dip: false,
  },
  {
    label: "Delivered",
    value: "99.31%",
    delta: "+0.12%",
    deltaColor: "#0e8f80",
    dip: false,
  },
  {
    label: "Bounced",
    value: "0.42%",
    delta: "−0.06%",
    deltaColor: "#0e8f80",
    dip: true,
  },
  {
    label: "Complaints",
    value: "0.014%",
    delta: "+0.003%",
    deltaColor: "#8b5cf6",
    dip: true,
  },
];

/** Sparkline shape for a KPI card. Deterministic so server and client agree. */
export function sparkBars(count: number, seed: number, dip: boolean) {
  return Array.from({ length: count }, (_, i) => {
    const bad = dip && i > count - 4;
    return {
      h: `${bad ? 9 : 12 + ((i * 13 + seed * 7) % 18)}px`,
      color: bad ? "#c084fc" : "rgba(124,126,242,.55)",
    };
  });
}

/** `GET /v2/projects/{projectId}/metrics/timeseries?range=` */
export function deliverySeries(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const base = 58 + ((i * 17) % 26);
    return {
      label: `${i + 15}`,
      delivered: `${base}%`,
      opened: `${16 + ((i * 11) % 12)}%`,
      bounced: `${2 + (i % 3)}%`,
    };
  });
}

export const CHART_LEGEND = [
  { label: "Delivered", color: "#7c7ef2" },
  { label: "Opened", color: "#67e8f9" },
  { label: "Bounced", color: "#c084fc" },
];

export const STREAMS = [
  { name: "transactional", count: "642,118", pct: "100%", tint: T1 },
  { name: "receipts", count: "411,902", pct: "64%", tint: T2 },
  { name: "notifications", count: "218,440", pct: "34%", tint: T4 },
  { name: "broadcast", count: "89,544", pct: "14%", tint: T3 },
];

export const REPUTATION = [
  { label: "Gmail", value: "98.7", color: "#0e8f80" },
  { label: "Outlook / Hotmail", value: "96.2", color: "#0e8f80" },
  { label: "Yahoo", value: "94.8", color: "#0e8f80" },
  { label: "Apple iCloud", value: "91.3", color: "#6d4fd6" },
];

export type EventStatus = "Delivered" | "Opened" | "Bounced" | "Deferred";

export const STATUS_TINT: Record<EventStatus, [string, string]> = {
  Delivered: ["rgba(94,234,212,.24)", "#0e8f80"],
  Opened: ["rgba(124,126,242,.16)", "#4c46b8"],
  Bounced: ["rgba(192,132,252,.22)", "#8b5cf6"],
  Deferred: ["rgba(167,139,250,.16)", "#6d4fd6"],
};

/** `GET /v2/projects/{projectId}/messages?status=&limit=` */
export const EVENTS: {
  to: string;
  subject: string;
  stream: string;
  status: EventStatus;
  time: string;
  id: string;
}[] = [
  {
    to: "ana.ferreira@northloop.io",
    subject: "Your Harbor receipt #48213",
    stream: "receipts",
    status: "Delivered",
    time: "9:41:02",
    id: "msg_01J8K2QF7ZP",
  },
  {
    to: "dev+ci@bridgeworks.dev",
    subject: "Reset your password",
    stream: "transactional",
    status: "Delivered",
    time: "9:40:58",
    id: "msg_01J8K2QF3XA",
  },
  {
    to: "t.okonkwo@lattice.co",
    subject: "Invite to the Atlas workspace",
    stream: "transactional",
    status: "Opened",
    time: "9:40:31",
    id: "msg_01J8K2QDR1M",
  },
  {
    to: "billing@vantage-group.com",
    subject: "Invoice AUG-2026 is ready",
    stream: "receipts",
    status: "Delivered",
    time: "9:39:47",
    id: "msg_01J8K2QBB9C",
  },
  {
    to: "nils@havnfoto.no",
    subject: "Weekly digest — 12 new items",
    stream: "broadcast",
    status: "Bounced",
    time: "9:39:12",
    id: "msg_01J8K2Q8W4E",
  },
  {
    to: "s.rahman@pixelforge.studio",
    subject: "Your export finished",
    stream: "notifications",
    status: "Delivered",
    time: "9:38:55",
    id: "msg_01J8K2Q6T2H",
  },
  {
    to: "no-reply-test@mailsink.dev",
    subject: "Verification code 448 201",
    stream: "transactional",
    status: "Deferred",
    time: "9:38:20",
    id: "msg_01J8K2Q4K7R",
  },
  {
    to: "claire@meridian.partners",
    subject: "Seat added to your plan",
    stream: "notifications",
    status: "Delivered",
    time: "9:37:44",
    id: "msg_01J8K2Q1N8D",
  },
  {
    to: "ops@sunfleet.se",
    subject: "Fleet report for 28 August",
    stream: "broadcast",
    status: "Opened",
    time: "9:37:09",
    id: "msg_01J8K2PXZ3V",
  },
  {
    to: "h.tanaka@kotomi.jp",
    subject: "Your Harbor receipt #48212",
    stream: "receipts",
    status: "Delivered",
    time: "9:36:31",
    id: "msg_01J8K2PVQ6B",
  },
];

export const EVENT_FILTERS = [
  { label: "All", count: "1,462", dot: "#7c7ef2" },
  { label: "Delivered", count: "1,401", dot: "#5eead4" },
  { label: "Opened", count: "892", dot: "#67e8f9" },
  { label: "Bounced", count: "6", dot: "#c084fc" },
  { label: "Deferred", count: "9", dot: "#a78bfa" },
];

const PAYLOAD_TEMPLATE: [string, string][] = [
  ["{", "#dcd9ff"],
  ['  "id": "%ID%",', "#a5b4fc"],
  ['  "stream": "receipts",', "#a5b4fc"],
  ['  "from": "receipts@harbor.app",', "#a5b4fc"],
  ['  "to": "%TO%",', "#a5b4fc"],
  ['  "template": "receipt-v3",', "#a5b4fc"],
  ['  "smtp_response": "250 2.0.0 OK",', "#5eead4"],
  ['  "latency_ms": 412', "#5eead4"],
  ["}", "#dcd9ff"],
];

/** `GET /v2/projects/{projectId}/messages/{messageId}` */
export function messageDetail(index: number) {
  const row = EVENTS[index];
  if (!row) return null;
  const bounced = row.status === "Bounced";
  return {
    ...row,
    trace: [
      {
        step: "Accepted by API",
        detail: `POST /v2/send · 202 · ${row.time}`,
        dot: "#7c7ef2",
        line: "rgba(124,126,242,.3)",
      },
      {
        step: "Template rendered",
        detail: "receipt-v3 · 8 variables · 41 ms",
        dot: "#8b8cf6",
        line: "rgba(124,126,242,.3)",
      },
      {
        step: "Handed to MTA",
        detail: "eu-west-1 · pool: shared-02",
        dot: "#a78bfa",
        line: "rgba(124,126,242,.3)",
      },
      {
        step: row.status,
        detail: bounced
          ? "550 5.1.1 recipient rejected"
          : "250 2.0.0 OK · 412 ms",
        dot: bounced ? "#c084fc" : "#5eead4",
        line: "transparent",
      },
    ],
    payload: PAYLOAD_TEMPLATE.map(([line, color]) => ({
      line: line.replace("%ID%", row.id).replace("%TO%", row.to),
      color,
    })),
  };
}

/** `GET /v2/projects/{projectId}/domains` */
export const DOMAINS = [
  {
    name: "harbor.app",
    state: "Verified",
    volume: "912k sends / 30d",
    records: [
      {
        type: "SPF",
        state: "Verified",
        value: "v=spf1 include:spf.plume.email ~all",
        ok: true,
      },
      {
        type: "DKIM",
        state: "Verified",
        value: "plume._domainkey → k=rsa; p=MIIBIjAN…",
        ok: true,
      },
      {
        type: "DMARC",
        state: "Verified",
        value: "v=DMARC1; p=quarantine; rua=mailto:dmarc@harbor.app",
        ok: true,
      },
      {
        type: "Return-Path",
        state: "Verified",
        value: "bounces.harbor.app → mx.plume.email",
        ok: true,
      },
    ],
  },
  {
    name: "mail.harbor.app",
    state: "Verified",
    volume: "421k sends / 30d",
    records: [
      {
        type: "SPF",
        state: "Verified",
        value: "v=spf1 include:spf.plume.email ~all",
        ok: true,
      },
      {
        type: "DKIM",
        state: "Verified",
        value: "plume._domainkey → k=rsa; p=MIIBIjAN…",
        ok: true,
      },
      {
        type: "DMARC",
        state: "Verified",
        value: "v=DMARC1; p=none; rua=mailto:dmarc@harbor.app",
        ok: true,
      },
      {
        type: "Return-Path",
        state: "Verified",
        value: "bounces.mail.harbor.app → mx.plume.email",
        ok: true,
      },
    ],
  },
  {
    name: "notify.harborstaging.dev",
    state: "Pending",
    volume: "0 sends / 30d",
    records: [
      {
        type: "SPF",
        state: "Verified",
        value: "v=spf1 include:spf.plume.email ~all",
        ok: true,
      },
      {
        type: "DKIM",
        state: "Waiting",
        value: "plume._domainkey — record not found",
        ok: false,
      },
      {
        type: "DMARC",
        state: "Waiting",
        value: "no DMARC record published",
        ok: false,
      },
      {
        type: "Return-Path",
        state: "Verified",
        value: "bounces.notify.harborstaging.dev",
        ok: true,
      },
    ],
  },
];

/** `GET /v2/projects/{projectId}/keys` */
export const KEYS = [
  {
    name: "Production server",
    token: "plume_live_sk_9f2b••••••••4c71",
    scope: "Full access",
    used: "2 min ago",
  },
  {
    name: "CI pipeline",
    token: "plume_live_sk_4a08••••••••b1e9",
    scope: "Send only",
    used: "1 h ago",
  },
  {
    name: "Analytics reader",
    token: "plume_live_rk_77dc••••••••20af",
    scope: "Read only",
    used: "Yesterday",
  },
  {
    name: "Staging",
    token: "plume_test_sk_c310••••••••88fa",
    scope: "Full access · test",
    used: "3 d ago",
  },
];

export const SNIPPET = [
  ["curl https://api.plume.email/v2/send \\", "#a5b4fc"],
  ['  -H "Authorization: Bearer $PLUME_KEY" \\', "#dcd9ff"],
  ['  -H "Content-Type: application/json" \\', "#dcd9ff"],
  ["  -d '{", "#dcd9ff"],
  ['    "from": "receipts@harbor.app",', "#67e8f9"],
  ['    "to": "ana.ferreira@northloop.io",', "#67e8f9"],
  ['    "template": "receipt-v3",', "#67e8f9"],
  ['    "vars": { "total": "€48.00" },', "#67e8f9"],
  ['    "stream": "receipts"', "#67e8f9"],
  ["  }'", "#dcd9ff"],
  ["", "#dcd9ff"],
  ['→ 202 { "id": "msg_01J8K2QF7ZP" }', "#5eead4"],
].map(([line, color]) => ({ line, color }));

/** `GET /v2/projects/{projectId}/templates` */
export const TEMPLATES = [
  {
    name: "Receipt",
    slug: "receipt-v3",
    version: 3,
    sends: "412,908",
    open: "54.2%",
    tint: T1,
  },
  {
    name: "Password reset",
    slug: "password-reset",
    version: 7,
    sends: "188,430",
    open: "71.8%",
    tint: T2,
  },
  {
    name: "Workspace invite",
    slug: "workspace-invite",
    version: 2,
    sends: "96,215",
    open: "63.4%",
    tint: T4,
  },
  {
    name: "Login code",
    slug: "login-code",
    version: 4,
    sends: "304,776",
    open: "88.1%",
    tint: T3,
  },
  {
    name: "Trial ending",
    slug: "trial-ending",
    version: 1,
    sends: "41,662",
    open: "39.7%",
    tint: T5,
  },
  {
    name: "Weekly digest",
    slug: "weekly-digest",
    version: 9,
    sends: "227,344",
    open: "28.9%",
    tint: T2,
  },
];

/** `GET /v2/projects/{projectId}/suppressions` */
export const SUPPRESS_STATS = [
  { label: "Total suppressed", value: "1,204", note: "across all streams" },
  { label: "Hard bounces", value: "812", note: "auto-added" },
  { label: "Complaints", value: "96", note: "feedback loops" },
  { label: "Unsubscribes", value: "296", note: "List-Unsubscribe" },
];

export const SUPPRESSIONS = [
  {
    address: "old.address@defunctcorp.com",
    reason: "Hard bounce",
    source: "SMTP 550 5.1.1",
    added: "28 Aug",
  },
  {
    address: "j.kowalski@example.org",
    reason: "Unsubscribed",
    source: "List-Unsubscribe",
    added: "28 Aug",
  },
  {
    address: "postmaster@blackhole.test",
    reason: "Hard bounce",
    source: "SMTP 550 5.1.10",
    added: "27 Aug",
  },
  {
    address: "marta@ex-employee.co",
    reason: "Complaint",
    source: "Feedback loop",
    added: "27 Aug",
  },
  {
    address: "sales@parked-domain.biz",
    reason: "Hard bounce",
    source: "DNS NXDOMAIN",
    added: "26 Aug",
  },
  {
    address: "reader@newsroom.media",
    reason: "Unsubscribed",
    source: "Preference centre",
    added: "26 Aug",
  },
  {
    address: "abuse-report@isp.net",
    reason: "Complaint",
    source: "Feedback loop",
    added: "25 Aug",
  },
  {
    address: "temp1934@10minutemail.dev",
    reason: "Hard bounce",
    source: "SMTP 554 5.7.1",
    added: "25 Aug",
  },
];

/** `GET /v2/projects/{projectId}/audit?category=` */
export const AUDIT_CATEGORIES = [
  "All",
  "Keys",
  "Templates",
  "Domains",
  "Members",
  "Security",
] as const;

export const AUDIT_DOT: Record<string, string> = {
  All: "#7c7ef2",
  Keys: "#a78bfa",
  Templates: "#67e8f9",
  Domains: "#8b8cf6",
  Members: "#5eead4",
  Security: "#c084fc",
};

export const AUDIT = [
  {
    actor: "Maya Ellery",
    action: "Key created",
    target: "plume_live_sk_4a08…b1e9",
    source: "203.0.113.24 · Console",
    when: "9:44 · today",
    category: "Keys",
    tint: T1,
  },
  {
    actor: "ci-bot@harbor.app",
    action: "Template published",
    target: "receipt-v3",
    source: "API · plume_live_sk_9f2b",
    when: "9:12 · today",
    category: "Templates",
    tint: T2,
  },
  {
    actor: "Devan Roy",
    action: "Domain verified",
    target: "mail.harbor.app",
    source: "198.51.100.7 · Console",
    when: "8:51 · today",
    category: "Domains",
    tint: T4,
  },
  {
    actor: "Maya Ellery",
    action: "Member invited",
    target: "t.okonkwo@lattice.co",
    source: "203.0.113.24 · Console",
    when: "Yesterday 17:30",
    category: "Members",
    tint: T1,
  },
  {
    actor: "Devan Roy",
    action: "Suppression removed",
    target: "reader@newsroom.media",
    source: "198.51.100.7 · Console",
    when: "Yesterday 15:02",
    category: "Suppressions",
    tint: T4,
  },
  {
    actor: "ci-bot@harbor.app",
    action: "Template published",
    target: "login-code",
    source: "API · plume_live_sk_9f2b",
    when: "Yesterday 11:48",
    category: "Templates",
    tint: T2,
  },
  {
    actor: "Priya Naidu",
    action: "Role changed",
    target: "devan@harbor.app → Admin",
    source: "192.0.2.88 · Console",
    when: "27 Aug 16:19",
    category: "Members",
    tint: T3,
  },
  {
    actor: "Maya Ellery",
    action: "Key revoked",
    target: "plume_test_sk_1ab4…90cd",
    source: "203.0.113.24 · Console",
    when: "27 Aug 10:05",
    category: "Keys",
    tint: T1,
  },
  {
    actor: "Priya Naidu",
    action: "Setting changed",
    target: "DMARC policy → quarantine",
    source: "192.0.2.88 · Console",
    when: "26 Aug 14:37",
    category: "Domains",
    tint: T3,
  },
  {
    actor: "System",
    action: "Login failed",
    target: "maya@harbor.app · 3 attempts",
    source: "203.0.113.24 · Console",
    when: "26 Aug 09:11",
    category: "Security",
    tint: T5,
  },
];

export function initialsOf(actor: string) {
  if (actor === "System") return "SY";
  return actor
    .replace(/@.*/, "")
    .split(/[ .\-_]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("");
}
