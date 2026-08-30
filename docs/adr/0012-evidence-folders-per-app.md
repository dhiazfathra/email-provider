# ADR-0012: Executed evidence is kept per app under `docs/evidence/`

- Status: Accepted
- Date: 2026-08-30
- Related: [ADR-0001](0001-monorepo-two-standalone-next-apps.md), [ADR-0011](0011-vitest-for-data-playwright-for-controls.md)

## Context

This repository shipped a frontend described in commits and a contract as
complete and verified. It was neither, and nothing on disk recorded what had
actually been run or seen. The claim lived only in prose.

The `golang-production-grade` repository already solved this with an evidence
convention: one numbered folder per task, one markdown file per finding
containing the exact command, its full output including exit codes, and a
screenshot or short recording where a status code cannot prove the claim (a page
rendering correctly rather than merely responding 200).

This repository holds two independently deployed apps (ADR-0001), so a single
flat sequence would interleave unrelated work.

## Decision

Adopt that convention here, at `docs/evidence/`, split by app:

```
docs/evidence/
├── README.md                 the convention — one copy, both apps
├── email-send/
│   ├── 0000-template/
│   └── 0001-<task-slug>/
│       ├── <finding>.md      claim, exact command, full output
│       └── <finding>.png
└── email-inbox/
    └── 0000-template/
```

Each app owns its own monotonic sequence; numbers are never reused or reordered.
The README — the part that must not drift — exists once, at the root of
`docs/evidence/`, mirroring `docs/adr/`'s root placement.

Rules carried over unchanged: paste real output from a command actually run,
never an example written from memory; record failures and surprises too; no
secrets or tokens in screenshots; no speculative "expected output".

## Alternatives Considered

### Per-app folders (`email-send/docs/evidence/`)

- Pros: evidence sits directly beside the code it verifies
- Rejected: two copies of the README, which is the file whose consistency matters
  most.

### One root sequence with app-prefixed slugs

- Pros: simplest numbering
- Rejected: the two apps ship independently, so one sequence would interleave
  unrelated work and make "what was verified for Pane" a grep rather than a list.

### PR descriptions as the evidence record

- Rejected: they live on GitHub, not in the tree, and are not reviewable
  alongside the code six months later — the failure this ADR exists to prevent.

## Consequences

- Every remediation PR carries an evidence folder; a PR without one is incomplete.
- Screenshots and short WebM recordings enter git. Kept small (a few hundred KB),
  and only where output alone cannot prove the claim. A 0-byte or corrupt
  recording is worse than none: it is a false claim of evidence, so recordings are
  checked playable before commit.
- Pane inherits the convention with no further decision when it is audited.
