/**
 * Content for the Pane marketing site. Mostly static copy that ships with the
 * bundle; the blocks that a backend should own name their endpoint.
 * See `app/(marketing)/marketing.contract.md`.
 */

export const AV = [
  "linear-gradient(140deg,#8b8cf6,#a78bfa)",
  "linear-gradient(140deg,#7dd3fc,#818cf8)",
  "linear-gradient(140deg,#c4b5fd,#8b8cf6)",
  "linear-gradient(140deg,#67e8f9,#93c5fd)",
  "linear-gradient(140deg,#a5b4fc,#c084fc)",
];

export const T1 = "linear-gradient(140deg,#7c7ef2,#a78bfa)";
export const T2 = "linear-gradient(140deg,#7dd3fc,#818cf8)";
export const T3 = "linear-gradient(140deg,#67e8f9,#5eead4)";
export const T4 = "linear-gradient(140deg,#c4b5fd,#8b8cf6)";
export const T5 = "linear-gradient(140deg,#c084fc,#f0abfc)";
export const T6 = "linear-gradient(140deg,#a5b4fc,#8b8cf6)";

export const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
];

export const FOOTER_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Status", href: "/status" },
  { label: "Support", href: "/support" },
  { label: "Careers", href: "/careers" },
];

export const HERO_STATS = [
  { value: "2.4 h", label: "Median reply time" },
  { value: "61%", label: "Less inbox noise" },
  { value: "15 GB", label: "Free storage" },
];

export const HERO_CATEGORIES = [
  { label: "Primary", glyph: "✉", logo: T1, on: true },
  { label: "Social", glyph: "◕", logo: T2, on: false },
  { label: "Promotions", glyph: "%", logo: T5, on: false },
  { label: "Newsletters", glyph: "▤", logo: T3, on: false },
];

export const HERO_ROWS = [
  {
    sender: "Maya Lindqvist",
    subject: "Frosted panels for the v3 shell",
    time: "9:42 AM",
    unread: true,
  },
  {
    sender: "Notion Workspace",
    subject: "3 pages shared with you",
    time: "9:08 AM",
    unread: true,
  },
  {
    sender: "Idris Bello",
    subject: "Re: latency on the sync worker",
    time: "8:51 AM",
    unread: true,
  },
  {
    sender: "Clara Osei",
    subject: "Lunch Thursday?",
    time: "8:20 AM",
    unread: true,
  },
  {
    sender: "Tomás Reyes",
    subject: "Contract renewal — signed",
    time: "Yesterday",
    unread: false,
  },
  {
    sender: "Anneke Vos",
    subject: "Board deck v6",
    time: "Mon",
    unread: false,
  },
];

export function initialsOf(name: string) {
  return name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("");
}

export const FEATURES = [
  {
    glyph: "⌘",
    title: "Codes that clear themselves",
    body: "One-time passcodes land in their own lane and disappear 24 hours later.",
    tint: T6,
  },
  {
    glyph: "◨",
    title: "Split reading",
    body: "Keep the list beside the thread on wide screens, full width on a phone.",
    tint: T2,
  },
  {
    glyph: "✎",
    title: "Compose that stays out of the way",
    body: "Write in a popup over the list or take the full page when the reply is long.",
    tint: T1,
  },
  {
    glyph: "◷",
    title: "Snooze with intent",
    body: "Send a thread away until the hour you can actually deal with it.",
    tint: T3,
  },
  {
    glyph: "▤",
    title: "Newsletters in one place",
    body: "Long reads collect in a lane you visit, not a stream you fight.",
    tint: T4,
  },
  {
    glyph: "◑",
    title: "Dark mode that is genuinely dark",
    body: "Same layout, dimmed palette, no glare at midnight.",
    tint: T5,
  },
];

export const PILLARS = [
  {
    glyph: "◧",
    title: "Sorted on arrival",
    body: "Five lanes, assigned before the notification fires.",
    tint: T1,
    points: [
      "Primary keeps humans only",
      "Promotions and newsletters batch by day",
      "Codes expire out of the inbox after a day",
    ],
  },
  {
    glyph: "◨",
    title: "Reader",
    body: "A thread view that keeps quoted history collapsed until you want it.",
    tint: T2,
    points: [
      "Split or full width",
      "Attachments pinned to the top",
      "Inline reply without leaving the list",
    ],
  },
  {
    glyph: "✎",
    title: "Compose",
    body: "Popup for a line, full page for a letter.",
    tint: T4,
    points: [
      "Drafts saved per thread",
      "Send later with a picker, not a plugin",
      "Signatures per address",
    ],
  },
  {
    glyph: "◷",
    title: "Follow-ups",
    body: "Anything you send without a reply comes back on its own.",
    tint: T3,
    points: [
      "Nudges after three days",
      "Snooze to an hour, not a day",
      "Per-thread mute",
    ],
  },
];

