import { getTranslations } from 'next-intl/server';

import { footer, identity, socialLinks } from '@/config/portfolio';

import styles from './Footer.module.css';

export async function Footer() {
  const t = await getTranslations('footer');
  // Read at render time rather than module scope so a long-lived build does
  // not serve a stale year.
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.column}>
          <p className={styles.prompt}>
            <span aria-hidden="true">~$ </span>
            {t('signOff')}
          </p>
          <p className={styles.copyright}>{footer.copyright(year)}</p>
          <p className={styles.note}>{footer.note}</p>
        </div>

        <div className={styles.column}>
          <h2 className={`mono-label ${styles.heading}`}>{t('socialLabel')}</h2>
          <ul className={styles.links}>
            {socialLinks.map((link) => (
              <li key={link.label}>
                <a
                  className={styles.link}
                  href={link.href}
                  {...(link.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  <span>{link.label}</span>
                  <span className={styles.handle} aria-hidden="true">
                    {link.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h2 className={`mono-label ${styles.heading}`}>{t('statusLabel')}</h2>
          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {identity.availability}
          </p>
          <p className={styles.note}>
            {identity.location} — {identity.timezone}
          </p>
          <a className={styles.top} href="#hero">
            {t('backToTop')}
            <span aria-hidden="true"> ↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
