#!/usr/bin/env python3
"""Merge the per-page `*.contract.md` files into the root API_CONTRACTS.md.

The per-page files are the source of truth (ADR-0003); this script only
concatenates them, grouped by product then page, and demotes their headings so
they nest under the generated section headers.

Usage: python3 scripts/build-contracts.py
"""

from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

PRODUCTS = [
    (
        "Plume — email-send",
        [
            ("email-send/frontend/app/landing.contract.md", "Landing page"),
            ("email-send/frontend/app/console/console.contract.md", "Console"),
            ("email-send/frontend/app/docs/docs.contract.md", "Docs"),
        ],
    ),
    (
        "Pane — email-inbox",
        [
            (
                "email-inbox/frontend/app/(marketing)/marketing.contract.md",
                "Marketing site",
            ),
            ("email-inbox/frontend/app/mail/mail.contract.md", "Mail app"),
        ],
    ),
]

HEADER = """# API contracts

Backend handoff for both products. The frontends run on mock data; these are the
endpoints they are written against.

**This file is generated.** The source of truth is the `*.contract.md` file
beside each page ([ADR-0003](docs/adr/0003-api-contract-format.md)). Rebuild it
with `scripts/build-contracts.py` rather than editing here.

Nothing below is implemented. Treat every shape as a proposal the Go team can
push back on.

## Contents

"""


def anchor_for(product: str, label: str) -> str:
    brand = product.split(" — ")[0].lower()
    return f"{brand}-{label.lower().replace(' ', '-')}"


def build() -> str:
    out = [HEADER]

    for product, entries in PRODUCTS:
        out.append(f"- **{product}**\n")
        for path, label in entries:
            out.append(f"  - [{label}](#{anchor_for(product, label)}) — `{path}`\n")
    out.append("\n")

    for product, entries in PRODUCTS:
        brand = product.split(" — ")[0]
        out.append(f"---\n\n# {product}\n\n")
        for path, label in entries:
            out.append(f"## {brand} {label}\n\n")
            out.append(f"_Source: `{path}`_\n\n")
            body = (ROOT / path).read_text().strip()
            lines = []
            for line in body.split("\n"):
                if line.startswith("# "):
                    # the file's own title is replaced by the section heading above
                    continue
                if line.startswith("## "):
                    line = "#### " + line[3:]
                lines.append(line)
            out.append("\n".join(lines).strip() + "\n\n")

    return "".join(out)


if __name__ == "__main__":
    target = ROOT / "API_CONTRACTS.md"
    text = build()
    target.write_text(text)
    print(f"wrote {target.relative_to(ROOT)} ({len(text)} bytes)")
