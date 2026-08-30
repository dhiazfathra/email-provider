# Plume decisions record (S1) — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL — use
> `superpowers:subagent-driven-development` (recommended) or
> `superpowers:executing-plans` to implement this plan task by task. Steps use
> checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `email-send/PRODUCT_DECISIONS.md` verifiably complete — every
H-number resolved, every status legal, the limits block machine-parseable —
enforced by a script rather than by assertion.

**Architecture:** The record's prose already exists (commit `61b64e3`). This plan
adds one Node script, `scripts/check-decisions.mjs`, that parses the record and
the remediation plan's register and fails on any gap, plus the CI step that runs
it. The script is the contract between S1 and everything downstream: S2's claims
test parses the same file, so a malformed record must break loudly and early.

**Tech Stack:** Node 24 (`node:fs`, no dependencies), GitHub Actions, Prettier 3.

**Spec:** `docs/superpowers/specs/2026-08-30-plume-remediation-decomposition-design.md`

## Status of the spec's deliverables

| Spec deliverable                              | State                                        |
| --------------------------------------------- | -------------------------------------------- |
| `email-send/PRODUCT_DECISIONS.md` with D1–D20 | Written, `61b64e3`                           |
| Disposition table for H1–H37                  | Written, `61b64e3`                           |
| ADRs for decisions outliving the PoC          | ADR-0007…0012, `61b64e3`                     |
| Machine-parseable limits block                | Written; **unverified by anything**          |
| "Every H1–H37 has a status"                   | Claimed in prose; **unverified by anything** |
| S2 spec                                       | Written, `61b64e3`                           |
| S3, S4 specs                                  | Not started — out of scope here              |

Tasks 1–4 close the two unverified rows. Nothing else in the spec is outstanding.

## Global Constraints

- All commands run from the repository root
  (`/Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider`) unless a step
  says otherwise. Use `cd` explicitly in every command block — a plan step that
  assumes an inherited working directory is how the S2 plan first landed in the
  wrong tree.
- Node 24, no new dependencies. `scripts/` already exists and holds
  `build-contracts.py`; a `.mjs` file beside it is the smallest addition that works.
- Prettier 3 formats every file including Markdown; a commit hook blocks
  unformatted files. Never commit with `--no-verify`, never add an AI-attribution
  trailer.
- The decisions record's format is load-bearing. Two consumers parse it: this
  script, and `email-send/frontend/lib/decisions.ts` in the S2 plan. Changing its
  headings or its fenced block means changing both.
- Valid statuses are exactly `committed`, `deferred`, `cut`. Any other word in a
  status line is a failure, not a synonym.

---

## Task 1: The register parser, failing

**Files:**

- Create: `scripts/check-decisions.mjs`
- Create: `scripts/check-decisions.test.mjs`

**Interfaces:**

- Produces:
  - `parseRegister(text): string[]` — the H-numbers listed in
    `FRONTEND_REMEDIATION_PLAN.md`, e.g. `["H1", "H2", … "H37"]`
  - `parseDisposition(text): Map<string, { decision: string; action: string }>`
    — the H-numbers resolved in `PRODUCT_DECISIONS.md`
  - `parseLimits(text): Record<string, string>` — the D2 fenced block
  - `check(): { errors: string[] }`

- [ ] **Step 1: Write the failing test**

Create `scripts/check-decisions.test.mjs`:

````js
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
````

- [ ] **Step 2: Run it and verify it fails**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
node --test scripts/check-decisions.test.mjs
```

Expected: FAIL — `Cannot find module './check-decisions.mjs'`.

- [ ] **Step 3: Write the parsers**

Create `scripts/check-decisions.mjs`:

````js
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
````

- [ ] **Step 4: Run the unit tests and verify they pass**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
node --test scripts/check-decisions.test.mjs
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
npx prettier --write scripts/check-decisions.mjs scripts/check-decisions.test.mjs
git add scripts/check-decisions.mjs scripts/check-decisions.test.mjs
git commit -m "test(decisions): add a parser for the decisions record and register"
```

## Task 2: Run it against the real files and fix what it finds

**Files:**

