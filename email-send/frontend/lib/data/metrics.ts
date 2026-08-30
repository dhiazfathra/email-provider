import type { Range } from "@/lib/ranges";

const RANGE_SCALE: Record<Range, number> = { "24h": 0.08, "7d": 1, "30d": 4.1 };

export type Kpi = {
  label: string;
  value: number;
  unit: "count" | "pct";
  delta: number;
};

/** `GET /v2/projects/{projectId}/metrics?range=` — colour derives from the delta sign at render. */
export const kpisForRange = (range: Range): Kpi[] => {
  const scale = RANGE_SCALE[range];
  return [
    {
      label: "Sent",
      value: Math.round(1_362_004 * scale),
      unit: "count",
      delta: 8.4,
    },
    { label: "Delivered", value: 99.31, unit: "pct", delta: 0.12 },
    { label: "Bounced", value: 0.42, unit: "pct", delta: -0.06 },
    { label: "Complaints", value: 0.014, unit: "pct", delta: 0.003 },
  ];
};
