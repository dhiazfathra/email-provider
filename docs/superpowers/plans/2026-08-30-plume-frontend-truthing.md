# Plume frontend truthing — implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL — use `superpowers:subagent-driven-development`
> (recommended) or `superpowers:executing-plans` to implement this plan task by
> task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `email-send/frontend` state only what
`email-send/PRODUCT_DECISIONS.md` decided, and leave behind tests that fail when
it stops doing so.

**Architecture:** Raw fixtures in `lib/data/`, presentation in
`lib/format.ts` + `lib/theme.ts`, one enum module and one limits module, and an
async `lib/api/` seam every page reads through. Four guard tests: three in Vitest
over data, one in Playwright over rendered routes.

**Tech Stack:** Next.js 16.3.3 (App Router, `app/`), React 19, TypeScript 5.9
strict, ESLint 9 flat config, Prettier 3, Vitest, Playwright, Node 24 / npm 12.

**Spec:** `docs/superpowers/specs/2026-08-30-plume-frontend-truthing-design.md`
(read it — this plan argues from it and does not repeat its reasoning).

**Decisions record:** `email-send/PRODUCT_DECISIONS.md` (D1–D20). Every deletion
below cites the decision that authorises it.

## Global Constraints

- Working directory for all `npm` commands: `email-send/frontend`.
- Node 24, npm 12. Next 16.3.3, React 19.2 — do not upgrade any of them.
- TypeScript `strict: true`. No `any`, no `@ts-expect-error` without a comment
  naming the reason.
- Path alias `@/*` maps to the `email-send/frontend` root (`tsconfig.json`).
- Prettier 3 formats every file, including Markdown. A repository commit hook
  blocks unformatted files: run `npx prettier --write <files>` before committing.
- Never commit with `--no-verify`. Never add an AI-attribution trailer to a
  commit message.
- Styles stay inline (ADR-0002) and responsive values stay CSS variables
  (ADR-0006). This plan changes data and controls, never visual design.
- Enum members, statuses and streams are **lowercase** in data; display casing is
  applied at the render site (D11).
- Each PR gets an evidence folder `docs/evidence/email-send/000N-<slug>/`
  following `docs/evidence/README.md`: exact command, full output, exit codes.
  Paste real output only — never an example written from memory.
- There is no CI in this repository yet (`.github/workflows/` does not exist).
  Task 3 creates it.

---

# PR 1 — Tooling

Deliverable: two working test runners, a CI workflow, and the first evidence
folder. No product behaviour changes.

## Task 1: Install and prove Vitest

**Files:**

- Modify: `email-send/frontend/package.json`
- Create: `email-send/frontend/vitest.config.ts`
- Create: `email-send/frontend/tests/harness.test.ts`

**Interfaces:**

- Produces: `npm test` runs Vitest over `tests/**/*.test.ts`; the `@/` alias
  resolves inside tests.

- [ ] **Step 1: Install Vitest**

```bash
cd email-send/frontend
npm install --save-dev vitest@^3 @vitejs/plugin-react@^5 vite-tsconfig-paths@^5
```

- [ ] **Step 2: Write the config**

Create `email-send/frontend/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
  },
});
```

`environment: "node"` is deliberate: every Vitest test in this plan reads data
modules and files. Nothing renders — that is Playwright's job (ADR-0011).

- [ ] **Step 3: Write a failing harness test**

Create `email-send/frontend/tests/harness.test.ts`:

```ts
import { expect, test } from "vitest";
import { RANGES } from "@/lib/mock/console";

test("the test harness resolves the @/ alias", () => {
  expect(RANGES).toEqual(["24h", "7d", "30d", "unresolved"]);
});
```

The expected value is deliberately wrong — this step proves the runner reports a
real failure rather than passing vacuously.

- [ ] **Step 4: Run it and verify it fails**

```bash
cd email-send/frontend && npm test
```

Expected: FAIL, with a diff showing `["24h", "7d", "30d"]` received.

- [ ] **Step 5: Add the script and correct the assertion**

In `package.json` `scripts`, add:

```json
"test": "vitest run"
```

Change the assertion to `expect(RANGES).toEqual(["24h", "7d", "30d"])`.

- [ ] **Step 6: Run it and verify it passes**

```bash
cd email-send/frontend && npm test
```

Expected: PASS, 1 test.

- [ ] **Step 7: Commit**

```bash
npx prettier --write email-send/frontend/vitest.config.ts email-send/frontend/tests/harness.test.ts email-send/frontend/package.json
git add email-send/frontend/package.json email-send/frontend/package-lock.json email-send/frontend/vitest.config.ts email-send/frontend/tests/harness.test.ts
git commit -m "test(email-send): add Vitest with an alias-resolution harness test"
```

## Task 2: Install and prove Playwright

**Files:**

- Modify: `email-send/frontend/package.json`
- Create: `email-send/frontend/playwright.config.ts`
- Create: `email-send/frontend/e2e/harness.spec.ts`
- Modify: `email-send/frontend/.gitignore` (create if absent)

**Interfaces:**

- Consumes: nothing from Task 1.
- Produces: `npm run e2e` starts `next dev` on port 3000 and runs
  `e2e/**/*.spec.ts` against it.

- [ ] **Step 1: Install Playwright and one browser**

```bash
cd email-send/frontend
npm install --save-dev @playwright/test@^1
npx playwright install chromium
```

Only Chromium. Three browsers triples CI time for a control audit that is not
browser-specific (spec risk R4).

- [ ] **Step 2: Write the config**

Create `email-send/frontend/playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3000" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 3: Write a failing harness spec**

Create `email-send/frontend/e2e/harness.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("the landing page renders its product name", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByText("Plume").first()).toBeVisible();
  await expect(page.getByText("this string is not on the page")).toBeVisible();
});
```

The last assertion is deliberately false, for the same reason as Task 1.

- [ ] **Step 4: Run it and verify it fails**

```bash
cd email-send/frontend && npx playwright test
```

Expected: FAIL on the final assertion, after the first two pass. If it fails on
`page.goto` instead, the dev server did not start — fix that before continuing.

- [ ] **Step 5: Add the script, delete the false assertion, ignore artifacts**

In `package.json` `scripts`, add:

```json
"e2e": "playwright test"
```

Remove the `this string is not on the page` line.

Create or append `email-send/frontend/.gitignore`:

```
/test-results/
/playwright-report/
/blob-report/
```

- [ ] **Step 6: Run it and verify it passes**

```bash
cd email-send/frontend && npm run e2e
```

Expected: PASS, 1 test.

- [ ] **Step 7: Commit**

```bash
npx prettier --write email-send/frontend/playwright.config.ts email-send/frontend/e2e/harness.spec.ts email-send/frontend/package.json
git add email-send/frontend/package.json email-send/frontend/package-lock.json email-send/frontend/playwright.config.ts email-send/frontend/e2e/harness.spec.ts email-send/frontend/.gitignore
git commit -m "test(email-send): add Playwright with a landing-page harness spec"
```

## Task 3: Run both runners in CI

**Files:**

- Create: `.github/workflows/email-send-frontend.yml`

**Interfaces:**

- Consumes: `npm test` (Task 1) and `npm run e2e` (Task 2).
- Produces: a required check on every push and pull request.

- [ ] **Step 1: Write the workflow**

Create `.github/workflows/email-send-frontend.yml`:

```yaml
name: email-send frontend

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    defaults:
      run:
        working-directory: email-send/frontend
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
          cache: npm
          cache-dependency-path: email-send/frontend/package-lock.json
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npx playwright install --with-deps chromium
      - run: npm run e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: email-send/frontend/playwright-report/
          retention-days: 7
