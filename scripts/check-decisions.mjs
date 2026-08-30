#!/usr/bin/env node
/**
 * Verifies email-send/PRODUCT_DECISIONS.md against the hallucination register in
 * FRONTEND_REMEDIATION_PLAN.md: every H-number resolved, every status legal, the
 * D2 limits block parseable. Exits non-zero on any gap.
 */
import { readFileSync } from "node:fs";

const VALID_STATUSES = ["committed", "deferred", "cut"];

/** H-numbers as they appear in the register's leading table column. */
export const parseRegister = (text) => [
  ...new Set([...text.matchAll(/^\|\s*(H\d+)\s*\|/gm)].map((m) => m[1])),
];

/** The disposition table: | H | Claim | Decision | Action |. */
export const parseDisposition = (text) => {
  const rows = [
    ...text.matchAll(/^\|\s*(H\d+)\s*\|([^|]*)\|([^|]*)\|([^|]*)\|/gm),
  ];
  return new Map(
    rows.map((m) => [m[1], { decision: m[3].trim(), action: m[4].trim() }]),
  );
};

/** The single fenced plume.limits block under D2. */
export const parseLimits = (text) => {
  const block = text.match(/```\s*\nplume\.limits\n([\s\S]*?)```/);
  if (!block) throw new Error("no plume.limits block");
  return Object.fromEntries(
    block[1]
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [k, ...rest] = l.split(":");
        return [k.trim(), rest.join(":").trim()];
      }),
  );
};

export const check = () => {
  const plan = readFileSync("FRONTEND_REMEDIATION_PLAN.md", "utf8");
  const record = readFileSync("email-send/PRODUCT_DECISIONS.md", "utf8");
  const errors = [];

  const registered = parseRegister(plan);
  const resolved = parseDisposition(record);

  for (const h of registered) {
    if (!resolved.has(h))
      errors.push(`${h} is in the register with no disposition`);
  }
  for (const [h, { decision, action }] of resolved) {
    if (!registered.includes(h))
      errors.push(`${h} is disposed of but not registered`);
    if (!/^D\d+/.test(decision))
      errors.push(`${h} names no decision (got "${decision}")`);
    if (!action) errors.push(`${h} has no action`);
  }

  for (const m of record.matchAll(/\*\*Status:\*\*\s*(.+)/g)) {
    const words = m[1].toLowerCase().match(/[a-z]+/g) ?? [];
    if (!words.some((w) => VALID_STATUSES.includes(w))) {
      errors.push(`status line names no valid status: "${m[1].trim()}"`);
    }
  }

  for (const bad of record.matchAll(/\b(TBD|TODO|FIXME)\b/g)) {
    errors.push(`the record contains a placeholder: ${bad[1]}`);
  }

  try {
    const limits = parseLimits(record);
    for (const key of [
      "send_rate_per_second",
      "activity_retention_days",
      "monthly_quota",
      "billing",
    ]) {
      if (!(key in limits)) errors.push(`the limits block is missing ${key}`);
    }
  } catch (e) {
    errors.push(`limits block unparseable: ${e.message}`);
  }

  return { errors, registered: registered.length, resolved: resolved.size };
};

if (import.meta.filename === process.argv[1]) {
  const { errors, registered, resolved } = check();
  for (const e of errors) console.error(`error: ${e}`);
  console.log(`${resolved}/${registered} register entries resolved`);
  process.exit(errors.length === 0 ? 0 : 1);
}