- Modify: `email-send/PRODUCT_DECISIONS.md` (only if the check reports a gap)

- [ ] **Step 1: Run the check**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
node scripts/check-decisions.mjs; echo "exit=$?"
```

Expected: `37/37 register entries resolved`, `exit=0`.

- [ ] **Step 2: If it reports errors, fix the record, not the script**

Each error names an H-number or a status line. Resolve it in
`email-send/PRODUCT_DECISIONS.md` by adding the missing disposition or correcting
the status word. Loosening the script to accept the record as written would
defeat the check — the record is the thing under test.

One exception: if the script's regex fails on a row that is genuinely correct
(for example, a claim containing a `|` character), that is a script bug. Fix the
regex and add a case to `check-decisions.test.mjs` covering it.

- [ ] **Step 3: Re-run until clean, then commit any record fixes**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
node scripts/check-decisions.mjs; echo "exit=$?"
npx prettier --write email-send/PRODUCT_DECISIONS.md
git add email-send/PRODUCT_DECISIONS.md
git commit -m "docs(email-send): close the gaps the decisions check found"
```

If the record needed no change, skip the commit and record that in Task 4's
evidence — "the check passed first run" is a result worth stating.

## Task 3: Enforce it in CI

**Files:**

- Create: `.github/workflows/decisions.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: decisions record

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
      - run: node --test scripts/check-decisions.test.mjs
      - run: node scripts/check-decisions.mjs
```

Separate from the frontend workflow on purpose: this check is about the
repository's documents and must run even on a pull request that touches no
frontend file.

- [ ] **Step 2: Verify it parses**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
python3 -c "import yaml; yaml.safe_load(open('.github/workflows/decisions.yml')); print('ok')"
```

Expected: `ok`.

- [ ] **Step 3: Prove it fails on a broken record**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
cp email-send/PRODUCT_DECISIONS.md /tmp/record.bak
sed -i '' 's/^| H12 |.*$//' email-send/PRODUCT_DECISIONS.md
node scripts/check-decisions.mjs; echo "exit=$?"
cp /tmp/record.bak email-send/PRODUCT_DECISIONS.md
```

Expected: `error: H12 is in the register with no disposition`, `exit=1`, and the
record restored byte-identical. Confirm with `git diff --stat` showing no change.
A guard never observed failing is not known to guard anything.

- [ ] **Step 4: Commit**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
npx prettier --write .github/workflows/decisions.yml
git add .github/workflows/decisions.yml
git commit -m "ci: fail when the decisions record leaves a claim unresolved"
```

## Task 4: File the evidence

**Files:**

- Create: `docs/evidence/email-send/0000-decisions-record/check.md`

- [ ] **Step 1: Capture all three runs**

The passing run, the deliberately-broken run from Task 3 Step 3, and the
`git diff --stat` proving the record was restored.

- [ ] **Step 2: Write the evidence file**

Follow `docs/evidence/README.md`: the claim ("every register entry is resolved and
CI proves it"), each exact command, full output, exit codes. No screenshot — exit
codes prove this claim on their own.

Number it `0000` deliberately: this precedes the S2 sequence, and S2's folders
start at `0001-tooling`.

- [ ] **Step 3: Commit**

```bash
cd /Users/dhiazfathra/Documents/GitHub/dhiazfathra/email-provider
npx prettier --write docs/evidence/email-send/0000-decisions-record/check.md
git add docs/evidence/email-send/0000-decisions-record/
git commit -m "docs(email-send): evidence that every registered claim is resolved"
```

---

## What this plan does not do

It does not write or revise any decision — those are the user's, already made and
recorded. It does not touch the frontend (that is
`2026-08-30-plume-frontend-truthing.md`), the contract, or the backend. S3 and S4
have no specs yet; writing them is the next brainstorming session, not a task here.

## Interaction with the S2 plan

`email-send/frontend/lib/decisions.ts` (S2 plan, Task 6) parses the same fenced
block with the same regex as `parseLimits` here. They are deliberate duplicates
across a package boundary — the frontend cannot import from `scripts/`. If the
block's format changes, both change, and both test suites fail until they do.
