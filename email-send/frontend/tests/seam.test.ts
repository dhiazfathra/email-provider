import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const walk = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );

test("no page imports the data modules directly", () => {
  const offenders = walk("app")
    .filter((f) => f.endsWith(".tsx"))
    .filter((f) => readFileSync(f, "utf8").includes("@/lib/data/"));
  expect(offenders).toEqual([]);
});
