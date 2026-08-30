import { expect, test } from "@playwright/test";
import { readDecisionsText } from "@/lib/decisions";
import {
  ALLOWED_NUMERALS,
  DELETED_NUMERALS,
  FORBIDDEN_PHRASES,
} from "../tests/claims-allowlist";

const ROUTES = ["/", "/docs"];

const numerals = (text: string) => [
  ...new Set(text.match(/\d[\d,]*(?:\.\d+)* ?(?:%|ms|B|M|k)?/g) ?? []),
];

for (const route of ROUTES) {
  test(`${route} renders no fabricated or undecided numeral`, async ({
    page,
  }) => {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    const decided = readDecisionsText();
    const deleted = new Set(DELETED_NUMERALS);
    const allowed = new Set(ALLOWED_NUMERALS.map((a) => a.value));
    const offenders = numerals(text).filter(
      (n) =>
        deleted.has(n.trim()) ||
        (!allowed.has(n.trim()) && !decided.includes(n.trim())),
    );
    expect(offenders).toEqual([]);
  });

  test(`${route} renders no service or contractual promise`, async ({
    page,
  }) => {
    await page.goto(route);
    const text = await page.locator("body").innerText();
    const found = FORBIDDEN_PHRASES.filter((p) =>
      new RegExp(`\\b${p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(
        text,
      ),
    );
    expect(found).toEqual([]);
  });
}