```

`concurrency` is deliberately omitted; add it if queueing becomes a problem.

- [ ] **Step 2: Verify the workflow parses**

```bash
npx --yes @action-validator/cli --verbose .github/workflows/email-send-frontend.yml
```

Expected: exit 0. If the tool is unavailable, run
`python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/email-send-frontend.yml'))"`
and record which check was used in the evidence file.

- [ ] **Step 3: Commit**

```bash
npx prettier --write .github/workflows/email-send-frontend.yml
git add .github/workflows/email-send-frontend.yml
git commit -m "ci(email-send): run lint, Vitest and Playwright on push and PR"
```

## Task 4: File the PR 1 evidence

**Files:**

- Create: `docs/evidence/email-send/0001-tooling/test-runners.md`

- [ ] **Step 1: Capture both runs**

```bash
cd email-send/frontend
npm test 2>&1 | tee /tmp/vitest.txt; echo "exit=${PIPESTATUS[0]}"
npm run e2e 2>&1 | tee /tmp/playwright.txt; echo "exit=${PIPESTATUS[0]}"
```

- [ ] **Step 2: Write the evidence file**

Create `docs/evidence/email-send/0001-tooling/test-runners.md` using the shape in
`docs/evidence/README.md`: the claim ("both runners execute and pass"), each exact
command, the **full** captured output, and the exit codes. No screenshot — output
proves this claim on its own.

- [ ] **Step 3: Commit**

```bash
npx prettier --write docs/evidence/email-send/0001-tooling/test-runners.md
git add docs/evidence/email-send/0001-tooling/
git commit -m "docs(email-send): evidence for the test tooling"
```

---

# PR 2 — Shared modules and three guard tests

Deliverable: the single-source modules, plus enum and totals tests green and the
claims test skipped pending PR 3.

## Task 5: The enum module

**Files:**

- Create: `email-send/frontend/lib/enums.ts`
- Create: `email-send/frontend/tests/enums.test.ts`

**Interfaces:**

- Produces:
  - `STREAMS: readonly ["transactional", "notifications", "bulk"]`
  - `MESSAGE_STATES: readonly ["queued", "delivered", "bounced", "deferred", "suppressed"]`
  - `AUDIT_CATEGORIES: readonly string[]`
  - `type Stream`, `type MessageState`, `type AuditCategory`
  - `isStream(v: string): v is Stream` and the equivalents for the other two.

- [ ] **Step 1: Write the failing test**

Create `email-send/frontend/tests/enums.test.ts`:

```ts
import { expect, test } from "vitest";
import { MESSAGE_STATES, STREAMS, isStream } from "@/lib/enums";

test("streams are the three decided in D1, lowercase", () => {
  expect(STREAMS).toEqual(["transactional", "notifications", "bulk"]);
});

test("message states exclude engagement, per D4", () => {
  expect(MESSAGE_STATES).toEqual([
    "queued",
    "delivered",
    "bounced",
    "deferred",
    "suppressed",
  ]);
  expect(MESSAGE_STATES).not.toContain("opened");
});

test("isStream rejects the values the mocks used", () => {
  expect(isStream("transactional")).toBe(true);
  expect(isStream("receipts")).toBe(false);
  expect(isStream("broadcast")).toBe(false);
});
```

- [ ] **Step 2: Run and verify it fails**

```bash
cd email-send/frontend && npm test -- tests/enums.test.ts
```

Expected: FAIL — cannot resolve `@/lib/enums`.

- [ ] **Step 3: Write the module**

Create `email-send/frontend/lib/enums.ts`:

```ts
/** D1 — closed stream enum. Customer-defined tags are deferred. */
export const STREAMS = ["transactional", "notifications", "bulk"] as const;

/** D4 — exclusive delivery states. Engagement is deferred to a second axis. */
export const MESSAGE_STATES = [
  "queued",
  "delivered",
  "bounced",
  "deferred",
  "suppressed",
] as const;

/** D17 — the audit filter set is derived from this, never typed separately. */
export const AUDIT_CATEGORIES = [
  "keys",
  "domains",
  "templates",
  "suppressions",
  "members",
] as const;

export type Stream = (typeof STREAMS)[number];
export type MessageState = (typeof MESSAGE_STATES)[number];
export type AuditCategory = (typeof AUDIT_CATEGORIES)[number];

export const isStream = (v: string): v is Stream =>
  (STREAMS as readonly string[]).includes(v);
export const isMessageState = (v: string): v is MessageState =>
  (MESSAGE_STATES as readonly string[]).includes(v);
export const isAuditCategory = (v: string): v is AuditCategory =>
  (AUDIT_CATEGORIES as readonly string[]).includes(v);
```

- [ ] **Step 4: Run and verify it passes**

```bash
cd email-send/frontend && npm test -- tests/enums.test.ts
```

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/lib/enums.ts email-send/frontend/tests/enums.test.ts
git add email-send/frontend/lib/enums.ts email-send/frontend/tests/enums.test.ts
git commit -m "feat(email-send): add the decided enums as one module"
```

## Task 6: The limits module, checked against the decisions record

**Files:**

- Create: `email-send/frontend/lib/limits.ts`
- Create: `email-send/frontend/lib/decisions.ts`
- Create: `email-send/frontend/tests/limits.test.ts`

**Interfaces:**

- Produces:
  - `SEND_RATE_PER_SECOND: number`, `ACTIVITY_RETENTION_DAYS: number`
  - `readLimits(): Record<string, string>` in `lib/decisions.ts`, parsing the D2
    fenced block from `email-send/PRODUCT_DECISIONS.md`
  - `readDecisionsText(): string` — the whole record, used by the claims test.

The parser lives in `lib/decisions.ts` rather than in the test, because two tests
need it (limits and claims) and duplicating a parser is the drift this whole
effort exists to prevent.

- [ ] **Step 1: Write the failing test**

Create `email-send/frontend/tests/limits.test.ts`:

```ts
import { expect, test } from "vitest";
import { ACTIVITY_RETENTION_DAYS, SEND_RATE_PER_SECOND } from "@/lib/limits";
import { readLimits } from "@/lib/decisions";

