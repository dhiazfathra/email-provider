# Evidence

Executed proof for claims made in a task, PR or session — kept as artifacts, not
prose in a chat transcript. "Verified, not claimed" only means something if the
verification survives the conversation.

Adapted from the convention in `golang-production-grade`, split per app because
this repository ships two independently deployed frontends
([ADR-0001](../adr/0001-monorepo-two-standalone-next-apps.md),
[ADR-0012](../adr/0012-evidence-folders-per-app.md)).

## Why this exists

A commit message can say "tested, works". Six months later nobody can tell
whether that was true, what was run, or what it looked like. This folder answers
those permanently:

- **What command was run** — exact, copy-pasteable.
- **What it returned** — exit codes, HTTP statuses, full output, not a summary.
- **What it looked like** — a screenshot or short recording when the claim is
  about rendering, layout or an interactive flow, which a status code cannot
  prove. A `200` proves the server answered; it does not prove the console
  rendered a usable page rather than a blank div with a JavaScript error.

This repository has a specific reason to care: its frontends were described as
complete and verified when they were neither.

## Structure

```
docs/evidence/
├── README.md                     this file — one copy, both apps
├── email-send/
│   ├── 0000-template/
│   └── 0001-<task-slug>/
│       ├── <finding>.md
│       ├── <finding>-<what-it-shows>.png
│       └── <finding>-walkthrough.webm
└── email-inbox/
    └── 0000-template/
```

- **Number** — monotonic per app, never reused or reordered.
- **Slug** — short, matching the task or commit it backs (`data-presentation-split`).
- **One `.md` per finding**, not one file per task. Someone checking "does `⌘K`
  focus the search field" should not wade through unrelated build output.

## What goes in the `.md`

```markdown
# Evidence: <claim being verified>

Task: <what this backs> (commit `<sha>`).

## Command run

<exact command, in a fenced block>

## Output

<full output, in a fenced block, not a paraphrase>

## Screenshots / video

![what to look for](./<file>.png)

## Cleanup

<teardown command, if the verification stood up state>
```

Rules:

- Paste real output from a command actually run. Never an example from memory or
  "what it should look like".
- Include exit codes and HTTP statuses explicitly, not "it worked".
- Record failures and surprises too, with the explanation. Evidence that a design
  decision holds includes the part where something behaved unexpectedly.

## Screenshots and video

- **Screenshot** — PNG, named `<finding>-<what-it-shows>.png`. Caption it with
  what to look for, not "screenshot of the page".
- **Video** — a few seconds of the exact flow, WebM, under a few hundred KB.
  Confirm it is non-empty and playable before committing
  (`ffprobe -show_entries format=duration,size`). A corrupt or 0-byte recording
  is worse than none: it is a false claim of evidence.
- Do not screenshot what output already proves.

## Capturing it

```bash
cd email-send/frontend && npm run dev &        # or email-inbox/frontend
npx --yes agent-browser open http://localhost:3000/console
npx --yes agent-browser screenshot ../../docs/evidence/email-send/000N-slug/name.png
npx --yes agent-browser record start ../../docs/evidence/email-send/000N-slug/name.webm http://localhost:3000/console
# ...interact...
npx --yes agent-browser record stop
npx --yes agent-browser close
kill %1
```

## What does not belong here

- Speculative "expected output" — evidence is post-hoc.
- Content already in an ADR or a spec; link to it instead.
- Secrets, tokens or real user data captured incidentally in a screenshot —
  redact, or do not capture.
