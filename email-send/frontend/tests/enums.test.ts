import { expect, test } from "vitest";
import { MESSAGE_STATES, STREAMS, isStream } from "@/lib/enums";

test("streams are the three decided in D1, lowercase", () => {
  expect(STREAMS).toEqual(["transactional", "notifications", "bulk"]);
});

test("message states exclude engagement, per D4", () => {
  expect(MESSAGE_STATES).toEqual([
    "queued",
    "delivered",
    "bounced",
    "deferred",
    "suppressed",
  ]);
  expect(MESSAGE_STATES).not.toContain("opened");
});

test("isStream rejects the values the mocks used", () => {
  expect(isStream("transactional")).toBe(true);
  expect(isStream("receipts")).toBe(false);
  expect(isStream("broadcast")).toBe(false);
});
