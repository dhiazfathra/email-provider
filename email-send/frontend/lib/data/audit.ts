import type { AuditCategory } from "@/lib/enums";

/** `GET /v2/projects/{projectId}/audit?category=` — categories are AuditCategory (D17). */
export const AUDIT_ENTRIES: {
  id: string;
  category: AuditCategory;
  actor: string;
  ip: string;
  at: string;
}[] = [
  {
    id: "aud_01",
    actor: "Maya Ellery",
    category: "keys",
    ip: "203.0.113.24",
    at: "2026-08-30T09:44:00Z",
  },
  {
    id: "aud_02",
    actor: "ci-bot@harbor.app",
    category: "templates",
    ip: "0.0.0.0",
    at: "2026-08-30T09:12:00Z",
  },
  {
    id: "aud_03",
    actor: "Devan Roy",
    category: "domains",
    ip: "198.51.100.7",
    at: "2026-08-30T08:51:00Z",
  },
  {
    id: "aud_04",
    actor: "Maya Ellery",
    category: "members",
    ip: "203.0.113.24",
    at: "2026-08-29T17:30:00Z",
  },
  {
    id: "aud_05",
    actor: "Devan Roy",
    category: "suppressions",
    ip: "198.51.100.7",
    at: "2026-08-29T15:02:00Z",
  },
  {
    id: "aud_06",
    actor: "ci-bot@harbor.app",
    category: "templates",
    ip: "0.0.0.0",
    at: "2026-08-29T11:48:00Z",
  },
  {
    id: "aud_07",
    actor: "Priya Naidu",
    category: "members",
    ip: "192.0.2.88",
    at: "2026-08-27T16:19:00Z",
  },
  {
    id: "aud_08",
    actor: "Maya Ellery",
    category: "keys",
    ip: "203.0.113.24",
    at: "2026-08-27T10:05:00Z",
  },
  {
    id: "aud_09",
    actor: "Priya Naidu",
    category: "domains",
    ip: "192.0.2.88",
    at: "2026-08-26T14:37:00Z",
  },
  {
    id: "aud_10",
    actor: "Maya Ellery",
    category: "keys",
    ip: "203.0.113.24",
    at: "2026-08-26T09:11:00Z",
  },
];

/** Action/target copy, keyed by entry id — presentation, not the audit record. */
export const AUDIT_DESCRIPTIONS: Record<
  string,
  { action: string; target: string }
> = {
  aud_01: { action: "Key created", target: "plume_live_sk_4a08…b1e9" },
  aud_02: { action: "Template published", target: "receipt@3" },
  aud_03: { action: "Domain verified", target: "mail.harbor.app" },
  aud_04: { action: "Member invited", target: "t.okonkwo@lattice.co" },
  aud_05: { action: "Suppression removed", target: "reader@newsroom.media" },
  aud_06: { action: "Template published", target: "login-code@4" },
  aud_07: { action: "Role changed", target: "devan@harbor.app → Admin" },
  aud_08: { action: "Key revoked", target: "plume_test_sk_1ab4…90cd" },
  aud_09: { action: "Setting changed", target: "DMARC policy → quarantine" },
  aud_10: { action: "Login failed", target: "maya@harbor.app · 3 attempts" },
};
