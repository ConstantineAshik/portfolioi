import { getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';

import {
  archiveCategories,
  archiveEntries,
  caseStudies,
  credentials,
} from '@/config/portfolio';

import styles from './PortfolioSections.module.css';

export async function PortfolioSections() {
  const research = await getTranslations('research');
  const work = await getTranslations('work');
  const archive = await getTranslations('archive');

  return (
    <>
      <section id="research" className={`section ${styles.section}`} aria-labelledby="research-heading">
        <div className="container">
          <SectionHeading index="02" label={research('label')} id="research-heading">
            {research('heading')}
          </SectionHeading>
          <p className={styles.intro}>{research('intro')}</p>

          <div className={styles.researchGrid}>
            {credentials.map((item, index) => (
              <article className={styles.researchItem} key={item.id}>
                <div className={styles.itemIndex}>{String(index + 1).padStart(2, '0')}</div>
                <div>
                  <div className={styles.metaRow}>
                    <span>{item.issuer}</span>
                    <span>{item.year}</span>
                    <span className={styles.status}>{item.status}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.description}>{item.description}</p>
                  <ul className={styles.tags} aria-label="Technologies">
                    {item.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  {item.href ? (
                    <a className={styles.textLink} href={item.href} target="_blank" rel="noreferrer">
                      {research('verify')} <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className={`section ${styles.section}`} aria-labelledby="work-heading">
        <div className="container">
          <SectionHeading index="03" label={work('label')} id="work-heading">
            {work('heading')}
          </SectionHeading>
          <p className={styles.intro}>{work('intro')}</p>

          <div className={styles.caseList}>
            {caseStudies.map((project, index) => (
              <article className={styles.caseStudy} key={project.slug}>
                <header className={styles.caseHeader}>
                  <span className={styles.caseNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <p className={styles.eyebrow}>{project.category} / {project.year}</p>
                    <h3 className={styles.caseTitle}>{project.title}</h3>
                    <p className={styles.caseSummary}>{project.shortDescription}</p>
                  </div>
                </header>
                <div className={styles.caseBody}>
                  <dl className={styles.facts}>
                    <div><dt>{work('clientLabel')}</dt><dd>{project.client}</dd></div>
                    <div><dt>{work('roleLabel')}</dt><dd>{project.role}</dd></div>
                  </dl>
                  <div>
                    <p className={styles.description}>{project.fullDescription}</p>
                    <ul className={styles.tags} aria-label={work('stackLabel')}>
                      {project.stack.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                    {project.externalUrl ? (
                      <a className={styles.textLink} href={project.externalUrl} target="_blank" rel="noreferrer">
                        {work('externalLink')} <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="archive" className={`section ${styles.section}`} aria-labelledby="archive-heading">
        <div className="container">
          <SectionHeading index="04" label={archive('label')} id="archive-heading">
            {archive('heading')}
          </SectionHeading>
          <p className={styles.intro}>{archive('intro')}</p>

          <div className={styles.archive}>
            {archiveCategories.map((category) => {
              const entries = archiveEntries.filter((entry) => entry.category === category.slug);
              return (
                <section className={styles.archiveGroup} key={category.slug} aria-labelledby={`${category.slug}-heading`}>
                  <header>
                    <p className={styles.eyebrow}>{archive('entriesCount', { count: entries.length })}</p>
                    <h3 id={`${category.slug}-heading`} className={styles.archiveTitle}>{category.title}</h3>
                    <p className={styles.description}>{category.description}</p>
                  </header>
                  <ol className={styles.archiveList}>
                    {entries.map((entry) => (
                      <li key={entry.id}>
                        <div className={styles.archiveEntry}>
                          <div>
                            <h4>{entry.title}</h4>
                            <p>{entry.story ?? `${entry.scope} project built in ${entry.year}.`}</p>
                          </div>
                          <div className={styles.archiveMeta}>
                            <span>{entry.language}</span>
                            <span>{entry.framework}</span>
                            <span>{entry.year}</span>
                            {entry.repoUrl ? (
                              <a href={entry.repoUrl} target="_blank" rel="noreferrer" aria-label={`${entry.title} repository`}>↗</a>
                            ) : null}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  children,
  id,
  index,
  label,
}: {
  children: ReactNode;
  id: string;
  index: string;
  label: string;
}) {
  return (
    <header className={styles.headingBlock}>
      <span className="mono-label">{index} / {label}</span>
      <h2 id={id} className={styles.heading}>{children}</h2>
    </header>
  );
}
