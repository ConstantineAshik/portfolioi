import { getTranslations } from 'next-intl/server';

import styles from './states.module.css';

export default async function Loading() {
  const t = await getTranslations('loading');

  return (
    <div className={styles.state} role="status" aria-live="polite">
      <p className={styles.line}>
        <span className={styles.prompt} aria-hidden="true">
          ~${' '}
        </span>
        {t('message')}
        <span className={styles.caret} aria-hidden="true" />
      </p>
    </div>
  );
}
