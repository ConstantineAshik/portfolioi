import { getTranslations } from 'next-intl/server';

import { footer, socialLinks } from '@/config/portfolio';

import styles from './Footer.module.css';

export async function Footer() {
  const t = await getTranslations('footer');
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
      </div>
    </footer>
  );
}
