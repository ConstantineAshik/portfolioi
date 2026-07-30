import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { identity, siteUrl } from '@/config/portfolio';
import { type Locale, locales, routing } from '@/i18n/routing';
import { fontVariables } from '@/styles/fonts';

import '../globals.css';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
      locale: locale === 'bn' ? 'bn_BD' : 'en_US',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('portfolio-theme-v1')==='light'){document.documentElement.dataset.theme='light'}}catch(e){}",
          }}
        />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