export const SECURITY = [
  {
    glyph: "◍",
    title: "Encrypted at rest and in transit",
    body: "AES-256 on disk, TLS 1.3 on the wire, keys rotated quarterly.",
    tint: T1,
  },
  {
    glyph: "◍",
    title: "No ad profiling",
    body: "Pane earns money from subscriptions. Your mail is never sold, brokered or used to target advertising.",
    tint: T2,
  },
  {
    glyph: "⌘",
    title: "Passkeys and hardware keys",
    body: "Sign in with a passkey, or enforce WebAuthn across a whole workspace.",
    tint: T4,
  },
  {
    glyph: "◷",
    title: "Session control",
    body: "See every active session with device and location, and end any of them instantly.",
    tint: T3,
  },
  {
    glyph: "▤",
    title: "Full export, any time",
    body: "Download every message as standard MBOX. Deletion removes backups within 30 days.",
    tint: T6,
  },
  {
    glyph: "◑",
    title: "Open to inspection",
    body: "Third-party penetration tests twice a year, with the summary published.",
    tint: T5,
  },
];

export const COMPLIANCE = [
  {
    name: "SOC 2 Type II",
    note: "Audited annually by an independent firm",
    status: "Current",
  },
  {
    name: "GDPR",
    note: "EU data residency available on Team plans",
    status: "Compliant",
  },
  { name: "HIPAA", note: "BAA offered on Team plans", status: "On request" },
  {
    name: "ISO 27001",
    note: "Certification in progress",
    status: "Q4 2026",
  },
  {
    name: "Penetration test",
    note: "Latest report published June 2026",
    status: "Published",
  },
];

export const PLANS = [
  {
    name: "Free",
    tag: "For one inbox",
    price: "$0",
    unit: "forever",
    blurb: "Everything you need to run a personal address.",
    items: [
      "1 address",
      "15 GB storage",
      "All five sorting lanes",
      "Split reader and compose",
      "Mobile and desktop apps",
    ],
    cta: "Create an account",
    hero: false,
  },
  {
    name: "Personal",
    tag: "Most chosen",
    price: "$6",
    unit: "per month",
    blurb: "Your own domain, longer history and the scheduling tools.",
    items: [
      "Everything in Free",
      "3 custom domains",
      "100 GB storage",
      "Send later and follow-up nudges",
      "Unlimited snooze",
      "Priority support",
    ],
    cta: "Start 30-day trial",
    hero: true,
  },
  {
    name: "Team",
    tag: "For 3 or more",
    price: "$11",
    unit: "per person / month",
    blurb: "Shared addresses and the admin controls a company needs.",
    items: [
      "Everything in Personal",
      "Shared inboxes and assignment",
      "1 TB pooled storage",
      "SAML SSO and SCIM",
      "Audit log and retention rules",
      "GDPR data residency",
    ],
    cta: "Talk to us",
    hero: false,
  },
];

export const FAQ = [
  {
    q: "Can I keep my current address?",
    a: "Yes. Pane can fetch and send from any IMAP or Gmail address while you decide whether to move fully.",
  },
  {
    q: "What happens if I stop paying?",
    a: "The account drops to Free. Nothing is deleted; features above the Free limits are locked until you export or upgrade.",
  },
  {
    q: "Do you offer student pricing?",
    a: "Personal is free for two years with a verified academic address.",
  },
  {
    q: "Is there an annual discount?",
    a: "Paying yearly takes two months off both paid plans.",
  },
];

/** `GET /v1/public/changelog` */
export const RELEASES = [
  {
    version: "3.4",
    date: "22 August 2026",
    tag: "Feature",
    title: "Codes lane and auto-archive",
    items: [
      "One-time passcodes now route to their own lane and archive themselves after 24 hours.",
      "Sender reputation model retrained; misfiled promotions down 38% in testing.",
      "Keyboard shortcut J/K now moves across lanes, not just within one.",
    ],
  },
  {
    version: "3.3",
    date: "8 August 2026",
    tag: "Feature",
    title: "Send later, follow-up nudges",
    items: [
      "Pick an exact send time from compose, no extension required.",
      "Threads you send without a reply resurface after three days.",
      "Draft autosave moved to per-thread storage.",
    ],
  },
  {
    version: "3.2",
    date: "25 July 2026",
    tag: "Improvement",
    title: "Faster first paint",
    items: [
      "Inbox now renders from cache in under 200 ms on repeat visits.",
      "Attachment thumbnails generate server-side.",
      "Reduced memory use on threads over 100 messages.",
    ],
  },
  {
    version: "3.1",
    date: "11 July 2026",
    tag: "Fix",
    title: "Sync and search fixes",
    items: [
      "Fixed IMAP sync stalling on folders with more than 50,000 messages.",
      "Search now matches inside PDF attachments.",
      "Dark mode no longer flashes light on cold load.",
    ],
  },
  {
    version: "3.0",
    date: "27 June 2026",
    tag: "Release",
    title: "The v3 shell",
    items: [
      "New frosted interface across web, macOS and iOS.",
      "Split reading with a resizable divider.",
      "Five sorting lanes replace the old two-tab layout.",
    ],
  },
];

