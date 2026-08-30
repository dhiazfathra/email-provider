export const RANGES = ["24h", "7d", "30d"] as const;
export type Range = (typeof RANGES)[number];

export const DEFAULT_RANGE: Range = "7d";

/** Window length in milliseconds, used by the api seam's filters. */
export const RANGE_MS: Record<Range, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export const isRange = (v: string | undefined): v is Range =>
  !!v && (RANGES as readonly string[]).includes(v);
