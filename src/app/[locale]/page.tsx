import { getTranslations, setRequestLocale } from 'next-intl/server';

import { Footer } from '@/components/layout/Footer';
import { StructuredData } from '@/components/layout/StructuredData';
import { About } from '@/components/about/About';
import { Contact } from '@/components/contact/Contact';
import { Hero } from '@/components/hero/Hero';
import { PortfolioSections } from '@/components/portfolio/PortfolioSections';
import { SiteEffects } from '@/components/motion/SiteEffects';
import type { Locale } from '@/i18n/routing';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations('nav');

  return (
    <>
      <StructuredData locale={locale} />
      <SiteEffects />
      <a href="#main" className="skip-link">
        {t('skipToContent')}
      </a>
      <main id="main">
        <Hero />
        <About />
        <PortfolioSections />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
