/** D1 — closed stream enum. Customer-defined tags are deferred. */
export const STREAMS = ["transactional", "notifications", "bulk"] as const;

/** D4 — exclusive delivery states. Engagement is deferred to a second axis. */
export const MESSAGE_STATES = [
  "queued",
  "delivered",
  "bounced",
  "deferred",
  "suppressed",
] as const;

/** D17 — the audit filter set is derived from this, never typed separately. */
export const AUDIT_CATEGORIES = [
  "keys",
  "domains",
  "templates",
  "suppressions",
  "members",
] as const;

export type Stream = (typeof STREAMS)[number];
export type MessageState = (typeof MESSAGE_STATES)[number];
export type AuditCategory = (typeof AUDIT_CATEGORIES)[number];

export const isStream = (v: string): v is Stream =>
  (STREAMS as readonly string[]).includes(v);
export const isMessageState = (v: string): v is MessageState =>
  (MESSAGE_STATES as readonly string[]).includes(v);
export const isAuditCategory = (v: string): v is AuditCategory =>
  (AUDIT_CATEGORIES as readonly string[]).includes(v);
