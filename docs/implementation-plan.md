# Implementation Plan

## Status of the reference audit

The master prompt required a live browser audit of `https://www.sergio-ayala.com/` at
eight viewports. This session has no browser-automation tool (no Playwright/Puppeteer
MCP, no screenshot capability), so the reference was **never rendered or measured**.

Rather than fabricate sampled colors, grid dimensions and animation timings, the design
system in `docs/reference-audit.md` is derived from the written specification in the
master prompt and labelled as such. Every value there is a deliberate design decision,
not a measurement. Phase 7 (visual comparison against the reference) remains open.

## Content remap

The reference is a photographer/illustrator portfolio. The supplied content
(`Md Ashik CV-software.pdf`) is a software engineer and ML researcher CV. Inventing a
photography archive and illustration story for someone who has neither would produce a
portfolio that misrepresents them, so the reference's *structural patterns* are kept and
pointed at real content:

| Reference section        | This build                     | Pattern reused |
| ----------------------- | ------------------------------ | -------------- |
| Hero                    | Hero                           | identical |
| About                   | About                          | identical |
| Brand DNA + certificates| Research + publications        | oversized heading, carousel |
| Art Direction case studies | Engineering case studies    | title list + pinned preview |
| Photography archive     | Project archive by domain      | category list + live preview, lightbox |
| Illustration story      | Research story (scroll-driven) | pinned sequence, progress counter |
| Polaroid gallery        | Credential stack               | layered stack, swipe, full view |
| Contact                 | Contact                        | identical |

Section names, component names and route anchors follow the new content. The interaction
inventory in the master prompt is implemented in full.

## Visual direction

TUI / terminal-inspired editorial, as approved: phosphor accent on near-black, monospace
interface chrome, bracketed controls, rule lines, oversized section numerals, generous
negative space. No cards, no gradients, no glassmorphism.

## Phases

1. **Foundation** — Next.js 15 App Router, TypeScript strict, Tailwind v4, fonts, tokens,
   types, `next-intl` locale routing, root layout.
2. **Data** — `src/config/portfolio.ts` populated from the CV; `content/en.json`,
   `content/en.json` for UI strings.
3. **Static build** — every section laid out and responsive, no motion.
4. **Interaction** — nav, mobile menu, accordions, carousel, lightbox, form, locale switch.
5. **Motion** — GSAP hero timeline, marquees, reveals, pinned sequence, parallax.
6. **A11y + perf** — reduced motion, focus management, contrast, image optimisation.
7. **Comparison** — blocked on browser access; documented as open.
8. **QA** — lint, typecheck, production build, Vitest, Playwright, `docs/QA-report.md`.

## Open decisions

- Locales: English + Bangla (native language on the CV) instead of Spanish.
- Contact provider: Resend via env, with a dev fallback that logs server-side.
- All imagery is generated placeholder SVG until real assets are supplied.
