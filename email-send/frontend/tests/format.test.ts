import { expect, test } from "vitest";
import { formatCount, maskKey, relativeTime } from "@/lib/format";
import { stateTint } from "@/lib/theme";
import { MESSAGE_STATES } from "@/lib/enums";

const NOW = new Date("2026-08-30T10:00:00Z");

test("relativeTime renders recent times in minutes", () => {
  expect(relativeTime("2026-08-30T09:58:00Z", NOW)).toBe("2 min ago");
});

test("relativeTime falls back to a date beyond a week", () => {
  expect(relativeTime("2026-08-01T09:00:00Z", NOW)).toBe("1 Aug");
});

test("maskKey never contains the secret", () => {
  expect(maskKey("plume_live", "4f2a")).toBe("plume_live_••••••••4f2a");
});

test("formatCount does not invent magnitude", () => {
  expect(formatCount(12)).toBe("12");
  expect(formatCount(1204)).toBe("1,204");
});

test("every message state has a tint", () => {
  for (const state of MESSAGE_STATES) {
    expect(stateTint(state).fg).toMatch(/^#|^rgba/);
  }
});
