# ADR-0006: Responsive layout comes from CSS variables, not a width hook

- Status: Accepted
- Date: 2026-08-30
- Amends: [ADR-0002](0002-inline-styles-ported-from-design-mockups.md)

## Context

ADR-0002 chose to port the mockups' inline styles literally, including their
responsive branches, which test `window.innerWidth` in component state. It named
the consequence: "inline styles cannot express media queries, so responsive
layout depends on a client component and a mount-time width read."

The Lighthouse audit priced that consequence. Because the width is only known
after mount, the server render and first client render always use the design's
1280 px reference, and a phone paints a desktop layout that then collapses:
CLS 0.64 on the Plume landing page, 0.93 on the console, 0.35 on the Pane mail
app, against a 0.1 target. Everything else was already inside target.

## Decision

Every value that affects layout — grid columns, headline sizes, section padding,
gaps, and whether an element is displayed — is a CSS custom property defined on
`:root` in `globals.css` and redefined inside media queries at the mockups' own
breakpoints. Components consume them as `gridTemplateColumns: "var(--hero-cols)"`
and keep their inline styles otherwise.

Elements that exist only in the wide layout are always rendered and hidden with
`display: var(--wide-only)`, rather than being conditionally mounted.

`useViewport()` survives for the handful of branches that change the number of
DOM nodes rather than their box — the KPI sparkline bar count and the delivery
chart's bucket count — because those sit inside fixed-height containers and
cannot shift the page.

## Consequences

- CLS is 0 (0.006 on one route) on every measured route; performance scores went
  from 75–83 to 98–100 on mobile.
- Responsive behaviour is now correct with JavaScript disabled or still loading.
- The breakpoint values live in one file per app rather than beside the element
  they affect. That is the real cost: a component's inline style no longer tells
  you what it does at 640 px — `globals.css` does.
- Adding a responsive value means adding a variable to four media-query blocks.
  Acceptable for a fixed design; if the design grows a fifth breakpoint this
  should become a utility-class or CSS-module approach instead.
- ADR-0002 still stands for everything else: styles remain inline, and the mock
  data and structure split is unchanged.
