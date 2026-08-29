# Performance

Measured with Lighthouse 12 against the deployed Vercel builds, mobile preset
(the default: emulated Moto G Power, 4× CPU throttle, slow 4G). Desktop numbers
were already at 100 before any change, so mobile is what these targets govern.

## Targets

Set before measuring, from the Core Web Vitals "good" thresholds, tightened
where a static marketing/console site has no excuse:

| Metric                          | Target   | Why                                                     |
| ------------------------------- | -------- | ------------------------------------------------------- |
| Lighthouse performance (mobile) | ≥ 90     | These are static pages; below 90 means something is off |
| Largest Contentful Paint        | ≤ 2.5 s  | Core Web Vitals "good"                                  |
| Time to Interactive             | ≤ 3.5 s  | Every page is a client component; it has to settle fast |
| Total Blocking Time             | ≤ 200 ms | Core Web Vitals proxy for input delay                   |
| Cumulative Layout Shift         | ≤ 0.1    | Core Web Vitals "good"                                  |
| Total transferred per route     | ≤ 300 KB | Keeps the whole page inside one slow-4G round of budget |

## Before

| Route            | Score | LCP   | TTI   | TBT   | CLS       | Transferred |
| ---------------- | ----- | ----- | ----- | ----- | --------- | ----------- |
| Plume `/`        | 77    | 2.0 s | 2.0 s | 30 ms | **0.636** | 233 KiB     |
| Plume `/console` | 75    | 2.0 s | 2.0 s | 30 ms | **0.928** | 239 KiB     |
| Pane `/`         | 98    | 2.3 s | 2.3 s | 20 ms | 0         | 222 KiB     |
| Pane `/mail`     | 83    | 1.9 s | 1.9 s | 10 ms | **0.345** | 237 KiB     |

Every metric except CLS was already inside target. CLS was 3× to 9× over it.

## What was wrong

The mockups branch on `window.innerWidth` in component state, and
[ADR-0002](adr/0002-inline-styles-ported-from-design-mockups.md) ported that
literally: `useViewport()` starts at the design's 1280 px reference, so the
server render and the first client render both lay the page out as desktop, and
the real width only arrives in an effect after mount.

On a phone that means the first paint is a desktop layout that then collapses —
one heading dropping 54 px → 38 px, a two-column hero becoming one column, a
console sidebar disappearing. Lighthouse scores exactly that as layout shift.
The ADR named this as the risk of the approach; the measurement is what turned
it from a risk into a defect.

## The fix

Every layout-affecting value moved from a JS branch to a CSS custom property
resolved by a media query, defined in each app's `globals.css`. The first paint
is already correct at any width, so nothing moves after hydration.

JS keeps only the branches that cannot be expressed as a value: how many
sparkline bars to render (inside a fixed-height box, so it cannot shift
anything), and the split screen's always-compact row layout, which is a
`.email-list--compact` class rather than a width test.

Cells that only exist in the wide table layouts (the console's Subject/Stream/
Status columns, the mail row's preview and tag) are now always rendered and
hidden with `display: var(--wide-only)` / `display: var(--row-extra-display)`
instead of being conditionally mounted.

One deliberate fidelity change came with it: in the compact row layout the
subject line now keeps its unread weight instead of always rendering at 400.
Reproducing the old behaviour would have needed a second JS branch for the sake
of a lighter font weight.

## After

| Route            | Score   | LCP   | TTI   | TBT   | CLS       | Transferred |
| ---------------- | ------- | ----- | ----- | ----- | --------- | ----------- |
| Plume `/`        | **98**  | 2.3 s | 2.3 s | 30 ms | **0**     | 233 KiB     |
| Plume `/console` | **99**  | 2.0 s | 2.0 s | 40 ms | **0.006** | 240 KiB     |
| Plume `/docs`    | **99**  | 2.0 s | 2.0 s | 30 ms | **0**     | 248 KiB     |
| Pane `/`         | **98**  | 2.3 s | 2.3 s | 20 ms | **0**     | 222 KiB     |
| Pane `/mail`     | **100** | 1.9 s | 1.9 s | 40 ms | **0**     | 238 KiB     |
| Pane `/pricing`  | **100** | 1.8 s | 1.8 s | 30 ms | **0**     | 203 KiB     |

Every target is met on every route measured. Nothing was done to LCP, TTI, TBT
or transfer size — they were inside target already, and there was no reason to
touch them.

## Reproducing

```bash
npx lighthouse@12 https://email-send-frontend-two.vercel.app \
  --only-categories=performance --quiet \
  --chrome-flags="--headless=new" --view
```

Numbers move a few percent run to run; the CLS difference (0.9 → 0) does not.

## Not measured

- Field data. There is no traffic and no RUM, so everything here is lab data on
  one machine.
- Accessibility, SEO and best-practice categories. Worth a pass before this goes
  anywhere real.
- The `/mail` app under a realistic mailbox. The list renders 16 mock threads;
  the contract's `limit` defaults to 50 and pages beyond that, which is where
  list virtualisation would start to matter.
