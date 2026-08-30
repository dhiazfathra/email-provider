import { readFileSync } from "node:fs";
import { join } from "node:path";

/** The decisions record lives one directory above the frontend. */
const RECORD = join(process.cwd(), "..", "PRODUCT_DECISIONS.md");

export const readDecisionsText = (): string => readFileSync(RECORD, "utf8");

/**
 * Parses the single fenced `plume.limits` block under D2 into key/value pairs.
 * Parsing rather than copying is the point: a changed decision changes what the
 * tests expect, in the same commit.
 */
export const readLimits = (): Record<string, string> => {
  const block = readDecisionsText().match(
    /```\s*\nplume\.limits\n([\s\S]*?)```/,
  );
  if (!block) throw new Error("PRODUCT_DECISIONS.md: no plume.limits block");
  return Object.fromEntries(
    block[1]
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return [key.trim(), rest.join(":").trim()];
      }),
  );
};
