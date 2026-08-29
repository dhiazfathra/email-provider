# ADR-0002: Port design mockups as React inline styles, not a CSS framework

- Status: Accepted
- Date: 2026-08-29

## Context

The source mockups are Claude Design `.dc.html` artboards. Every visual property
is already expressed as an inline `style="..."` attribute on the element, with a
small JS data model (`DCLogic`) supplying lists and responsive values via
template placeholders.

The options for porting were: (a) rewrite each artboard into Tailwind utility
classes, (b) extract CSS modules, or (c) keep the inline styles and translate the
data model into React state and typed mock modules.

Options (a) and (b) mean re-deriving every arbitrary value (`fontSize: 17.5`,
`rgba(76,66,160,.7)` shadows, `blur(26px)` glass layers) into a token vocabulary
the design never used. That is a rewrite with a fidelity risk on every element,
and it needs an extra build dependency.

## Decision

Port artboards 1:1 as React inline `style` objects. Only three things leave the
element:

1. Global resets, the font stack, and `@keyframes` — `app/globals.css`.
2. List/content data — typed modules under `lib/mock/`.
3. Responsive branches — a `useViewport()` hook reproducing the mockups' own
   `narrow < 960` / `mob < 640` breakpoints.

Interactive `<a href="#" onClick>` controls from the mockups become real
`<button>` elements; navigation links become `next/link`.

## Consequences

- Visual fidelity to the mockups is high and verifiable element by element.
- No CSS framework dependency, and no unused-utility payload.
- Inline styles cannot express media queries, so responsive layout depends on a
  client component and a mount-time width read. Pages start at the design's
  1280px reference so server and first client render agree.
- If a page later needs media-query-only responsiveness (no JS), that page moves
  its layout branches into `globals.css`; the rest stay inline.
