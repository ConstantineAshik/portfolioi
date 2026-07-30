'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect } from 'react';

import styles from './states.module.css';

/**
 * Locale-scoped error boundary.
 *
 * A client component by requirement. It sits inside the locale segment, so
 * `useTranslations` has a provider above it and the copy stays localised.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('error');

  useEffect(() => {
    // The digest is the only safe correlator to show; the message may contain
    // internals, so it is logged rather than rendered.
    console.error('[error boundary]', error);
  }, [error]);

  return (
    <main className={styles.state}>
      <div className={styles.frame}>
        <p className={styles.code}>
          <span className={styles.prompt} aria-hidden="true">
            ~${' '}
          </span>
          {t('code')}
        </p>
        <h1 className={styles.heading}>{t('heading')}</h1>
        <p className={styles.detail}>{t('detail')}</p>

        {error.digest ? (
          <p className={styles.digest}>
            <span aria-hidden="true"># </span>
            {error.digest}
          </p>
        ) : null}

        <div className={styles.actions}>
          <button type="button" className={styles.action} onClick={reset}>
            {t('retry')}
          </button>
          <Link className={styles.actionQuiet} href="/">
            {t('home')}
          </Link>
        </div>
      </div>
    </main>
  );
}