test("the limits module matches the D2 block verbatim", () => {
  const decided = readLimits();
  expect(String(SEND_RATE_PER_SECOND)).toBe(decided.send_rate_per_second);
  expect(String(ACTIVITY_RETENTION_DAYS)).toBe(decided.activity_retention_days);
});

test("no quota and no billing exist in the PoC", () => {
  const decided = readLimits();
  expect(decided.monthly_quota).toBe("none");
  expect(decided.billing).toBe("none");
});
```

- [ ] **Step 2: Run and verify it fails**

```bash
cd email-send/frontend && npm test -- tests/limits.test.ts
```

Expected: FAIL — cannot resolve `@/lib/limits`.

- [ ] **Step 3: Write both modules**

Create `email-send/frontend/lib/decisions.ts`:

````ts
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
````

Create `email-send/frontend/lib/limits.ts`:

```ts
/**
 * D2 — one limit set, no plans, no metering. These values are asserted against
 * the decisions record by tests/limits.test.ts; change the record first.
 */
export const SEND_RATE_PER_SECOND = 100;
export const ACTIVITY_RETENTION_DAYS = 30;
```

`lib/decisions.ts` reads the filesystem, so it is test-and-build-time only. Never
import it from a component.

- [ ] **Step 4: Run and verify it passes**

```bash
cd email-send/frontend && npm test -- tests/limits.test.ts
```

Expected: PASS, 2 tests. If the path fails, confirm the working directory is
`email-send/frontend` — `process.cwd()` is what makes `..` correct.

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/lib/limits.ts email-send/frontend/lib/decisions.ts email-send/frontend/tests/limits.test.ts
git add email-send/frontend/lib/limits.ts email-send/frontend/lib/decisions.ts email-send/frontend/tests/limits.test.ts
git commit -m "feat(email-send): add limits parsed against the decisions record"
```

## Task 7: The formatting and theme modules

**Files:**

- Create: `email-send/frontend/lib/format.ts`
- Create: `email-send/frontend/lib/theme.ts`
- Create: `email-send/frontend/tests/format.test.ts`

**Interfaces:**

- Produces:
  - `relativeTime(iso: string, now?: Date): string`
  - `maskKey(prefix: string, last4: string): string`
  - `formatCount(n: number): string`
  - `stateTint(state: MessageState): { bg: string; fg: string }`
  - `GRADIENTS: readonly string[]` and `gradient(i: number): string`

- [ ] **Step 1: Write the failing test**

Create `email-send/frontend/tests/format.test.ts`:

```ts
import { expect, test } from "vitest";
import { formatCount, maskKey, relativeTime } from "@/lib/format";
import { stateTint } from "@/lib/theme";
import { MESSAGE_STATES } from "@/lib/enums";

const NOW = new Date("2026-08-30T10:00:00Z");

test("relativeTime renders recent times in minutes", () => {
  expect(relativeTime("2026-08-30T09:58:00Z", NOW)).toBe("2 min ago");
});

test("relativeTime falls back to a date beyond a week", () => {
  expect(relativeTime("2026-08-01T09:00:00Z", NOW)).toBe("1 Aug");
});

test("maskKey never contains the secret", () => {
  expect(maskKey("plume_live", "4f2a")).toBe("plume_live_••••••••4f2a");
});

test("formatCount does not invent magnitude", () => {
  expect(formatCount(12)).toBe("12");
  expect(formatCount(1204)).toBe("1,204");
});

test("every message state has a tint", () => {
  for (const state of MESSAGE_STATES) {
    expect(stateTint(state).fg).toMatch(/^#|^rgba/);
  }
});
```

`formatCount(1204)` returning `"1,204"` and not `"1.2k"` is deliberate: the
`1.2k` badge in the old nav is H8, a rounded number that disagreed with its data.

- [ ] **Step 2: Run and verify it fails**

```bash
cd email-send/frontend && npm test -- tests/format.test.ts
```

Expected: FAIL — cannot resolve `@/lib/format`.

- [ ] **Step 3: Write both modules**

Create `email-send/frontend/lib/format.ts`:

```ts
/** D11 — presentation lives here, never in the data modules. */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const relativeTime = (iso: string, now: Date = new Date()): string => {
  const delta = now.getTime() - new Date(iso).getTime();
  if (delta < MINUTE) return "just now";
  if (delta < HOUR) return `${Math.floor(delta / MINUTE)} min ago`;
  if (delta < DAY) return `${Math.floor(delta / HOUR)} h ago`;
  if (delta < 7 * DAY) return `${Math.floor(delta / DAY)} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
};

export const maskKey = (prefix: string, last4: string): string =>
  `${prefix}_${"•".repeat(8)}${last4}`;

export const formatCount = (n: number): string => n.toLocaleString("en-GB");
```

Create `email-send/frontend/lib/theme.ts`:

```ts
import type { MessageState } from "@/lib/enums";

/** D11 — colour is keyed by enum member, at the render site. */
const STATE_TINTS: Record<MessageState, { bg: string; fg: string }> = {
  queued: { bg: "rgba(124,126,242,.16)", fg: "#4c46b8" },
  delivered: { bg: "rgba(94,234,212,.24)", fg: "#0e8f80" },
  bounced: { bg: "rgba(192,132,252,.22)", fg: "#8b5cf6" },
  deferred: { bg: "rgba(167,139,250,.16)", fg: "#6d4fd6" },
  suppressed: { bg: "rgba(148,163,184,.22)", fg: "#475569" },
};

export const stateTint = (state: MessageState) => STATE_TINTS[state];

export const GRADIENTS = [
  "linear-gradient(140deg,#7c7ef2,#a78bfa)",
  "linear-gradient(140deg,#7dd3fc,#818cf8)",
  "linear-gradient(140deg,#67e8f9,#5eead4)",
  "linear-gradient(140deg,#c4b5fd,#8b8cf6)",
  "linear-gradient(140deg,#c084fc,#f0abfc)",
] as const;

