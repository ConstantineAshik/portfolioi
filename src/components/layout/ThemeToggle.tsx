'use client';

import { useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme-v1';
const THEME_EVENT = 'portfolio-theme-change';

function subscribe(onStoreChange: () => void) {
  window.addEventListener(THEME_EVENT, onStoreChange);
  window.addEventListener('storage', onStoreChange);
  return () => {
    window.removeEventListener(THEME_EVENT, onStoreChange);
    window.removeEventListener('storage', onStoreChange);
  };
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

export function ThemeToggle() {
  const t = useTranslations('theme');
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'dark');

  function toggleTheme() {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }

  const nextLabel = theme === 'dark' ? t('switchToLight') : t('switchToDark');

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={nextLabel}
      title={nextLabel}
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{theme === 'dark' ? 'LGT' : 'DRK'}</span>
    </button>
  );
}
