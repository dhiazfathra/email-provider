import { expect, test } from "vitest";
import { ACTIVITY_RETENTION_DAYS, SEND_RATE_PER_SECOND } from "@/lib/limits";
import { readLimits } from "@/lib/decisions";

test("the limits module matches the D2 block verbatim", () => {
  const decided = readLimits();
  expect(String(SEND_RATE_PER_SECOND)).toBe(decided.send_rate_per_second);
  expect(String(ACTIVITY_RETENTION_DAYS)).toBe(decided.activity_retention_days);
});

test("no quota and no billing exist in the PoC", () => {
  const decided = readLimits();
  expect(decided.monthly_quota).toBe("none");
  expect(decided.billing).toBe("none");
});
