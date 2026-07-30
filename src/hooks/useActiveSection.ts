'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks which section is currently in view and mirrors it into the URL hash.
 *
 * Uses IntersectionObserver rather than scroll maths so it costs nothing on the
 * main thread while idle. The hash is written with `replaceState` so the browser
 * back button still walks real navigation history instead of every section the
 * visitor scrolled past.
 */
export function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    // Track ratios for every observed section and pick the most visible one,
    // which behaves correctly for both tall and short sections.
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }

        let bestId = '';
        let bestRatio = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }

        if (bestId && bestRatio > 0) {
          setActiveId(bestId);
        }
      },
      {
        // Discount the fixed header so a section is "active" once it clears it.
        rootMargin: '-20% 0px -50% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    for (const element of elements) observer.observe(element);

    return () => observer.disconnect();
  }, [ids]);

  useEffect(() => {
    if (!activeId) return;
    const next = `#${activeId}`;
    if (window.location.hash === next) return;
    window.history.replaceState(null, '', next);
  }, [activeId]);

  return activeId;
}
