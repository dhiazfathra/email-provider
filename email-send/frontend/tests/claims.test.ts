import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { readDecisionsText } from "@/lib/decisions";
import { ALLOWED_NUMERALS, FORBIDDEN_PHRASES } from "./claims-allowlist";

const COPY_FILES = ["lib/mock/landing.ts", "lib/mock/docs.ts"];

const copy = () => COPY_FILES.map((f) => readFileSync(f, "utf8")).join("\n");

const numerals = (text: string) => [
  ...new Set(text.match(/\d[\d.,]*\s?(?:%|ms|B|M|k)?/g) ?? []),
];

describe("claims", () => {
  test("every numeral in copy is in the decisions record or the allowlist", () => {
    const decided = readDecisionsText();
    const allowed = new Set(ALLOWED_NUMERALS.map((a) => a.value));
    const offenders = numerals(copy()).filter(
      (n) => !allowed.has(n.trim()) && !decided.includes(n.trim()),
    );
    expect(offenders).toEqual([]);
  });

  test("copy contains no service or contractual promise", () => {
    const text = copy();
    const found = FORBIDDEN_PHRASES.filter((p) => text.includes(p));
    expect(found).toEqual([]);
  });
});
