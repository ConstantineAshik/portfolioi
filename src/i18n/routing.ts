import { defineRouting } from 'next-intl/routing';

export const locales = ['en', 'bn'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

/** Human-readable names, shown in the locale switcher in their own language. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  bn: 'বাংলা',
};

/** Short codes used for the compact terminal-style switcher. */
export const localeCodes: Record<Locale, string> = {
  en: 'EN',
  bn: 'BN',
};

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Always prefix so every locale has a stable, canonical URL for hreflang.
  localePrefix: 'always',
});
