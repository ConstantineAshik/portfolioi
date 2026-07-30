'use client';

import { useSyncExternalStore } from 'react';

/**
 * Reports whether the visitor has asked for reduced motion, and keeps reporting
 * if they change the setting mid-session.
 *
 * Starts as `false` on the server and on first paint so the markup is stable,
 * then corrects itself in an effect. Motion code should therefore treat the
 * animated path as the fallback and gate *starting* animations on this value.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', onStoreChange);
      return () => query.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );
}
