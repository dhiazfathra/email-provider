import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

// Catches both the "@/lib/data/" alias and any relative path landing on
// lib/data (e.g. "../../lib/data/messages"), so a relative import can't
// bypass this guard.
const IMPORTS_DATA_MODULE = /from\s+["'](?:@\/|\.\.?\/)*lib\/data\//;

test("no page imports the data modules directly", () => {
  const offenders = walk("app")
    .filter((f) => f.endsWith(".tsx"))
    .filter((f) => IMPORTS_DATA_MODULE.test(readFileSync(f, "utf8")));
  expect(offenders).toEqual([]);
});
