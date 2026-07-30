'use client';

import { useId } from 'react';

import styles from './Marquee.module.css';

type MarqueeProps = {
  /** Phrases rendered in sequence; separated by the divider glyph. */
  items: readonly string[];
  /** 'left' scrolls content right-to-left (the default reading drift). */
  direction?: 'left' | 'right';
  /** Seconds for one full cycle. Longer = calmer. */
  duration?: number;
  divider?: string;
};

/**
 * Seamless CSS marquee.
 *
 * The track holds two identical copies of the content and translates by exactly
 * -50%, so the second copy lands where the first began and the loop has no seam.
 * The duplicate is `aria-hidden` and the whole strip is `role="marquee"`-free —
 * screen readers get one clean copy of the text, once.
 *
 * Animation is CSS rather than GSAP so it costs no main-thread work, and it
 * pauses on hover/focus and stops entirely under reduced-motion (see the
 * stylesheet).
 */
export function Marquee({
  items,
  direction = 'left',
  duration = 40,
  divider = '/',
}: MarqueeProps) {
  const id = useId();

  const content = items.map((item, index) => (
    <span key={`${id}-${index}`} className={styles.item}>
      <span className={styles.divider} aria-hidden="true">
        {divider}
      </span>
      {item}
    </span>
  ));

  return (
    <div className={styles.viewport}>
      <div
        className={styles.track}
        data-direction={direction}
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        <div className={styles.group}>{content}</div>
        <div className={styles.group} aria-hidden="true">
          {content}
        </div>
      </div>
    </div>
  );
}
