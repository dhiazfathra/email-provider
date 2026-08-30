/** D11 — presentation lives here, never in the data modules. */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const relativeTime = (iso: string, now: Date = new Date()): string => {
  const delta = now.getTime() - new Date(iso).getTime();
  if (delta < MINUTE) return "just now";
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)} min ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)} h ago`;
  if (delta < 7 * DAY) return `${Math.floor(delta / DAY)} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};

export const maskKey = (prefix: string, last4: string): string =>
  `${prefix}_${"•".repeat(8)}${last4}`;

export const formatCount = (n: number): string => n.toLocaleString("en-GB");