export function releaseTagTint(tag: string): [string, string] {
  if (tag === "Release") return ["#7c7ef2", "#fff"];
  if (tag === "Fix") return ["rgba(103,232,249,.22)", "#4c46b8"];
  if (tag === "Feature") return ["rgba(124,126,242,.16)", "#4c46b8"];
  return ["rgba(167,139,250,.18)", "#4c46b8"];
}

export const PRIVACY_SECTIONS = [
  {
    title: "What we collect",
    body: "Your account details, the mail you store with us, and the technical logs needed to deliver it. Nothing else is gathered, and nothing is bought from third parties.",
  },
  {
    title: "What we never do",
    body: "Pane does not read message bodies for advertising, does not sell or broker data, and does not use your mail to train models — ours or anyone else’s.",
  },
  {
    title: "How sorting works",
    body: "Lane assignment runs on message headers, sender reputation and your own corrections. The model is per-account and never pooled across users.",
  },
  {
    title: "Where data lives",
    body: "Messages are stored encrypted in the region you pick at signup. Team plans can pin storage to the EU.",
  },
  {
    title: "How long we keep it",
    body: "Deleted mail leaves live systems immediately and backups within 30 days. Logs are retained for 90 days, then discarded.",
  },
  {
    title: "Sub-processors",
    body: "A short published list covering hosting, payments and error reporting. Changes are announced 30 days before they take effect.",
  },
  {
    title: "Your rights",
    body: "Export, correct or delete everything at any time from Settings, or by writing to privacy@pane.com. Requests are answered within 30 days.",
  },
  {
    title: "Cookies",
    body: "One session cookie and one preference cookie. No analytics or advertising cookies are set.",
  },
];

export const TERMS_SECTIONS = [
  {
    title: "The agreement",
    body: "Using Pane means accepting these terms. If you use it on behalf of a company, you confirm you may bind that company.",
  },
  {
    title: "Your account",
    body: "You are responsible for keeping credentials safe. Enable a passkey or hardware key; we will never ask for your password.",
  },
  {
    title: "Acceptable use",
    body: "No spam, phishing, malware or bulk unsolicited mail. Accounts sending it are suspended without notice.",
  },
  {
    title: "Your content",
    body: "Your mail stays yours. You grant Pane only the licence needed to store, index and deliver it on your behalf.",
  },
  {
    title: "Payment",
    body: "Paid plans bill in advance, yearly or monthly. Downgrades apply at the end of the current period; annual plans are refundable pro rata in the first 30 days.",
  },
  {
    title: "Availability",
    body: "We target 99.95% monthly uptime. Sustained misses on paid plans earn service credits, requested through support.",
  },
  {
    title: "Ending it",
    body: "Cancel whenever you like and take a full MBOX export. We may close an account for repeated breaches, with notice unless the breach is severe.",
  },
  {
    title: "Liability",
    body: "Pane is provided as is beyond the warranties given here. Liability is capped at the fees paid in the previous twelve months.",
  },
];

/** `GET /v1/public/status` */
export const SERVICES = [
  {
    name: "Mail delivery",
    note: "Inbound and outbound SMTP",
    status: "Operational",
    uptime: "99.99%",
    degraded: false,
  },
  {
    name: "Web app",
    note: "app.pane.com",
    status: "Operational",
    uptime: "99.98%",
    degraded: false,
  },
  {
    name: "Mobile sync",
    note: "iOS and Android push",
    status: "Operational",
    uptime: "99.97%",
    degraded: false,
  },
  {
    name: "Search",
    note: "Indexing and query",
    status: "Degraded",
    uptime: "99.82%",
    degraded: true,
  },
  {
    name: "IMAP import",
    note: "Migration workers",
    status: "Operational",
    uptime: "99.94%",
    degraded: false,
  },
  {
    name: "API",
    note: "Public v2 endpoints",
    status: "Operational",
    uptime: "99.99%",
    degraded: false,
  },
];

