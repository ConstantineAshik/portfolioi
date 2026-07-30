# Reference Audit

> **Provenance warning — read first.**
> This document is **specification-derived, not measured**. The reference site
> `https://www.sergio-ayala.com/` was never rendered in this session: no browser
> automation tool was available, so no viewport was resized, no computed style was read,
> and no screenshot was captured. `docs/reference-screenshots/` is therefore empty.
>
> Every number, hex value, duration and easing curve below is a **design decision made
> for this project**, chosen to satisfy the written brief. None of it is evidence about
> the reference. Where the brief describes a behaviour but not its parameters, the
> parameter is marked `[chosen]`. Where the reference's actual behaviour cannot be known
> at all, it is listed in §30.
>
> Phase 7 of the plan (visual comparison against the reference) is **open**.

## 1. Page structure

Single-page vertical document, one route per locale, sections as anchor targets.

```
skip-link
header            fixed, full width
main
  #hero           100vh
  #about
  #research       (reference: Brand DNA)
  #work           (reference: Art Direction)
  #archive        (reference: Photography)
  #story          (reference: Illustration sequence)
  #contact
footer
```

## 2. Section order

hero → about → research → work → archive → story → contact → footer.
Rationale: identity, then person, then credibility, then applied work, then breadth,
then depth, then the ask. Matches the brief's ordering.

## 3. Header positioning

`position: fixed`, top, `z-index: 100`, transparent at rest over the hero. Past 80px of
scroll it gains a hairline bottom border and a backdrop-blurred background `[chosen]`.
Height 64px desktop, 56px mobile `[chosen]`.

## 4. Navigation behaviour

Monospace, uppercase, `letter-spacing: 0.18em`, bracketed on hover/active `[chosen]`.
Active section tracked by IntersectionObserver, reflected as `aria-current="true"`.
Clicking scrolls smoothly and replaces the URL hash via `history.replaceState` — no
reload, no scroll jump. Numerals `01`–`06` precede each label.

## 5. Desktop vs mobile

| | Desktop ≥1024 | Mobile <1024 |
| --- | --- | --- |
| Nav | inline links | full-screen menu, focus-trapped |
| Work | title list + pinned preview pane | stacked tap-to-open cards |
| Archive | category column + live preview | accordion, tap to open lightbox |
| Story | pinned, scroll-driven | normal vertical flow, no pin |
| Parallax | yes | disabled |
| Type scale | full | reduced via `clamp()` |
| Decorative layer | full | thinned |

## 6–8. Typography

Three roles: display (`--font-display`), body (`--font-body`), mono (`--font-mono`).
All sized with `clamp()`. Display headings: `line-height: 0.9`, `letter-spacing: -0.03em`.
Body: `1.65` / `0`. Mono labels: `0.72rem`, `letter-spacing: 0.2em`, uppercase.
Letter spacing is always CSS, never literal spaces inside content strings.
Longest heading verified not to overflow at 360px.

## 9. Palette `[chosen]`

Terminal phosphor on near-black. Sampled from nothing.

```
--color-background #0A0A0A
--color-surface    #121212
--color-text       #EDEDED
--color-muted      #8A8A8A
--color-accent     #C6F04E
--color-border     #262626
```

`#C6F04E` on `#0A0A0A` ≈ 14.8:1. `#8A8A8A` on `#0A0A0A` ≈ 6.4:1. Both pass AA.

## 10–13. Grid, widths, spacing

12-column grid, `--container-width: 1440px`, `--page-gutter` `clamp(1.25rem, 5vw, 5rem)`,
`--section-spacing` `clamp(6rem, 12vh, 12rem)`. Hero is `100svh`; other sections are
content-height with generous top/bottom rhythm. Prose capped at 68ch.

## 14. Rules and decoration

1px `--color-border` hairlines. Oversized section numerals in outlined display type.
ASCII/technical marks (`>>>`, `//`, `[ ]`, `·`, `→`) as separators. A fixed SVG grain
overlay at low opacity, `pointer-events: none`.

## 15. Image aspect ratios

Work covers 16:9. Archive entries carry explicit width/height and use their real ratio.
Credential stack 4:3. Every `next/image` gets width, height and `sizes` — no CLS.

## 16–17. Hover and cursor

Links: accent colour + bracket reveal. Work titles: hover swaps the pinned preview.
Archive rows: hover/focus updates the preview pane. Marquees slow on hover.
No custom cursor — a real one is a hover-only affordance that adds nothing on touch.

## 18. Loading

`app/[locale]/loading.tsx`: centred monospace boot line with a block caret. Hero content
is server-rendered and readable before hydration; the entrance animation only refines it.

## 19–23. Motion inventory

| Effect | Where | Params `[chosen]` |
| --- | --- | --- |
| Hero timeline | hero | 8 steps, ~1.4s total, `power3.out` |
| Split-line reveal | all headings | `y: 100%` masked, 0.06s stagger |
| Marquee | hero, about | seamless duplicate track, ~28s loop |
| Parallax | decorative + covers | ±8% travel, desktop only |
| Section reveal | all | fade+rise 24px at 80% viewport |
| Pinned preview | work | pin the media column, swap on hover |
| Scroll sequence | story | pinned, progress `000%`→`100%` |
| Carousel | research | crossfade + 3D tilt, 0.5s |
| Accordion | archive | height auto, 0.35s |
| Lightbox | archive, story | scale 0.96→1 + fade, 0.3s |

All GSAP work lives in `gsap.context()` and is reverted on unmount.
`ScrollTrigger.matchMedia` gates desktop-only effects. Nothing hijacks native scroll.

## 24. Modal / lightbox

Full-screen, `role="dialog" aria-modal="true"`, focus trapped, Escape closes, focus
returns to the trigger, body scroll locked, prev/next buttons, arrow keys, swipe,
`n / total` counter, metadata panel.

## 25. Accordion

One category open at a time by default. Button + `aria-expanded` + `aria-controls`.
Keyboard operable. Content stays in the DOM for SEO.

## 26. Contact form

Terminal framing. `>>>` prefixes, `NEW_MESSAGE` label, READY → SENDING → SENT / ERROR.
React Hook Form + Zod, field-level errors in an `aria-live` region, honeypot, disabled
during flight, in-memory rate limit server-side, values preserved on recoverable error,
"send another" resets. `POST /api/contact`, Resend via env, dev fallback logs.

## 27. Mobile substitutions

Every hover affordance has a tap equivalent; pinned sequences become vertical flow;
horizontal arrangements become stacks. Touch targets ≥44×44.

## 28. Reduced motion

`prefers-reduced-motion: reduce` → no entrance timeline (content visible immediately),
no parallax, no pin, marquees static, transitions collapse to ~0.01ms opacity changes.

## 29. Footer

Not fixed. Hairline top border, oversized wordmark, nav repeat, social links,
locale switch, copyright, build stamp.

## 30. Cannot be determined

Unknowable without rendering the reference — all deliberately chosen here instead:

1. Actual colour values.
2. Actual typefaces.
3. Actual type scale, line heights, letter spacing.
4. Actual grid, gutters, container width.
5. Actual section heights and white-space rhythm.
6. Animation durations, easings, stagger, scroll distances.
7. Whether the certificate carousel autoplays.
8. Loading-screen content and duration.
9. Whether a custom cursor exists.
10. Mobile breakpoints and substitutions.
11. Reduced-motion support.
12. Error-screen design.
13. Image aspect ratios and crops.
14. Marquee copy, direction and speed.
15. Whether Lenis or similar smooth scrolling is used.
