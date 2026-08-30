import { expect, test } from "vitest";
import { MESSAGES, messageCounts } from "@/lib/data/messages";
import { MESSAGE_STATES } from "@/lib/enums";

test("filter counts partition the message list exactly", () => {
  const counts = messageCounts();
  const summed = MESSAGE_STATES.reduce((n, s) => n + (counts[s] ?? 0), 0);
  expect(summed).toBe(MESSAGES.length);
});

test("no count is stored in the data", () => {
  const raw = JSON.stringify(MESSAGES);
  expect(raw).not.toMatch(/"count"/);
});
