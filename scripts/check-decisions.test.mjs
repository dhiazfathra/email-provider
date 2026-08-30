import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseDisposition,
  parseLimits,
  parseRegister,
} from "./check-decisions.mjs";

test("parseRegister finds every H-number in the remediation plan", () => {
  const found = parseRegister(
    "| H1 | a | b | c | P |\n| H37 | d | e | f | C |",
  );
  assert.deepEqual(found, ["H1", "H37"]);
});

test("parseDisposition maps an H-number to its decision and action", () => {
  const table =
    "| H | Claim | Decision | Action |\n|---|---|---|---|\n| H12 | trace_url | D10 | delete |";
  assert.deepEqual(parseDisposition(table).get("H12"), {
    decision: "D10",
    action: "delete",
  });
});

test("parseLimits reads the fenced D2 block", () => {
  const block =
    "```\nplume.limits\n  send_rate_per_second: 100\n  billing: none\n```";
  assert.deepEqual(parseLimits(block), {
    send_rate_per_second: "100",
    billing: "none",
  });
});
