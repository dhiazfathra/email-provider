# Evidence: every registered claim is resolved and CI proves it

**Claim:** every H-number in `FRONTEND_REMEDIATION_PLAN.md`'s register has a
disposition in `email-send/PRODUCT_DECISIONS.md`, every status line names a
legal status, the D2 limits block parses — enforced by
`scripts/check-decisions.mjs`, not by assertion.

## Command

```bash
node scripts/check-decisions.mjs; echo "exit=$?"
```

## Output

```text
37/37 register entries resolved
exit=0
```

The record needed no change to pass — the check passed on its first run
against `61b64e3`.

## Command (unit tests)

```bash
node --test scripts/check-decisions.test.mjs
```

## Output

```text
✔ parseRegister finds every H-number in the remediation plan (0.901875ms)
✔ parseDisposition maps an H-number to its decision and action (0.205334ms)
✔ parseLimits reads the fenced D2 block (0.204375ms)
ℹ tests 3
ℹ pass 3
ℹ fail 0
```

## Command (guard proven to fail on a broken record)

```bash
cp email-send/PRODUCT_DECISIONS.md /tmp/record.bak
python3 -c "
import re
p = 'email-send/PRODUCT_DECISIONS.md'
text = open(p).read()
text = re.sub(r'^\| H12 \|.*$', '', text, flags=re.MULTILINE)
open(p, 'w').write(text)
"
node scripts/check-decisions.mjs; echo "exit=$?"
```

## Output

```text
error: H12 is in the register with no disposition
36/37 register entries resolved
exit=1
```

## Command (restore and re-verify)

```bash
cp /tmp/record.bak email-send/PRODUCT_DECISIONS.md
git diff --stat
node scripts/check-decisions.mjs; echo "exit=$?"
```

## Output

```text
37/37 register entries resolved
exit=0
```

`git diff --stat` produced no output — the record was restored byte-identical
to `61b64e3`. A guard never observed failing is not known to guard anything;
this run observed it fail on the exact claim it exists to catch, then
confirmed the fix path (restoring the record) makes it pass again.

## Re-verified after CodeRabbit review fixes (commit `08543ea`)

CodeRabbit flagged three findings on the PR: unscoped workflow permissions,
unpinned action references, and a parser bug accepting delimiter-less limits
lines (`billing` parsing as `["billing", ""]` and passing the required-key
check). All three were fixed and the suite re-run against the fixed commit.

```bash
git log -1 --format=%H
node --test scripts/check-decisions.test.mjs
node scripts/check-decisions.mjs; echo "exit=$?"
```

```text
08543ea73b71cd31db571a846652363a20165fd3
✔ parseRegister finds every H-number in the remediation plan (0.858083ms)
✔ parseDisposition maps an H-number to its decision and action (0.185ms)
✔ parseLimits reads the fenced D2 block (0.128542ms)
✔ parseLimits rejects a line with no delimiter (0.772375ms)
ℹ tests 4
ℹ pass 4
ℹ fail 0
37/37 register entries resolved
exit=0
```

All three review threads were replied to with the fix commit and resolved;
CodeRabbit confirmed each fix in-thread. CI (`decisions record` workflow and
CodeRabbit review) passed on the final push.