export const gradient = (i: number): string => GRADIENTS[i % GRADIENTS.length];
```

`Record<MessageState, …>` is what makes a new state without a tint a type error.

- [ ] **Step 4: Run and verify it passes**

```bash
cd email-send/frontend && npm test -- tests/format.test.ts
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/lib/format.ts email-send/frontend/lib/theme.ts email-send/frontend/tests/format.test.ts
git add email-send/frontend/lib/format.ts email-send/frontend/lib/theme.ts email-send/frontend/tests/format.test.ts
git commit -m "feat(email-send): move formatting and colour out of data"
```

## Task 8: The claims test, landing skipped

**Files:**

- Create: `email-send/frontend/tests/claims.test.ts`
- Create: `email-send/frontend/tests/claims-allowlist.ts`

**Interfaces:**

- Consumes: `readDecisionsText()` from Task 6.
- Produces: the test PR 3 must unskip.

- [ ] **Step 1: Write the allowlist**

Create `email-send/frontend/tests/claims-allowlist.ts`:

```ts
/**
 * Numerals allowed in product copy despite not being decisions.
 * Every entry states why. An allowlist is a hiding place — the reason is what
 * makes hiding visible (spec risk R2).
 */
export const ALLOWED_NUMERALS = [
  { value: "2", reason: "API version, as in /v2/send" },
  { value: "587", reason: "SMTP port — remove with D6's copy in PR 3" },
  { value: "200", reason: "HTTP status in the errors table" },
  { value: "202", reason: "HTTP status in the errors table" },
  { value: "400", reason: "HTTP status in the errors table" },
  { value: "401", reason: "HTTP status in the errors table" },
  { value: "403", reason: "HTTP status in the errors table" },
  { value: "404", reason: "HTTP status in the errors table" },
  { value: "409", reason: "HTTP status in the errors table" },
  { value: "422", reason: "HTTP status in the errors table" },
  { value: "429", reason: "HTTP status in the errors table" },
  { value: "500", reason: "HTTP status in the errors table" },
];

/**
 * Phrases that are promises regardless of whether they carry a number.
 * A numeric scan never catches "industry-leading uptime" (spec risk R3).
 */
export const FORBIDDEN_PHRASES = [
  "SLA",
  "uptime",
  "guarantee",
  "guaranteed",
  "industry-leading",
  "SSO",
  "SCIM",
  "data residency",
  "within an hour",
  "under an hour",
];
```

- [ ] **Step 2: Write the test, skipped**

Create `email-send/frontend/tests/claims.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { readDecisionsText } from "@/lib/decisions";
import { ALLOWED_NUMERALS, FORBIDDEN_PHRASES } from "./claims-allowlist";

const COPY_FILES = ["lib/mock/landing.ts", "lib/mock/docs.ts"];

const copy = () => COPY_FILES.map((f) => readFileSync(f, "utf8")).join("\n");

const numerals = (text: string) => [
  ...new Set(text.match(/\d[\d.,]*\s?(?:%|ms|B|M|k)?/g) ?? []),
];

