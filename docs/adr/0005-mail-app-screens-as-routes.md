# ADR-0005: The mockups' screen switchers become real routes

- Status: Accepted
- Date: 2026-08-30

## Context

Three of the five artboards are single files that switch between many screens in
component state: the Plume console holds seven sections behind an `sc-if` chain,
the Pane marketing artboard holds twelve pages, and the Pane mail artboard holds
seven screens plus a "Screens" switcher in its sidebar.

Ported literally, each would be one enormous client component with a `screen`
state variable — no deep links, no browser history, no code splitting, and a
first load that ships every screen to every visitor.

## Decision

Every screen the mockups switch between becomes a Next.js route:

- Plume console — `/console`, `/console/activity`, `/console/templates`,
  `/console/domains`, `/console/keys`, `/console/suppressions`, `/console/audit`
- Pane marketing — `/`, `/product`, `/security`, `/pricing`, `/changelog`,
  `/privacy`, `/terms`, `/status`, `/support`, `/careers`, `/signin`, `/signup`
- Pane mail — `/mail`, `/mail/read`, `/mail/split`, `/mail/compose`,
  `/mail/popup`, `/mail/settings`, `/mail/profile`

Shared chrome (console sidebar, marketing header/footer, mail rail) moves into a
`layout.tsx`, and the active item is derived from `usePathname()` rather than
from state.

The mail app's own "Screens" list — which is a design-review affordance, not a
product feature — is kept as a navigation block in the sidebar, now pointing at
these routes. It stays because the mockup treats it as part of the deliverable;
a real product would drop it.

## Consequences

- Every screen is linkable, bookmarkable and back-button-correct.
- Each route is statically prerendered and ships only its own code.
- State that genuinely spans screens needs somewhere to live. In the mail app
  that is one React context (`app/mail/state.tsx`) holding the theme, the
  selected thread, the lane filter and the rail's collapsed flag — the things
  the single-artboard version kept in component state.
- Dark mode therefore resets on a full page reload. That is acceptable while the
  backend does not exist; `PATCH /v1/me/settings` in the mail contract is where
  it becomes durable.
