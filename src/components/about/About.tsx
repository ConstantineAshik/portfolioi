import { getTranslations } from 'next-intl/server';

import {
  education,
  experience,
  identity,
  leadership,
  skillGroups,
  spokenLanguages,
  stats,
} from '@/config/portfolio';

import styles from './About.module.css';

export async function About() {
  const t = await getTranslations('about');

  return (
    <section id="about" className={`section ${styles.about}`} aria-labelledby="about-heading">
      <div className="container">
        <div className={styles.head}>
          <span className="mono-label">
            <span aria-hidden="true">01 / </span>
            {t('label')}
          </span>
          <p className={styles.greeting}>
            <span className={styles.prompt} aria-hidden="true">
              ~${' '}
            </span>
            {t('greeting')}
          </p>
        </div>

        <h2 id="about-heading" className={styles.heading}>
          {t('heading')}
        </h2>

        <div className={styles.grid}>
          <div className={styles.bio}>
            <h3 className={`mono-label ${styles.subheading}`}>{t('bioLabel')}</h3>
            <div className="prose">
              {identity.longBio.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>

            <blockquote className={styles.quote}>
              <p>{t('quote')}</p>
            </blockquote>
          </div>

          <aside className={styles.side}>
            <div className={styles.block}>
              <h3 className={`mono-label ${styles.subheading}`}>{t('statsLabel')}</h3>
              <dl className={styles.stats}>
                {stats.map((stat) => (
                  <div key={stat.label} className={styles.stat}>
                    <dt className={styles.statLabel}>{stat.label}</dt>
                    <dd className={styles.statValue}>{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className={styles.block}>
              <h3 className={`mono-label ${styles.subheading}`}>{t('languagesLabel')}</h3>
              <ul className={styles.plainList}>
                {spokenLanguages.map((language) => (
                  <li key={language.name} className={styles.row}>
                    <span>{language.name}</span>
                    <span className={styles.rowMeta}>{language.level}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        {/* Skills as a dense, typographic composition — the density itself
            communicates breadth, without inventing a numeric proficiency the
            data does not contain. */}
        <div className={styles.stack}>
          <h3 className={`mono-label ${styles.subheading}`}>{t('skillsLabel')}</h3>
          <div className={styles.stackGrid}>
            {skillGroups.map((group) => (
              <div key={group.title} className={styles.stackGroup}>
                <h4 className={styles.stackTitle}>{group.title}</h4>
                <ul className={styles.tags}>
                  {group.items.map((item) => (
                    <li key={item} className={styles.tag}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.timeline}>
          <div className={styles.block}>
            <h3 className={`mono-label ${styles.subheading}`}>{t('experienceLabel')}</h3>
            <ul className={styles.plainList}>
              {experience.map((entry) => (
                <li key={`${entry.organisation}-${entry.role}`} className={styles.entry}>
                  <p className={styles.entryRole}>{entry.role}</p>
                  <p className={styles.entryOrg}>{entry.organisation}</p>
                  <p className={styles.entryPeriod}>{entry.period}</p>
                  {entry.summary ? <p className={styles.entrySummary}>{entry.summary}</p> : null}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={`mono-label ${styles.subheading}`}>{t('educationLabel')}</h3>
            <p className={styles.entryRole}>{education.degree}</p>
            <p className={styles.entryOrg}>{education.institution}</p>
            <p className={styles.entryPeriod}>{education.location}</p>
            <p className={styles.entrySummary}>{education.major}</p>

            <h4 className={`mono-label ${styles.miniLabel}`}>{t('courseworkLabel')}</h4>
            <ul className={styles.tags}>
              {education.coursework.map((course) => (
                <li key={course} className={styles.tag}>
                  {course}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.block}>
            <h3 className={`mono-label ${styles.subheading}`}>{t('leadershipLabel')}</h3>
            <ul className={styles.plainList}>
              {leadership.map((entry) => (
                <li key={`${entry.organisation}-${entry.role}`} className={styles.entry}>
                  <p className={styles.entryRole}>{entry.role}</p>
                  <p className={styles.entryOrg}>{entry.organisation}</p>
                  <p className={styles.entrySummary}>{entry.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
