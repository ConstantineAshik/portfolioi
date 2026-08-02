import { defineRouting } from 'next-intl/routing';

export const locales = ['en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix so every locale has a stable, canonical URL for hreflang.
  localePrefix: 'always',
});
