/** Mock data for the Plume landing page. Replace with `GET /v2/public/landing`. */

export type CodeLine = { line: string; color: string };
export type CodeLang = "curl" | "node" | "python";

const INK = "#dcd9ff";
const KEY = "#a5b4fc";
const VAL = "#67e8f9";
const OK = "#5eead4";

export const CODE: Record<CodeLang, CodeLine[]> = {
  curl: [
    ["curl https://api.plume.email/v2/send \\", KEY],
    ['  -H "Authorization: Bearer $PLUME_KEY" \\', INK],
    ['  -H "Content-Type: application/json" \\', INK],
    ["  -d '{", INK],
    ['    "from": "receipts@harbor.app",', VAL],
    ['    "to": "ana@northloop.io",', VAL],
    ['    "template": "receipt-v3",', VAL],
    ['    "vars": { "total": "€48.00" },', VAL],
    ['    "stream": "receipts"', VAL],
    ["  }'", INK],
    ["", INK],
    ['→ 202 { "id": "msg_01J8K2QF7ZP" }', OK],
  ].map(([line, color]) => ({ line, color })),
  node: [
    ['import { Plume } from "@plume/sdk";', KEY],
    ["", INK],
    ["const plume = new Plume(process.env.PLUME_KEY);", INK],
    ["", INK],
    ["const { id } = await plume.send({", INK],
    ['  from: "receipts@harbor.app",', VAL],
    ['  to: "ana@northloop.io",', VAL],
    ['  template: "receipt-v3",', VAL],
    ['  vars: { total: "€48.00" },', VAL],
    ['  stream: "receipts",', VAL],
    ["});", INK],
    ["", INK],
    ['// id → "msg_01J8K2QF7ZP"', OK],
  ].map(([line, color]) => ({ line, color })),
  python: [
    ["from plume import Plume", KEY],
    ["", INK],
    ['plume = Plume(os.environ["PLUME_KEY"])', INK],
    ["", INK],
    ["msg = plume.send(", INK],
    ['    sender="receipts@harbor.app",', VAL],
    ['    to="ana@northloop.io",', VAL],
    ['    template="receipt-v3",', VAL],
    ['    vars={"total": "€48.00"},', VAL],
    ['    stream="receipts",', VAL],
    [")", INK],
    ["", INK],
    ['# msg.id → "msg_01J8K2QF7ZP"', OK],
  ].map(([line, color]) => ({ line, color })),
};

export const LANGS: { label: string; id: CodeLang }[] = [
  { label: "cURL", id: "curl" },
  { label: "Node", id: "node" },
  { label: "Python", id: "python" },
];

const T1 = "linear-gradient(140deg,#7c7ef2,#a78bfa)";
const T2 = "linear-gradient(140deg,#7dd3fc,#818cf8)";
const T3 = "linear-gradient(140deg,#67e8f9,#5eead4)";
const T4 = "linear-gradient(140deg,#c4b5fd,#8b8cf6)";
const T5 = "linear-gradient(140deg,#c084fc,#f0abfc)";
const T6 = "linear-gradient(140deg,#a5b4fc,#8b8cf6)";

export const FEATURES = [
  {
    glyph: "◧",
    title: "A trace for every message",
    body: "Follow one message from the API call through rendering, the MTA and the recipient server, with the raw SMTP response attached.",
    tint: T1,
  },
  {
    glyph: "⌘",
    title: "Streams that stay separate",
    body: "Receipts, resets and bulk sends run on their own reputation. A bad campaign cannot take your password resets down with it.",
    tint: T2,
  },
  {
    glyph: "✎",
    title: "Versioned templates",
    body: "Render server-side with typed variables. Every version is kept, and a bad deploy rolls back in one click.",
    tint: T4,
  },
  {
    glyph: "⊘",
    title: "Suppression enforced on send",
    body: "Hard bounces, complaints and unsubscribes are checked before the API accepts the message, so you never pay to bounce twice.",
    tint: T3,
  },
  {
    glyph: "◍",
    title: "Domain setup that checks itself",
    body: "Plume watches SPF, DKIM, DMARC and return-path records and tells you the moment one drifts.",
    tint: T6,
  },
  {
    glyph: "◑",
    title: "Webhooks you can replay",
    body: "Every delivery event is retained for 30 days and can be replayed into your endpoint after an outage.",
    tint: T5,
  },
];

export const NAV_LINKS = ["Docs", "Console"];
export const FOOTER_LINKS = ["Docs", "Console"];
