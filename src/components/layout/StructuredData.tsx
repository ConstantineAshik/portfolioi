import { caseStudies, identity, siteUrl, socialLinks } from '@/config/portfolio';

import { JsonLd } from './JsonLd';

export function StructuredData({ locale }: { locale: string }) {
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: identity.fullName,
    jobTitle: identity.title,
    description: identity.shortIntro,
    email: `mailto:${identity.email}`,
    url: `${siteUrl}/${locale}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: identity.location,
    },
    sameAs: socialLinks
      .filter((link) => link.href.startsWith('http'))
      .map((link) => link.href),
    knowsLanguage: ['en'],
  };

  const works = caseStudies.map((project) => ({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.title,
    description: project.shortDescription,
    dateCreated: project.year,
    genre: project.category,
    creator: { '@type': 'Person', name: identity.fullName },
    keywords: project.stack.join(', '),
    url: project.externalUrl ?? `${siteUrl}/${locale}#work`,
  }));

  return <JsonLd data={JSON.stringify([person, ...works])} />;
}
