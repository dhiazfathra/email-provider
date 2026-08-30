# Review decisions

CodeRabbit findings from PR review that autofix skipped because they need a
human call, plus the ones found stale/invalid against current content. One
file per finding: options considered, tradeoffs, and a recommendation.

Numbering is incremental, oldest first. Superseded entries stay in place and
say so — never rewrite history, add a new entry instead. Copy
[0000-template.md](0000-template.md) for a new entry.

| #                                                       | Finding                                                  | Status                           |
| ------------------------------------------------------- | -------------------------------------------------------- | -------------------------------- |
| [0001](0001-send-contract-source-of-truth.md)           | Use S1 as source of truth for the send contract          | needs decision                   |
| [0002](0002-playwright-control-audit-vs-source-scan.md) | Keep Playwright mandatory vs. source-scan fallback       | needs decision                   |
| [0003](0003-reputation-freshness-in-contract-plan.md)   | Add `/reputation` freshness to the contract plan         | needs decision                   |
| [0004](0004-claims-scan-coverage.md)                    | Include `app/page.tsx` copy in the claims scan           | needs decision                   |
| [0005](0005-decision-token-exact-match.md)              | Exact-token vs. substring decision matching              | needs decision (fix recommended) |
| [0006](0006-totals-guard-coverage.md)                   | Extend totals-guard test to every displayed count        | needs decision                   |
| [0007](0007-audit-category-iteration.md)                | Iterate `AUDIT_CATEGORIES` not `AUDIT_ENTRIES`           | needs decision (fix recommended) |
| [0008](0008-api-seam-import-scan.md)                    | Widen the API-seam import scan                           | needs decision (fix recommended) |
| [0009](0009-fixture-clock-determinism.md)               | Deterministic fixture range filtering (clock dependency) | needs decision                   |
| [0010](0010-canonical-decision-status.md)               | One canonical status per decision (D9, D15)              | needs decision                   |
| [0011](0011-stale-findings-batch.md)                    | Stale/invalid findings (3, no longer reproducible)       | resolved — no action             |

See each file's own status line for the final call once made.

## Priority

Fix before merge/S2, in order — these are correctness bugs disguised as
"findings," not style calls: 0005, 0007, 0008 (test assertions that can
never catch what they claim to). Then 0010 (status-schema ambiguity —
blocks reliable parsing). Then 0001, 0003 (contract-completeness gaps). Rest
(0002, 0004, 0006, 0009) are real but lower urgency — can land in a fast
follow-up without blocking this PR.
