'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Download } from 'lucide-react';
import { createPortal } from 'react-dom';

import { identity, navigationItems } from '@/config/portfolio';
import { SCROLL_EVENT } from '@/components/motion/SiteEffects';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useFocusTrap, useScrollLock } from '@/hooks/useFocusTrap';

import styles from './Header.module.css';
import menuStyles from './MobileMenu.module.css';
import { ThemeToggle } from './ThemeToggle';

const SECTION_IDS = navigationItems.map((item) => item.target);
const subscribeToDocument = () => () => {};

export function Header() {
  const t = useTranslations('nav');
  const activeSection = useActiveSection(SECTION_IDS);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setScrolled] = useState(false);
  const [isDocked, setDocked] = useState(false);
  const portalRoot = useSyncExternalStore(
    subscribeToDocument,
    () => document.body,
    () => null,
  );
  const menuRef = useRef<HTMLDivElement>(null);
  const anchorTop = useRef(0);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useFocusTrap(menuRef, isMenuOpen, closeMenu);
  useScrollLock(isMenuOpen);

  useEffect(() => {
    let wasScrolled = false;
    let wasDocked = false;

    function onScroll(event: Event) {
      const scrollY = (event as CustomEvent<{ scrollY: number }>).detail.scrollY;
      const nextScrolled = scrollY > 24;
      const nextDocked = scrollY > anchorTop.current - 12;
      if (nextScrolled !== wasScrolled) {
        wasScrolled = nextScrolled;
        setScrolled(nextScrolled);
      }
      if (nextDocked !== wasDocked) {
        wasDocked = nextDocked;
        setDocked(nextDocked);
      }
    }

    const anchor = document.querySelector<HTMLElement>('[data-nav-anchor]');
    anchorTop.current = anchor
      ? anchor.getBoundingClientRect().top + window.scrollY
      : 0;
    window.addEventListener(SCROLL_EVENT, onScroll);
    return () => window.removeEventListener(SCROLL_EVENT, onScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onResize = () => {
      if (window.innerWidth >= 1280) closeMenu();
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [isMenuOpen, closeMenu]);

  return (
    <>
      <header
        className={styles.header}
        data-scrolled={isScrolled}
        data-docked={isDocked}
      >
        <div className={styles.progressTrack} aria-hidden="true">
          <span data-scroll-progress />
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

      {portalRoot && isMenuOpen ? createPortal(<div
        id="mobile-menu"
        ref={menuRef}
        className={menuStyles.overlay}
        role="dialog"
        aria-modal="true"
        aria-label={t('menuLabel')}
        tabIndex={-1}
      >
        <div className={menuStyles.topBar}>
          <span className={menuStyles.menuCode} aria-hidden="true">
            MENU.SYS
          </span>
          <button
            type="button"
            className={menuStyles.closeButton}
            aria-label={t('closeMenu')}
            onClick={closeMenu}
          >
            <span>{t('closeMenu')}</span>
            <span className={menuStyles.closeIcon} aria-hidden="true">×</span>
          </button>
        </div>

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
      </div>, portalRoot) : null}
    </>
  );
}
