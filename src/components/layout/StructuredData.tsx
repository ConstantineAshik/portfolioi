import { caseStudies, identity, siteUrl, socialLinks } from '@/config/portfolio';

/**
 * Person + CreativeWork JSON-LD.
 *
 * Emitted server-side so crawlers see it without executing scripts. The values
 * come from the same config object the visible page renders, so the structured
 * data cannot drift from the content.
 */
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
    knowsLanguage: ['bn', 'en'],
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
    image: {
      '@type': 'ImageObject',
      url: `${siteUrl}${project.cover.src}`,
      width: project.cover.width,
      height: project.cover.height,
      caption: project.cover.alt,
    },
  }));

  return (
    <script
      type="application/ld+json"
      // Static, developer-authored data from a typed config — no user input
      // reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify([person, ...works]) }}
    />
  );
}