// Unskip in PR 3, once the cut claims are deleted. Written before them on
// purpose: the failure list this produces IS the deletion list.
describe.skip("claims", () => {
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
```

- [ ] **Step 3: Run the whole suite and record the skip**

```bash
cd email-send/frontend && npm test
```

Expected: PASS with 2 skipped. Capture this output — PR 3's evidence contrasts
against it.

- [ ] **Step 4: Run it unskipped once, to prove it fails today**

Temporarily change `describe.skip` to `describe`, run `npm test`, and **save the
offender list** — it is the checklist PR 3 works through. Then restore
`describe.skip` before committing.

```bash
cd email-send/frontend && npm test -- tests/claims.test.ts 2>&1 | tee /tmp/claims-failures.txt
```

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/tests/claims.test.ts email-send/frontend/tests/claims-allowlist.ts
git add email-send/frontend/tests/claims.test.ts email-send/frontend/tests/claims-allowlist.ts
git commit -m "test(email-send): add the claims guard, skipped pending the deletions"
```

## Task 9: File the PR 2 evidence

**Files:**

- Create: `docs/evidence/email-send/0002-shared-modules/guard-tests.md`

- [ ] **Step 1: Write it**

Include: `npm test` full output (passing, with the two skips), and the saved
offender list from Task 8 Step 4 under a heading naming it as the PR 3 worklist.
Recording a failure is evidence, not noise.

- [ ] **Step 2: Commit**

```bash
npx prettier --write docs/evidence/email-send/0002-shared-modules/guard-tests.md
git add docs/evidence/email-send/0002-shared-modules/
git commit -m "docs(email-send): evidence for the shared modules and guard tests"
```

---

# PR 3 — Delete every cut claim

Deliverable: the claims test unskipped and green. Copy only; no structural work.

## Task 10: Strip `lib/mock/landing.ts`

**Files:**

- Modify: `email-send/frontend/lib/mock/landing.ts`
- Modify: `email-send/frontend/app/page.tsx`

**Interfaces:**

- Produces: `landing.ts` exports without `HERO_STATS`, `MINI_STATS`,
  `PROVIDERS`, `SDKS`, `PLANS`; `NAV_LINKS` without `Pricing`.

- [ ] **Step 1: Delete the fabricated exports**

From `lib/mock/landing.ts` remove, in full:

- `HERO_STATS` — 99.31% delivery, 180 ms p95, 4.1B messages (D13, H1–H3)
- `MINI_STATS` — `202` as a metric, 412 ms "to inbox", 30 d retention (D13, H4, H5, H24)
- `PROVIDERS` — Gmail 98.7 / Outlook 96.2 / Yahoo 94.8 / iCloud 91.3 (D13, H6)
- `SDKS` — six client libraries and the SMTP block (D5, D6, H10, H11)
- `PLANS` — every plan card (D2, D3, H7, H19, H20)

From `NAV_LINKS` remove `"Pricing"`. Keep `"Product"`, `"Deliverability"`,
`"Docs"` — PR 4 decides their hrefs.

- [ ] **Step 2: Delete the sections that rendered them**

In `app/page.tsx`, remove each JSX section whose only content was a deleted
export. A section that becomes empty is deleted entirely, not left as a heading
with nothing under it. Replace the plans section with a single paragraph:

```tsx
<p style={{ fontSize: 15, opacity: 0.6, textWrap: "pretty" }}>
  Plume is a proof of concept. There is no pricing yet, and nothing here is for
  sale.
</p>
```

- [ ] **Step 3: Verify the app still builds**

```bash
cd email-send/frontend && npm run build
```

Expected: exit 0, no unused-import errors. Remove imports left dangling.

- [ ] **Step 4: Commit**

```bash
npx prettier --write email-send/frontend/lib/mock/landing.ts email-send/frontend/app/page.tsx
git add email-send/frontend/lib/mock/landing.ts email-send/frontend/app/page.tsx
git commit -m "refactor(email-send): delete the landing page's unbacked claims"
```

## Task 11: Strip `lib/mock/docs.ts`

**Files:**

- Modify: `email-send/frontend/lib/mock/docs.ts`
- Modify: `email-send/frontend/app/docs/page.tsx`

- [ ] **Step 1: Delete or reduce**

- `DOCS_LANGS` and `QUICKSTART_CODE`: reduce to `curl` only (D5, H10). Delete the
  `node`, `python` and `go` variants and narrow `DocsLang` to `"curl"`.
- `SDK_CHIPS`: delete entirely (D5).
- `SEND_RESPONSE`: remove the `trace_url` line (D10, H12).
- `RATE_LIMITS`: remove the batch-send row (D8, H13); set the remaining rate to
  `SEND_RATE_PER_SECOND` imported from `@/lib/limits` (D2), and the retention
  line to `ACTIVITY_RETENTION_DAYS`.
- `WEBHOOK_EVENTS`: remove `domain.record_drift` (D9, H16).
- `DOC_STREAMS`: replace its three entries with `STREAMS` from `@/lib/enums`
  (D1, H22), keeping the descriptions.
- Any SMTP paragraph (`smtp.plume.email:587`, STARTTLS): delete (D6, H11).

- [ ] **Step 2: Add the idempotency parameter**

`SEND_PARAMS` gains `idempotency_key` — optional, string, "Repeat within 24 hours
returns the original result" (D7, H14). It is committed, so it belongs in the
docs.

- [ ] **Step 3: Delete the rendered sections**

In `app/docs/page.tsx`, remove the language tabs (only `curl` remains), the SDK
chip row, and any section left empty.

- [ ] **Step 4: Build**

```bash
cd email-send/frontend && npm run build
```

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/lib/mock/docs.ts email-send/frontend/app/docs/page.tsx
git add email-send/frontend/lib/mock/docs.ts email-send/frontend/app/docs/page.tsx
git commit -m "refactor(email-send): delete undecided API surface from the docs"
```

## Task 12: Unskip the claims test

**Files:**

- Modify: `email-send/frontend/tests/claims.test.ts`
- Modify: `email-send/frontend/tests/claims-allowlist.ts`

- [ ] **Step 1: Unskip**

Change `describe.skip("claims", …)` to `describe("claims", …)` and delete the
comment above it.

- [ ] **Step 2: Run**

```bash
cd email-send/frontend && npm test -- tests/claims.test.ts
```

Expected: PASS. If offenders remain, each one is either copy still to delete or a
genuinely allowed numeral. Add allowed ones to `ALLOWED_NUMERALS` **with a
reason**; delete the rest. Remove the `587` entry now — D6's copy is gone.

- [ ] **Step 3: Full suite**

```bash
cd email-send/frontend && npm test && npm run e2e
```

Expected: both PASS, zero skipped.

- [ ] **Step 4: Commit**

```bash
npx prettier --write email-send/frontend/tests/claims.test.ts email-send/frontend/tests/claims-allowlist.ts
git add email-send/frontend/tests/claims.test.ts email-send/frontend/tests/claims-allowlist.ts
git commit -m "test(email-send): unskip the claims guard now copy is truthful"
```

## Task 13: File the PR 3 evidence, with a screenshot

**Files:**

- Create: `docs/evidence/email-send/0003-delete-cut-claims/claims-green.md`
- Create: `docs/evidence/email-send/0003-delete-cut-claims/landing-after.png`

- [ ] **Step 1: Capture the landing page**

```bash
cd email-send/frontend && npm run dev &
npx --yes agent-browser open http://localhost:3000/
npx --yes agent-browser screenshot ../../docs/evidence/email-send/0003-delete-cut-claims/landing-after.png
npx --yes agent-browser close
kill %1
```

- [ ] **Step 2: Write the evidence**

Claim: "no fabricated metric, SDK, SMTP or plan claim remains, and the guard
proves it." Include the `npm test` output and the screenshot, captioned with what
to look for — no stat strip, no SDK row, no plan cards, the PoC pricing sentence
present.

- [ ] **Step 3: Commit**

```bash
npx prettier --write docs/evidence/email-send/0003-delete-cut-claims/claims-green.md
git add docs/evidence/email-send/0003-delete-cut-claims/
git commit -m "docs(email-send): evidence that the cut claims are gone"
```

---

# PR 4 — Every control real or absent

## Task 14: The control audit spec, failing

**Files:**

- Create: `email-send/frontend/e2e/controls.spec.ts`

**Interfaces:**

- Produces: the spec Tasks 15–17 must turn green.

- [ ] **Step 1: Write it**

```ts
import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/docs",
  "/console",
  "/console/activity",
  "/console/templates",
  "/console/domains",
  "/console/keys",
  "/console/suppressions",
  "/console/audit",
];

for (const route of ROUTES) {
  test(`${route} has no dead links`, async ({ page }) => {
    await page.goto(route);
    const dead = await page.locator('a[href="#"], a[href=""]').count();
    expect(dead, `${route} renders a link that goes nowhere`).toBe(0);
  });
}

test("the range switcher changes what is rendered", async ({ page }) => {
  await page.goto("/console");
  const before = await page.locator("main").innerText();
  await page.getByRole("button", { name: "30d" }).click();
  await expect
    .poll(async () => page.locator("main").innerText())
    .not.toBe(before);
});

test("docs search filters the sections", async ({ page }) => {
  await page.goto("/docs");
  const before = await page.locator("nav").innerText();
  await page.getByLabel("Search the docs").fill("webhook");
  await expect
    .poll(async () => page.locator("nav").innerText())
    .not.toBe(before);
});

test("Cmd+K focuses the docs search field", async ({ page }) => {
  await page.goto("/docs");
  await page.keyboard.press("ControlOrMeta+KeyK");
  await expect(page.getByLabel("Search the docs")).toBeFocused();
});

test("the landing email capture is a form", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Work email");
  await expect(input).toBeVisible();
  const form = page.locator("form").filter({ has: input });
  await expect(form).toHaveCount(1);
});
```

- [ ] **Step 2: Run and verify it fails**

```bash
cd email-send/frontend && npm run e2e -- e2e/controls.spec.ts
```

Expected: FAIL on `/` and `/docs` dead links, on the range switcher, on search,
on `⌘K`, and on the form. Save the output — it is the worklist for Tasks 15–17.

- [ ] **Step 3: Commit**

```bash
npx prettier --write email-send/frontend/e2e/controls.spec.ts
git add email-send/frontend/e2e/controls.spec.ts
git commit -m "test(email-send): add the control audit, currently failing"
```

## Task 15: Make the range switcher real

**Files:**

- Modify: `email-send/frontend/app/console/layout.tsx:20,295-320`
- Modify: `email-send/frontend/app/console/page.tsx`

The switcher at `app/console/layout.tsx:20` is `useState<Range>("7d")` with no
consumer (H29). The layout cannot pass state to a page in the App Router, so the
range moves to the URL.

- [ ] **Step 1: Create the range module**

Create `email-send/frontend/lib/ranges.ts` — `RANGES` currently lives in
`lib/mock/console.ts`, which Task 21 deletes:

```ts
export const RANGES = ["24h", "7d", "30d"] as const;
export type Range = (typeof RANGES)[number];

