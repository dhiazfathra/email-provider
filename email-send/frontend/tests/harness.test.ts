import { expect, test } from "vitest";
import { RANGES } from "@/lib/ranges";

test("the test harness resolves the @/ alias", () => {
  expect(RANGES).toEqual(["24h", "7d", "30d"]);
});
