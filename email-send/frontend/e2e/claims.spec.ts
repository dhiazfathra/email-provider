import { expect, test } from "@playwright/test";
import { readDecisionsText } from "@/lib/decisions";
import {
  ALLOWED_NUMERALS,
  DELETED_NUMERALS,
  FORBIDDEN_PHRASES,
} from "../tests/claims-allowlist";

const ROUTES = ["/", "/docs"];

// Excludes a digit run glued to letters on either side (D1, H27, SHA256) so a
// decision identifier or algorithm name can't be mistaken for a decided
// numeric value.
const NUMERAL_RE =
  /(?<![A-Za-z0-9])\d[\d,]*(?:\.\d+)*(?: ?(?:%|ms|B|M|k))?(?![A-Za-z0-9])/g;

const numerals = (text: string) => [...new Set(text.match(NUMERAL_RE) ?? [])];

for (const route of ROUTES) {
  test(`${route} renders no fabricated or undecided numeral`, async ({
    page,
  }) => {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    // Word-bounded extraction (not a raw substring check) so an undecided
    // numeral like "1" can't pass just because it occurs inside an unrelated
    // identifier such as "D1".
    const decidedValues = new Set(numerals(readDecisionsText()));
    const deleted = new Set(DELETED_NUMERALS);
    const allowed = new Set(ALLOWED_NUMERALS.map((a) => a.value));
    const offenders = numerals(text).filter(
      (n) =>
        deleted.has(n.trim()) ||
        (!allowed.has(n.trim()) && !decidedValues.has(n.trim())),
    );
    expect(offenders).toEqual([]);
  });

  test(`${route} renders no service or contractual promise`, async ({
    page,
  }) => {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    const found = FORBIDDEN_PHRASES.filter((p) =>
      new RegExp(
        `\\b${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}s?\\b`,
        "i",
      ).test(text),
    );
    expect(found).toEqual([]);
  });
}
