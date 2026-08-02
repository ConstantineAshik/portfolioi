'use client';

import { useEffect } from 'react';

import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Adds the hero entrance sequence.
 *
 * Renders nothing. The hero's markup is fully visible without it — this
 * component only animates *from* a hidden state *to* the already-correct
 * resting state, and it sets that hidden state itself from JS. So if the bundle
 * fails, JS is disabled, or reduced motion is on, the hero simply appears.
 *
 * GSAP is imported dynamically so it stays out of the initial bundle.
 */
export function HeroEntrance() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    let context: { revert: () => void } | undefined;
    let cancelled = false;

    void (async () => {
      const { gsap } = await import('gsap');
      if (cancelled) return;

      const section = document.getElementById('hero');
      if (!section) return;

      context = gsap.context(() => {
        const names = gsap.utils.toArray<HTMLElement>('[data-hero^="name-"]');
        const lines = gsap.utils.toArray<HTMLElement>('[data-hero="line"]');

        const timeline = gsap.timeline({
          defaults: { ease: 'power3.out' },
          // Wait for fonts so the mask reveal is measured against final glyphs.
          delay: 0.1,
        });

        // 1. Meta row fades in first, establishing the frame.
        timeline.from(lines[0], { autoAlpha: 0, duration: 0.5 });

        // 2-3. Name lines rise out of their overflow-hidden masks, staggered.
        timeline.from(
          names,
          { yPercent: 110, duration: 0.9, stagger: 0.08 },
          '-=0.2',
        );

        // 4-8. Remaining lines lift in sequence: role, location, intro,
        // actions, then the marquee + scroll hint.
        timeline.from(
          lines.slice(1),
          {
            autoAlpha: 0,
            y: 18,
            duration: 0.6,
            stagger: 0.09,
            clearProps: 'transform,opacity,visibility',
          },
          '-=0.45',
        );
      }, section);
    })();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [prefersReducedMotion]);

  return null;
}
