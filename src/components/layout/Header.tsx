'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

import { identity, navigationItems } from '@/config/portfolio';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useFocusTrap, useScrollLock } from '@/hooks/useFocusTrap';

import styles from './Header.module.css';
import { LocaleSwitcher } from './LocaleSwitcher';
import menuStyles from './MobileMenu.module.css';
import { ThemeToggle } from './ThemeToggle';

const SECTION_IDS = navigationItems.map((item) => item.target);

export function Header() {
  const t = useTranslations('nav');
  const activeSection = useActiveSection(SECTION_IDS);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [isDocked, setDocked] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const anchorTop = useRef(0);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useFocusTrap(menuRef, isMenuOpen, closeMenu);
  useScrollLock(isMenuOpen);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
      setDocked(window.scrollY > anchorTop.current - 12);
    }

    const anchor = document.querySelector<HTMLElement>('[data-nav-anchor]');
    anchorTop.current = anchor
      ? anchor.getBoundingClientRect().top + window.scrollY
      : 0;
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A viewport that grows past the mobile breakpoint should not leave an
  // invisible open menu holding focus captive.
  useEffect(() => {
    if (!isMenuOpen) return;
    const query = window.matchMedia('(min-width: 1280px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) closeMenu();
    };
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={isScrolled}
        data-docked={isDocked}
      >
        <div className={styles.progressTrack} aria-hidden="true">
          <span />
        </div>
        <div className={`container ${styles.inner}`}>
          <a href="#hero" className={styles.brand}>
            <span className={styles.brandPrompt} aria-hidden="true">
              ~$
            </span>
            <span className={styles.brandName}>{identity.fullName}</span>
            <span className={styles.caret} aria-hidden="true" />
          </a>

          <nav className={styles.desktopNav} aria-label={t('menuLabel')}>
            <span className={styles.navEyebrow} aria-hidden="true">
              NAV.SYS / {activeSection.toUpperCase()}
            </span>
            <ul className={styles.navList}>
              {navigationItems.map((item) => (
                <li key={item.target}>
                  <a
                    href={`#${item.target}`}
                    className={styles.navLink}
                    aria-current={activeSection === item.target ? 'true' : undefined}
                  >
                    <span className={styles.navIndex} aria-hidden="true">
                      {item.index}
                    </span>
                    <span className={styles.navLabel}>{t(item.labelKey)}</span>
                  </a>
                </li>
              ))}
              <li className={styles.externalItem}>
                <a
                  href="https://github.com/ConstantineAshik"
                  className={styles.navLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className={styles.navLabel}>{t('github')}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
              <li className={styles.externalItem}>
                <a
                  href={identity.resumeUrl}
                  className={`${styles.navLink} ${styles.resumeLink}`}
                  download
                >
                  <Download size={14} strokeWidth={1.8} aria-hidden="true" />
                  <span className={styles.navLabel}>{t('downloadResume')}</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />
            <LocaleSwitcher />
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {isMenuOpen ? t('closeMenu') : t('openMenu')}
            </button>
          </div>
        </div>
        <span className={styles.scanBeam} aria-hidden="true" />
      </header>

      {/* Rendered unconditionally with `hidden` so the links exist in the HTML
          for crawlers and for a no-JS reader using the anchors directly. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={menuStyles.overlay}
        hidden={!isMenuOpen}
        role="dialog"
        aria-modal="true"
        aria-label={t('menuLabel')}
        tabIndex={-1}
      >
        <nav className={menuStyles.nav} aria-label={t('menuLabel')}>
          <ul className={menuStyles.list}>
            {navigationItems.map((item) => (
              <li key={item.target} className={menuStyles.item}>
                <a
                  href={`#${item.target}`}
                  className={menuStyles.link}
                  aria-current={activeSection === item.target ? 'true' : undefined}
                  onClick={closeMenu}
                >
                  <span className={menuStyles.index} aria-hidden="true">
                    {item.index}
                  </span>
                  <span>{t(item.labelKey)}</span>
                </a>
              </li>
            ))}
            <li className={menuStyles.item}>
              <a
                href="https://github.com/ConstantineAshik"
                className={menuStyles.link}
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
              >
                <span className={menuStyles.index} aria-hidden="true">↗</span>
                <span>{t('github')}</span>
              </a>
            </li>
            <li className={menuStyles.item}>
              <a
                href={identity.resumeUrl}
                className={menuStyles.link}
                download
                onClick={closeMenu}
              >
                <Download size={20} strokeWidth={1.8} aria-hidden="true" />
                <span>{t('downloadResume')}</span>
              </a>
            </li>
          </ul>
        </nav>

        <p className={menuStyles.meta}>
          <span aria-hidden="true">{'>'} </span>
          {identity.location} — {identity.timezone}
        </p>
      </div>
    </>
  );
}
