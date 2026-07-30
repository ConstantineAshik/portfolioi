import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/navigation';

import styles from './states.module.css';

export default async function NotFound() {
  const t = await getTranslations('notFound');

  return (
    <main className={styles.state}>
      <div className={styles.frame}>
        <p className={styles.code}>
          <span className={styles.prompt} aria-hidden="true">
            ~${' '}
          </span>
          {t('code')}
        </p>
        <h1 className={styles.heading}>
          <span className={styles.bigCode} aria-hidden="true">
            {t('label')}
          </span>
          {t('heading')}
        </h1>
        <p className={styles.detail}>{t('detail')}</p>

        <div className={styles.actions}>
          <Link className={styles.action} href="/">
            {t('home')}
          </Link>
        </div>
      </div>
    </main>
  );
}
