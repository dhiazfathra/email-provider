import { expect, test } from "vitest";
import {
  AUDIT_CATEGORIES,
  MESSAGE_STATES,
  STREAMS,
  isStream,
} from "@/lib/enums";
import { MESSAGES } from "@/lib/data/messages";
import { AUDIT_ENTRIES } from "@/lib/data/audit";
import { isAuditCategory, isMessageState } from "@/lib/enums";

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

test("every value in the data is an enum member", () => {
  for (const m of MESSAGES) {
    expect(isStream(m.stream), `${m.id} stream=${m.stream}`).toBe(true);
    expect(isMessageState(m.state), `${m.id} state=${m.state}`).toBe(true);
  }
  for (const a of AUDIT_ENTRIES) {
    expect(isAuditCategory(a.category), a.category).toBe(true);
  }
});

test("every audit category used in the data has a filter chip", () => {
  const used = new Set(AUDIT_ENTRIES.map((a) => a.category));
  const filterChips = new Set(AUDIT_CATEGORIES);
  for (const c of used) {
    expect(filterChips.has(c), `${c} has no filter chip`).toBe(true);
  }
});