/** 90-day uptime strip. Deterministic so server and client renders agree. */
export function uptimeBars(count: number, seed: number, degraded: boolean) {
  return Array.from({ length: count }, (_, i) => {
    const bad = degraded && i > count - 5;
    return {
      h: `${bad ? 12 : 18 + ((i * 7 + seed * 5) % 9)}px`,
      color: bad ? "#c084fc" : "rgba(94,234,212,.85)",
    };
  });
}

export const INCIDENTS = [
  {
    date: "19 Aug 2026",
    severity: "Minor",
    title: "Search indexing lag",
    body: "New mail took up to four minutes to appear in search results after a shard rebalance. Delivery and the inbox were unaffected.",
    duration: "1h 12m",
  },
  {
    date: "2 Aug 2026",
    severity: "Major",
    title: "Outbound delivery delays",
    body: "A queue misconfiguration held outbound mail for some accounts in eu-west. All held mail was delivered once the queue drained.",
    duration: "2h 40m",
  },
  {
    date: "14 Jul 2026",
    severity: "Minor",
    title: "Push notifications on iOS",
    body: "Push tokens issued during a 20 minute window were rejected. Affected devices re-registered on next launch.",
    duration: "38m",
  },
];

export const SUPPORT_CHANNELS = [
  {
    glyph: "✉",
    title: "Email support",
    body: "Write to help@pane.com from any address on your account. Include the thread if it helps.",
    meta: "Median first reply: 41 minutes",
    tint: T2,
  },
  {
    glyph: "◑",
    title: "In-app chat",
    body: "Open the question mark in the top right of the app. Available while you are signed in.",
    meta: "Weekdays 07:00–22:00 UTC",
    tint: T3,
  },
  {
    glyph: "⌘",
    title: "Priority line",
    body: "Personal and Team plans get a direct queue, plus a named contact for Team.",
    meta: "Answered within 15 minutes",
    tint: T5,
  },
];

export const HELP_TOPICS = [
  {
    q: "I lost access to my passkey",
    a: "Use a backup key or a recovery code from Settings. With neither, identity verification takes about 48 hours.",
  },
  {
    q: "Mail is landing in the wrong lane",
    a: 'Move one message and pick "apply to sender". Corrections take effect immediately for future mail.',
  },
  {
    q: "My import stalled",
    a: "Imports over 100,000 messages pause and resume in batches. If progress has not moved in six hours, write to us with the account address.",
  },
  {
    q: "How do I export everything?",
    a: "Settings → Data → Export. You get standard MBOX plus a JSON file of labels and filters, usually within an hour.",
  },
  {
    q: "Can I use my own domain?",
    a: "Personal and Team plans support custom domains. Pane checks the DNS records for you and tells you exactly what to change.",
  },
  {
    q: "Billing receipt or VAT number",
    a: "Settings → Billing has every invoice. Add a VAT number there and past invoices are reissued automatically.",
  },
];

export const PERKS = [
  {
    title: "Remote, with real overlap",
    body: "Work from anywhere within UTC−3 to UTC+4. Two weeks a year together, expenses covered.",
  },
  {
    title: "Paid to the same band",
    body: "Salary bands are public inside the company and do not flex on where you live or how hard you negotiate.",
  },
  {
    title: "Six weeks off",
    body: "Plus your local public holidays, and a company-wide close between Christmas and New Year.",
  },
  {
    title: "Ship in week one",
    body: "Everyone merges something in their first five days. Onboarding is a pairing rota, not a slide deck.",
  },
  {
    title: "Equipment budget",
    body: "£3,000 to set up, refreshed every three years, yours to keep after two.",
  },
  {
    title: "No on-call rota",
    body: "Incidents are handled by whoever shipped the change, during their working hours. Nights are covered by design, not by people.",
  },
];

/** `GET /v1/public/roles` */
export const ROLES = [
  {
    title: "Senior product engineer",
    team: "Engineering",
    location: "Remote (Europe)",
    range: "£95k–£125k",
  },
  {
    title: "iOS engineer",
    team: "Engineering",
    location: "Remote (Europe)",
    range: "£90k–£115k",
  },
  {
    title: "Infrastructure engineer",
    team: "Platform",
    location: "Remote (Europe)",
    range: "£100k–£130k",
  },
  {
    title: "Product designer",
    team: "Design",
    location: "Remote (Europe)",
    range: "£85k–£110k",
  },
  {
    title: "Support engineer",
    team: "Support",
    location: "Remote (UTC−3 to UTC+4)",
    range: "£55k–£70k",
  },
];

export const AUTH_PROVIDERS = [
  { label: "Continue with Google", glyph: "G", tint: T2 },
  { label: "Continue with a passkey", glyph: "⌘", tint: T1 },
];
