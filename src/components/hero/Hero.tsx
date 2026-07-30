import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { identity } from '@/config/portfolio';

import styles from './Hero.module.css';
import { HeroEntrance } from './HeroEntrance';
import { Header } from '../layout/Header';
import { Marquee } from '../motion/Marquee';

export async function Hero() {
  const t = await getTranslations('hero');
  const photo = await getTranslations('photo');
  const hasPhoto = existsSync(join(process.cwd(), 'public', 'profile.jpg'));

  const marqueeItems = t('marquee')
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-heading">
      {/* Progressive enhancement: all text below is server-rendered and visible
          by default. HeroEntrance only *adds* an entrance animation when GSAP
          loads and the reader has not asked for reduced motion. */}
      <HeroEntrance />

      <div className={`container ${styles.inner}`}>
        <header className={styles.meta} data-hero="line">
          <span className="mono-label">{t('label')}</span>
          <span className={styles.metaDivider} aria-hidden="true" />
          <span className="mono-label">{identity.yearsOfExperience} YRS</span>
        </header>

        <div className={styles.heroGrid}>
          <h1 id="hero-heading" className={styles.title}>
            {identity.nameLines.map((line, index) => (
              <span key={line} className={styles.titleLine}>
                <span className={styles.titleInner} data-hero={`name-${index}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <div className={styles.portraitColumn} data-hero="line">
            <div className={styles.portal}>
              <div className={styles.orbit} aria-hidden="true">
                <div className={styles.ringSpinner} data-photo-orbit />
              </div>
              <svg
                className={styles.availabilityOrbit}
                viewBox="0 0 320 320"
                aria-hidden="true"
              >
                <defs>
                  <path
                    id="availability-path"
                    d="M 14,160 A 146,146 0 1,1 306,160 A 146,146 0 1,1 14,160"
                  />
                </defs>
                <text>
                  <textPath href="#availability-path" startOffset="58%">
                    VIBING · CODING
                  </textPath>
                </text>
              </svg>
              <div className={styles.techOrbit} aria-hidden="true">
                <span className={styles.techLogo} data-tech="js">JS</span>
                <span className={styles.techLogo} data-tech="ts">TS</span>
                <span className={styles.techLogo} data-tech="py">Py</span>
                <span className={styles.techLogo} data-tech="java">Jv</span>
                <span className={styles.techLogo} data-tech="kt">Kt</span>
                <span className={styles.techLogo} data-tech="react">⚛</span>
                <span className={styles.techLogo} data-tech="html">H5</span>
                <span className={styles.techLogo} data-tech="css">C3</span>
                <span className={styles.techLogo} data-tech="cpp">C++</span>
                <span className={styles.techLogo} data-tech="sql">SQL</span>
              </div>
              <div
                className={`${styles.portrait} ${hasPhoto ? styles.hasPhoto : ''}`}
                role="img"
                aria-label={photo('photoAlt')}
              >
                {hasPhoto ? (
                  <Image
                    className={styles.profileImage}
                    src="/profile.jpg"
                    alt={photo('photoAlt')}
                    fill
                    priority
                    sizes="(max-width: 767px) 61vw, 17.5rem"
                  />
                ) : (
                  <span className={styles.initials} aria-hidden="true">
                    <span>MA</span>
                    <i />
                  </span>
                )}
              </div>
            </div>
            <p className={styles.portraitIntro}>{identity.shortIntro}</p>
          </div>
        </div>

        <div className={styles.details}>
          <p className={styles.role} data-hero="line">
            <span className={styles.prompt} aria-hidden="true">
              ~${' '}
            </span>
            {t('role')}
          </p>

          <p className={styles.based} data-hero="line">
            {t('based')} {identity.location}
            <span className={styles.tz} aria-hidden="true">
              {' '}
              ({identity.timezone})
            </span>
          </p>

          <div className={styles.actions} data-hero="line">
            <a className={styles.cta} href="#contact">
              {t('availableNow')}
              <span className={styles.ctaDot} aria-hidden="true" />
            </a>
            <a
              className={styles.secondary}
              href={identity.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('resume')}
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </div>

        <div className={styles.heroNavigation} data-nav-anchor data-hero="line">
          <Header />
        </div>
      </div>

      <div className={styles.bottom} data-hero="line">
        <Marquee items={marqueeItems} duration={45} />
        <div className={`container ${styles.scrollRow}`}>
          <span className={`mono-label ${styles.scrollHint}`}>
            {t('scroll')}
            <span className={styles.scrollArrow} aria-hidden="true">
              ↓
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
