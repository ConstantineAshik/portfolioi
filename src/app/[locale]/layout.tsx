import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { identity, siteUrl } from '@/config/portfolio';
import { type Locale, locales, routing } from '@/i18n/routing';
import { fontVariables } from '@/styles/fonts';

import '../globals.css';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
    { media: '(prefers-color-scheme: light)', color: '#f2f2ec' },
  ],
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const languages = Object.fromEntries(
    locales.map((code) => [code, `/${code}`]),
  );

  return {
    metadataBase: new URL(siteUrl),
    title: t('title'),
    description: t('description'),
    applicationName: `${identity.fullName} — Portfolio`,
    authors: [{ name: identity.fullName }],
    creator: identity.fullName,
    alternates: {
      canonical: `/${locale}`,
      languages: { ...languages, 'x-default': `/${routing.defaultLocale}` },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `/${locale}`,
      title: t('title'),
      description: t('description'),
      siteName: identity.fullName,
      images: [
        {
          url: '/og.png',
          alt: t('ogAlt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['/og.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale.
  setRequestLocale(locale as Locale);

  return (
    <html
      lang={locale}
      className={fontVariables}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
