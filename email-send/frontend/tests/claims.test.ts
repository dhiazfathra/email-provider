import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { readDecisionsText } from "@/lib/decisions";
import {
  ALLOWED_NUMERALS,
  DELETED_NUMERALS,
  FORBIDDEN_PHRASES,
} from "./claims-allowlist";

const COPY_FILES = ["lib/mock/landing.ts", "lib/mock/docs.ts"];

const copy = () => COPY_FILES.map((f) => readFileSync(f, "utf8")).join("\n");

const numerals = (text: string) => [
  ...new Set(text.match(/\d[\d.,]*\s?(?:%|ms|B|M|k)?/g) ?? []),
];

describe("claims", () => {
  test("every numeral in copy is in the decisions record or the allowlist", () => {
    // A deleted fabrication (e.g. "99.31%") still appears somewhere in the
    // record's prose narrating its own deletion, so it must be blocked
    // explicitly rather than relying on absence from the record text.
    const decided = readDecisionsText();
    const deleted = new Set(DELETED_NUMERALS);
    const allowed = new Set(ALLOWED_NUMERALS.map((a) => a.value));
    const offenders = numerals(copy()).filter(
      (n) =>
        deleted.has(n.trim()) ||
        (!allowed.has(n.trim()) && !decided.includes(n.trim())),
    );
    expect(offenders).toEqual([]);
  });

  test("copy contains no service or contractual promise", () => {
    const text = copy();
    const found = FORBIDDEN_PHRASES.filter((p) =>
      new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
        text,
      ),
    );
    expect(found).toEqual([]);
  });
});
