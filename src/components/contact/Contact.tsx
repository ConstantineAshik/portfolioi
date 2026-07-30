import { getTranslations } from 'next-intl/server';

import { identity, socialLinks } from '@/config/portfolio';

import styles from './Contact.module.css';
import { ContactForm } from './ContactForm';

export async function Contact() {
  const t = await getTranslations('contact');

  return (
    <section id="contact" className={`section ${styles.contact}`} aria-labelledby="contact-heading">
      <div className="container">
        <div className={styles.head}>
          <span className="mono-label">
            <span aria-hidden="true">05 / </span>
            {t('label')}
          </span>
        </div>

        <h2 id="contact-heading" className={styles.heading}>
          {t('heading')}
        </h2>
        <p className={styles.intro}>{t('intro')}</p>

        <div className={styles.grid}>
          {/* Terminal-inspired frame: a title bar, a prompt, and a status line.
              The chrome is decorative and hidden from assistive tech; the form
              inside it is an ordinary labelled form. */}
          <div className={styles.terminal}>
            <div className={styles.titleBar} aria-hidden="true">
              <span className={styles.dots}>
                <span />
                <span />
                <span />
              </span>
              <span className={styles.titleBarLabel}>{t('sessionLabel')}</span>
            </div>
            <div className={styles.terminalBody}>
              <ContactForm />
            </div>
          </div>

          <aside className={styles.side}>
            <div className={styles.block}>
              <h3 className={`mono-label ${styles.sideLabel}`}>{t('directLabel')}</h3>
              <a className={styles.email} href={`mailto:${identity.email}`}>
                {identity.email}
              </a>
            </div>

            <div className={styles.block}>
              <h3 className={`mono-label ${styles.sideLabel}`}>{t('elsewhereLabel')}</h3>
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
                      {link.label}
                      <span className={styles.linkHandle}>{link.handle}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.block}>
              <h3 className={`mono-label ${styles.sideLabel}`}>{t('locationLabel')}</h3>
              <p className={styles.sideValue}>
                {identity.location}
                <span className={styles.sideMuted}> ({identity.timezone})</span>
              </p>
            </div>

            <div className={styles.block}>
              <h3 className={`mono-label ${styles.sideLabel}`}>{t('availabilityLabel')}</h3>
              <p className={styles.sideValue}>{identity.availability}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