export const DEFAULT_RANGE: Range = "7d";

/** Window length in milliseconds, used by the api seam's filters. */
export const RANGE_MS: Record<Range, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

export const isRange = (v: string | undefined): v is Range =>
  !!v && (RANGES as readonly string[]).includes(v);
```

Update `tests/harness.test.ts` to import `RANGES` from `@/lib/ranges`.

- [ ] **Step 2: Drive the switcher from the URL**

Replace the `useState` with `useRouter()` / `useSearchParams()` from
`next/navigation`. Each button calls
`router.replace(\`${pathname}?range=${r}\`, { scroll: false })`, and `on`is
computed from`searchParams.get("range") ?? "7d"`.

- [ ] **Step 3: Consume it**

In `app/console/page.tsx`, read `searchParams.range`, validate it against
`RANGES`, and pass it to the data accessor so the KPI values differ per range.
Until PR 6 the accessor is the mock module — vary the fixture by range there.

- [ ] **Step 4: Verify**

```bash
cd email-send/frontend && npm run e2e -- e2e/controls.spec.ts -g "range switcher"
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/lib/ranges.ts email-send/frontend/app/console/layout.tsx email-send/frontend/app/console/page.tsx email-send/frontend/tests/harness.test.ts
git add email-send/frontend/lib/ranges.ts email-send/frontend/app/console/layout.tsx email-send/frontend/app/console/page.tsx email-send/frontend/tests/harness.test.ts
git commit -m "fix(email-send): make the console range switcher change the data"
```

## Task 16: Make docs search and ⌘K real

**Files:**

- Modify: `email-send/frontend/app/docs/page.tsx:37,210-226`

- [ ] **Step 1: Add the query state and filter**

Add `const [query, setQuery] = useState("")`, bind it to the existing
`<input type="search">` at line 210, and filter the rendered nav list:

```tsx
const shown = DOCS_SECTIONS.filter((s) =>
  s.label.toLowerCase().includes(query.trim().toLowerCase()),
);
```

Render an explicit "No section matches" line when `shown` is empty — an empty
list with no explanation is its own dishonest UI.

- [ ] **Step 2: Add the ⌘K listener**

```tsx
const searchRef = useRef<HTMLInputElement>(null);
useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      searchRef.current?.focus();
    }
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, []);
```

Attach `ref={searchRef}`. The `⌘K` badge at line 225 stays — it is now true.

- [ ] **Step 3: Verify**

```bash
cd email-send/frontend && npm run e2e -- e2e/controls.spec.ts -g "docs search|Cmd\+K"
```

Expected: both PASS.

- [ ] **Step 4: Commit**

```bash
npx prettier --write email-send/frontend/app/docs/page.tsx
git add email-send/frontend/app/docs/page.tsx
git commit -m "fix(email-send): make docs search and the Cmd+K badge work"
```

## Task 17: Remove or ground every remaining control

**Files:**

- Modify: `email-send/frontend/app/page.tsx:144,855,918`
- Modify: `email-send/frontend/app/console/audit/page.tsx:188`
- Modify: `email-send/frontend/lib/mock/landing.ts` (`FOOTER_LINKS`)

- [ ] **Step 1: The email capture becomes a disabled form**

Wrap the `<input type="email">` at `app/page.tsx:855` in a `<form>` whose
`onSubmit` calls `e.preventDefault()`, mark the input and submit control
`disabled`, and label it honestly:

```tsx
<p style={{ fontSize: 13, opacity: 0.55 }}>Sign-up opens when the API does.</p>
```

There is currently no `<form>` element anywhere in the app (H31).

- [ ] **Step 2: The nav links**

At `app/page.tsx:144` and `:918`, `href={l === "Docs" ? "/docs" : "#"}` (H32).
Reduce `NAV_LINKS` to entries that have a destination: `Docs` → `/docs`,
`Console` → `/console`. Delete `Product` and `Deliverability` — no such page
exists, and a nav entry is a promise of one.

- [ ] **Step 3: Export CSV**

Delete the button at `app/console/audit/page.tsx:188` (H33). It is the only real
`<button>` in the app with no handler, and export is not a decided feature.

- [ ] **Step 4: Footer links**

In `FOOTER_LINKS`, delete Status, Security, Support and API reference (H21). Keep
only entries with a real route, and render survivors as `<Link>`.

- [ ] **Step 5: Verify the whole audit**

```bash
cd email-send/frontend && npm run e2e && npm test
```

Expected: every `controls.spec.ts` test PASS, Vitest still green.

- [ ] **Step 6: Commit**

```bash
npx prettier --write email-send/frontend/app/page.tsx email-send/frontend/app/console/audit/page.tsx email-send/frontend/lib/mock/landing.ts
git add email-send/frontend/app/page.tsx email-send/frontend/app/console/audit/page.tsx email-send/frontend/lib/mock/landing.ts
git commit -m "fix(email-send): remove every control that looked interactive and was not"
```

## Task 18: File the PR 4 evidence

**Files:**

- Create: `docs/evidence/email-send/0004-controls/controls-green.md`
- Create: `docs/evidence/email-send/0004-controls/cmdk-focus.png`

- [ ] **Step 1: Capture**

Screenshot `/docs` with the search field focused after `⌘K` and a query typed, so
the filtered nav is visible. Include the failing run from Task 14 Step 2 and the
passing run side by side — the contrast is the evidence.

- [ ] **Step 2: Commit**

```bash
npx prettier --write docs/evidence/email-send/0004-controls/controls-green.md
git add docs/evidence/email-send/0004-controls/
git commit -m "docs(email-send): evidence that every control is real"
```

---

# PR 5 — Data and presentation split

The long pole (spec risk R1). One task per data area, each committed separately,
each leaving the suite green.

## Task 19: The totals test, before any data moves

**Files:**

- Create: `email-send/frontend/tests/totals.test.ts`

- [ ] **Step 1: Write it**

```ts
import { expect, test } from "vitest";
import { MESSAGES, messageCounts } from "@/lib/data/messages";
import { MESSAGE_STATES } from "@/lib/enums";

test("filter counts partition the message list exactly", () => {
  const counts = messageCounts();
  const summed = MESSAGE_STATES.reduce((n, s) => n + (counts[s] ?? 0), 0);
  expect(summed).toBe(MESSAGES.length);
});

test("no count is stored in the data", () => {
  const raw = JSON.stringify(MESSAGES);
  expect(raw).not.toMatch(/"count"/);
});
```

- [ ] **Step 2: Run and verify it fails**

```bash
cd email-send/frontend && npm test -- tests/totals.test.ts
```

Expected: FAIL — `@/lib/data/messages` does not exist yet.

- [ ] **Step 3: Commit**

```bash
npx prettier --write email-send/frontend/tests/totals.test.ts
git add email-send/frontend/tests/totals.test.ts
git commit -m "test(email-send): assert counts are derived, currently failing"
```

## Task 20: Split the message data

**Files:**

- Create: `email-send/frontend/lib/data/messages.ts`
- Modify: `email-send/frontend/app/console/activity/page.tsx`
- Modify: `email-send/frontend/lib/mock/console.ts` (remove `EVENTS`,
  `EVENT_FILTERS`, `STATUS_TINT`, `EventStatus`)

**Interfaces:**

- Produces:
  - `MESSAGES: readonly Message[]` where
    `Message = { id: string; to: string; subject: string; stream: Stream; state: MessageState; sent_at: string }`
  - `messageCounts(): Record<MessageState, number>`

- [ ] **Step 1: Write the data module**

```ts
import { type MessageState, type Stream } from "@/lib/enums";

export type Message = {
  id: string;
  to: string;
  subject: string;
  stream: Stream;
  state: MessageState;
  /** ISO-8601. Formatting happens at the render site (D11). */
  sent_at: string;
};

export const MESSAGES: readonly Message[] = [
  {
    id: "msg_01J8K2QF7ZP",
    to: "ana.ferreira@northloop.io",
    subject: "Your Harbor receipt #48213",
    stream: "transactional",
    state: "delivered",
    sent_at: "2026-08-30T09:41:02Z",
  },
  // …carry every existing EVENTS row across, converting:
  //   stream "receipts"/"broadcast" → "transactional"/"bulk"  (D1)
  //   status "Delivered" → "delivered"                        (D11)
  //   status "Opened"    → "delivered"                        (D4: engagement is deferred)
  //   time "9:41:02"     → an ISO timestamp on 2026-08-30     (D11)
];

/** D14 — derived, never stored. */
export const messageCounts = (): Record<MessageState, number> =>
  MESSAGES.reduce(
    (acc, m) => ({ ...acc, [m.state]: (acc[m.state] ?? 0) + 1 }),
    {} as Record<MessageState, number>,
  );
```

- [ ] **Step 2: Rewrite the activity page**

`app/console/activity/page.tsx` imports `MESSAGES` and `messageCounts()`,
renders `relativeTime(m.sent_at)` and `stateTint(m.state)`, and builds its filter
chips from `MESSAGE_STATES` with counts from `messageCounts()`. The hand-typed
`EVENT_FILTERS` numbers (1,462 / 1,401 / 892 / 6 / 9) are deleted — the page now
shows what the fixture contains.

- [ ] **Step 3: Handle the hydration risk (spec R5)**

`relativeTime` reads the clock, so a server render and the first client render
can disagree and React will warn. Render it in a client component that computes
the string in `useEffect`, showing the absolute date from `sent_at` until then:

```tsx
"use client";
export function SentAt({ iso }: { iso: string }) {
  const [label, setLabel] = useState(
    new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }),
  );
  useEffect(() => setLabel(relativeTime(iso)), [iso]);
  return <span title={iso}>{label}</span>;
}
```

The absolute date is the honest fallback: it is true whether or not JavaScript
runs.

- [ ] **Step 4: Verify**

```bash
cd email-send/frontend && npm test -- tests/totals.test.ts && npm run build
```

Expected: PASS and exit 0, with no hydration warning in the build output.

- [ ] **Step 5: Commit**

```bash
npx prettier --write email-send/frontend/lib/data/messages.ts email-send/frontend/app/console/activity/page.tsx email-send/frontend/lib/mock/console.ts
git add email-send/frontend/lib/data/messages.ts email-send/frontend/app/console/activity/page.tsx email-send/frontend/lib/mock/console.ts
git commit -m "refactor(email-send): make message data raw and its counts derived"
```

## Task 21: Split the remaining console data

**Files:**

- Create: `email-send/frontend/lib/data/{project,metrics,templates,domains,keys,suppressions,audit}.ts`
- Modify: every file under `email-send/frontend/app/console/`
- Delete: `email-send/frontend/lib/mock/console.ts`

Do these one at a time, committing after each; the order below is smallest first
so the pattern is established before the largest file.

- [ ] **Step 1: `project.ts`** — `PROJECT` loses `quota` entirely (D2; no quota
      exists) and gains `name`, `initial`, and `demo: true` for D13's label.
- [ ] **Step 2: `keys.ts`** — store `prefix` and `last4`, never a masked string;
      the page calls `maskKey(prefix, last4)` (D11).
- [ ] **Step 3: `domains.ts`** — statuses lowercase; `SNIPPET`'s pre-tokenised
      `{line,color}[]` becomes plain strings, coloured at render.
- [ ] **Step 4: `templates.ts`** — slug and integer version, rendered
      `` `${slug}@${version}` `` (D12). No `-v3` suffixes.
- [ ] **Step 5: `suppressions.ts`** — reasons lowercase; `SUPPRESS_STATS`
      derived from the rows, not typed (D14).
- [ ] **Step 6: `audit.ts`** — exports
      `AUDIT_ENTRIES: readonly { id: string; category: AuditCategory; actor: string; ip: string; at: string }[]`,
      categories drawn from `AUDIT_CATEGORIES`; the page builds its filter chips
      from the same constant, so no row is unreachable (D17, H27). Delete
      `AUDIT_DOT` in favour of a `theme.ts` lookup.
- [ ] **Step 7: `metrics.ts`** — KPI values as numbers, `deltaColor` deleted;
      the page derives colour from the sign of the delta. Accepts `range`.
- [ ] **Step 8: Delete `lib/mock/console.ts`** and the nav badges that were typed
      by hand (`24`, `1.2k`), replacing them with `formatCount(items.length)`.
- [ ] **Step 9: After each of the above**

```bash
cd email-send/frontend && npm test && npm run build
```

Expected: green each time. Commit per step with
`refactor(email-send): make <area> data raw`.

## Task 22: Enum consistency over the real data

**Files:**

- Modify: `email-send/frontend/tests/enums.test.ts`

- [ ] **Step 1: Add the data-wide assertions**

```ts
import { MESSAGES } from "@/lib/data/messages";
import { AUDIT_ENTRIES } from "@/lib/data/audit";
import { isAuditCategory, isMessageState, isStream } from "@/lib/enums";

test("every value in the data is an enum member", () => {
  for (const m of MESSAGES) {
    expect(isStream(m.stream), `${m.id} stream=${m.stream}`).toBe(true);
    expect(isMessageState(m.state), `${m.id} state=${m.state}`).toBe(true);
  }
  for (const a of AUDIT_ENTRIES) {
    expect(isAuditCategory(a.category), a.category).toBe(true);
  }
});

test("every audit category is reachable by a filter", () => {
  const used = new Set(AUDIT_ENTRIES.map((a) => a.category));
  for (const c of used) expect(isAuditCategory(c)).toBe(true);
});
```

- [ ] **Step 2: Run, fix any offender in the data, commit**

```bash
cd email-send/frontend && npm test
```

```bash
npx prettier --write email-send/frontend/tests/enums.test.ts
git add email-send/frontend/tests/enums.test.ts
git commit -m "test(email-send): assert the data only uses decided enum members"
```

## Task 23: File the PR 5 evidence

**Files:**

- Create: `docs/evidence/email-send/0005-data-presentation-split/split.md`
- Create: `docs/evidence/email-send/0005-data-presentation-split/console-after.png`

- [ ] **Step 1: Prove the split mechanically**

```bash
cd email-send/frontend
grep -rnE "#[0-9a-fA-F]{6}|linear-gradient|min ago|••••" lib/data/ ; echo "exit=$?"
```

Expected: exit 1 (no matches). That exit code is the evidence.

- [ ] **Step 2: Screenshot `/console` and `/console/activity`**

Caption what to look for: counts that match the visible rows, and the "demo
project" label.

- [ ] **Step 3: Commit**

```bash
npx prettier --write docs/evidence/email-send/0005-data-presentation-split/split.md
git add docs/evidence/email-send/0005-data-presentation-split/
git commit -m "docs(email-send): evidence that data holds no presentation"
```

---

# PR 6 — The API seam

## Task 24: Add `lib/api/` and convert every page

**Files:**

- Create: `email-send/frontend/lib/api/{messages,metrics,project,templates,domains,keys,suppressions,audit}.ts`
- Modify: every page under `email-send/frontend/app/console/`
- Create: `email-send/frontend/tests/seam.test.ts`

**Interfaces:**

- Produces, per resource, async functions returning the same types as `lib/data/`:
  `listMessages({ range, state }): Promise<Message[]>`,
  `getMetrics({ range }): Promise<Metrics>`, and so on.

- [ ] **Step 1: Write the seam test first**

```ts
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
```

- [ ] **Step 2: Run and verify it fails**

```bash
cd email-send/frontend && npm test -- tests/seam.test.ts
```

Expected: FAIL, listing every page.

- [ ] **Step 3: Write one accessor module**

```ts
import { MESSAGES, type Message } from "@/lib/data/messages";
import type { MessageState } from "@/lib/enums";
import { RANGE_MS, type Range } from "@/lib/ranges";

/**
 * The seam. Returns fixtures today; the backend lands behind this signature
 * without a call site changing (ADR-0008).
 */
export const listMessages = async (opts: {
  range: Range;
  state?: MessageState;
}): Promise<Message[]> => {
  const since = Date.now() - RANGE_MS[opts.range];
  return MESSAGES.filter(
    (m) =>
      new Date(m.sent_at).getTime() >= since &&
      (!opts.state || m.state === opts.state),
  );
};
```

- [ ] **Step 4: Convert pages one at a time**

Each console page becomes an async server component awaiting its accessor.
Interactive pieces (filters, the range switcher) stay client components taking
data as props. Commit per page; run `npm test && npm run build` after each.

- [ ] **Step 5: Verify the seam test passes**

```bash
cd email-send/frontend && npm test && npm run e2e
```

Expected: all green, `seam.test.ts` included.

- [ ] **Step 6: Commit**

```bash
npx prettier --write email-send/frontend/lib/api email-send/frontend/tests/seam.test.ts
git add email-send/frontend/lib/api email-send/frontend/tests/seam.test.ts email-send/frontend/app
git commit -m "refactor(email-send): read every page through the api seam"
```

## Task 25: File the PR 6 evidence

- [ ] **Step 1: Write `docs/evidence/email-send/0006-api-seam/seam.md`** with the
      failing-then-passing `seam.test.ts` output and the full suite.
- [ ] **Step 2: Commit**

```bash
npx prettier --write docs/evidence/email-send/0006-api-seam/seam.md
git add docs/evidence/email-send/0006-api-seam/
git commit -m "docs(email-send): evidence for the api seam"
```

---

# PR 7 — Close out

## Task 26: Documentation and the final evidence pack

**Files:**

- Modify: `README.md`
- Modify: `email-send/frontend/README.md` (create if absent)
- Create: `docs/evidence/email-send/0007-closeout/exit-criteria.md`

- [ ] **Step 1: Document the commands**

Add to the frontend README: `npm run dev`, `npm test`, `npm run e2e`,
`npm run lint`, `npm run build`, one line each, plus a paragraph saying the
console shows demo-project sample data (D13).

- [ ] **Step 2: Prove every exit criterion**

Run and capture each, in one evidence file:

```bash
cd email-send/frontend
grep -rn 'href="#"' app/ ; echo "exit=$?"        # expect exit 1
grep -rnE "#[0-9a-fA-F]{6}|linear-gradient" lib/data/ ; echo "exit=$?"  # expect exit 1
grep -rn "@/lib/data/" app/ ; echo "exit=$?"     # expect exit 1
npm run lint && npm test && npm run e2e && npm run build
```

- [ ] **Step 3: Commit**

```bash
npx prettier --write README.md email-send/frontend/README.md docs/evidence/email-send/0007-closeout/exit-criteria.md
git add README.md email-send/frontend/README.md docs/evidence/email-send/0007-closeout/
git commit -m "docs(email-send): record the S2 exit criteria as evidence"
```

## Task 27: Update the decisions record's status

**Files:**

- Modify: `email-send/PRODUCT_DECISIONS.md`

- [ ] **Step 1: Mark the delivered decisions**

Append to each of D1, D2, D3, D11, D12, D13, D14, D15, D16, D17, D18, D19 the
line `**Delivered:** S2, <commit range>.` D20 (the contract generator) belongs to
S3 and stays unmarked. Do not restate the decisions — link the evidence folders.

- [ ] **Step 2: Verify the claims test still parses the record**

```bash
cd email-send/frontend && npm test -- tests/claims.test.ts tests/limits.test.ts
```

Expected: PASS. The parser matches the fenced block; adding prose around it must
not break it — this run is what proves that.

- [ ] **Step 3: Commit**

```bash
npx prettier --write email-send/PRODUCT_DECISIONS.md
git add email-send/PRODUCT_DECISIONS.md
git commit -m "docs(email-send): mark the decisions S2 delivered"
```

---

## What this plan does not do

S3 (contract rewrite) and S4 (backend) are separate specs. `D20` — the byte-exact
contract generator — belongs to S3 because it edits `API_CONTRACTS.md`, which S2
must not touch. `email-inbox` (Pane) is untouched: same defect class, its own
audit and its own spec (spec risk R7).
