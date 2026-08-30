/**
 * Mock data for the Plume console. Each block names the endpoint that replaces
 * it — see `app/console/console.contract.md`.
 */

import { MESSAGES, type Message } from "@/lib/data/messages";
import { STREAMS as STREAM_IDS } from "@/lib/enums";

export const T1 = "linear-gradient(140deg,#7c7ef2,#a78bfa)";
export const T2 = "linear-gradient(140deg,#7dd3fc,#818cf8)";
export const T3 = "linear-gradient(140deg,#67e8f9,#5eead4)";
export const T4 = "linear-gradient(140deg,#c4b5fd,#8b8cf6)";
export const T5 = "linear-gradient(140deg,#c084fc,#f0abfc)";

/** Badge counts are computed at the render site from lib/data/*, never typed here (H29). */
export const NAV = [
  { href: "/console", glyph: "◧", label: "Overview" },
  { href: "/console/activity", glyph: "▤", label: "Activity" },
  { href: "/console/templates", glyph: "✎", label: "Templates" },
  { href: "/console/domains", glyph: "◍", label: "Domains" },
  { href: "/console/keys", glyph: "⌘", label: "API keys" },
  { href: "/console/suppressions", glyph: "⊘", label: "Suppressions" },
  { href: "/console/audit", glyph: "◈", label: "Audit log" },
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

const STREAM_TINT: Record<(typeof STREAM_IDS)[number], string> = {
  transactional: T1,
  notifications: T4,
  bulk: T3,
};

/** Top-streams widget, counted from MESSAGES (D1, D14). */
export const STREAMS = STREAM_IDS.map((name) => {
  const count = MESSAGES.filter((m) => m.stream === name).length;
  const max = Math.max(
    1,
    ...STREAM_IDS.map((s) => MESSAGES.filter((m) => m.stream === s).length),
  );
  return {
    name,
    count,
    pct: `${Math.round((count / max) * 100)}%`,
    tint: STREAM_TINT[name],
  };
});

export const REPUTATION = [
  { label: "Gmail", value: "98.7", color: "#0e8f80" },
  { label: "Outlook / Hotmail", value: "96.2", color: "#0e8f80" },
  { label: "Yahoo", value: "94.8", color: "#0e8f80" },
  { label: "Apple iCloud", value: "91.3", color: "#6d4fd6" },
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
  const row: Message | undefined = MESSAGES[index];
  if (!row) return null;
  const bounced = row.state === "bounced";
  return {
    ...row,
    trace: [
      {
        step: "Accepted by API",
        detail: `POST /v2/send · 202`,
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
        step: row.state,
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
