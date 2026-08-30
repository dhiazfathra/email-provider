/** `GET /v2/projects/{projectId}/suppressions` — reasons are lowercase (D11). */
export const SUPPRESSIONS = [
  {
    address: "old.address@defunctcorp.com",
    reason: "hard bounce",
    source: "SMTP 550 5.1.1",
    added: "28 Aug",
  },
  {
    address: "j.kowalski@example.org",
    reason: "unsubscribed",
    source: "List-Unsubscribe",
    added: "28 Aug",
  },
  {
    address: "postmaster@blackhole.test",
    reason: "hard bounce",
    source: "SMTP 550 5.1.10",
    added: "27 Aug",
  },
  {
    address: "marta@ex-employee.co",
    reason: "complaint",
    source: "Feedback loop",
    added: "27 Aug",
  },
  {
    address: "sales@parked-domain.biz",
    reason: "hard bounce",
    source: "DNS NXDOMAIN",
    added: "26 Aug",
  },
  {
    address: "reader@newsroom.media",
    reason: "unsubscribed",
    source: "Preference centre",
    added: "26 Aug",
  },
  {
    address: "abuse-report@isp.net",
    reason: "complaint",
    source: "Feedback loop",
    added: "25 Aug",
  },
  {
    address: "temp1934@10minutemail.dev",
    reason: "hard bounce",
    source: "SMTP 554 5.7.1",
    added: "25 Aug",
  },
];

/** D14 — derived, never stored. */
export const suppressStats = () => {
  const counts = SUPPRESSIONS.reduce<Record<string, number>>((acc, s) => {
    acc[s.reason] = (acc[s.reason] ?? 0) + 1;
    return acc;
  }, {});
  return [
    {
      label: "Total suppressed",
      value: SUPPRESSIONS.length,
      note: "across all streams",
    },
    {
      label: "Hard bounces",
      value: counts["hard bounce"] ?? 0,
      note: "auto-added",
    },
    {
      label: "Complaints",
      value: counts["complaint"] ?? 0,
      note: "feedback loops",
    },
    {
      label: "Unsubscribes",
      value: counts["unsubscribed"] ?? 0,
      note: "List-Unsubscribe",
    },
  ];
};
