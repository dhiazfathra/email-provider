/** `GET /v2/projects/{projectId}/keys` — masking and relative time happen at the render site (D11). */
export const KEYS = [
  {
    name: "Production server",
    prefix: "plume_live_sk_9f2b",
    last4: "4c71",
    scope: "Full access",
    used_at: "2026-08-30T09:58:00Z",
  },
  {
    name: "CI pipeline",
    prefix: "plume_live_sk_4a08",
    last4: "b1e9",
    scope: "Send only",
    used_at: "2026-08-30T09:00:00Z",
  },
  {
    name: "Analytics reader",
    prefix: "plume_live_rk_77dc",
    last4: "20af",
    scope: "Read only",
    used_at: "2026-08-29T10:00:00Z",
  },
  {
    name: "Staging",
    prefix: "plume_test_sk_c310",
    last4: "88fa",
    scope: "Full access · test",
    used_at: "2026-08-27T10:00:00Z",
  },
];
