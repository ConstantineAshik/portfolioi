'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useTransition } from 'react';

import { usePathname, useRouter } from '@/i18n/navigation';
import { type Locale, localeCodes, localeNames, locales } from '@/i18n/routing';

import styles from './LocaleSwitcher.module.css';

export function LocaleSwitcher() {
  const t = useTranslations('nav');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  // `useLocale` reads from the i18n context rather than the route params, so it
  // does not opt the tree out of static rendering the way `useParams` can.
  const current = useLocale() as Locale;

  function switchTo(locale: Locale) {
    if (locale === current) return;

    // The single-page layout means the reader is almost always mid-section.
    // Carrying the hash across keeps them where they were after the swap.
    //
    // The hash is appended to the pathname string rather than passed as a
    // `hash` option: without a `pathnames` config, next-intl's router only
    // accepts `string | {pathname, query}`, so a `hash` key would be dropped.
    const hash = typeof window === 'undefined' ? '' : window.location.hash;

    startTransition(() => {
      router.replace(`${pathname}${hash}`, { locale });
    });
  }

  return (
    <div className={styles.group} role="group" aria-label={t('localeLabel')}>
      {locales.map((locale, index) => (
        <span key={locale} className={styles.item}>
          {index > 0 ? (
            <span className={styles.separator} aria-hidden="true">
              /
            </span>
          ) : null}
          <button
            type="button"
            className={styles.button}
            lang={locale}
            aria-current={locale === current ? 'true' : undefined}
            aria-label={`${t('localeSwitch')}: ${localeNames[locale]}`}
            disabled={isPending}
            onClick={() => switchTo(locale)}
          >
            {localeCodes[locale]}
          </button>
        </span>
      ))}
    </div>
  );
}
