'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let lenisCleanup: (() => void) | undefined;
    let cancelled = false;
    const cipherGlyphs = '01<>/{}[]#$%&*+=?';

    const decryptText = (
      element: HTMLElement,
      duration = 1.05,
      delay = 0,
    ) => {
      const original =
        element.dataset.decryptOriginal ?? element.textContent?.trim() ?? '';
      if (!original) return;

      element.dataset.decryptOriginal = original;
      element.dataset.decrypting = 'true';
      element.setAttribute('aria-label', original);

      const state = { progress: 0 };
      gsap.to(state, {
        progress: 1,
        duration,
        delay,
        ease: 'power2.out',
        overwrite: true,
        onUpdate: () => {
          const revealed = Math.floor(original.length * state.progress);
          element.textContent = Array.from(original, (character, index) => {
            if (character === ' ') return ' ';
            if (index < revealed) return character;
            return cipherGlyphs[Math.floor(Math.random() * cipherGlyphs.length)];
          }).join('');
        },
        onComplete: () => {
          element.textContent = original;
          delete element.dataset.decrypting;
        },
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--pointer-x', `${event.clientX}px`);
        root.style.setProperty('--pointer-y', `${event.clientY}px`);
      });
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onScrollProgress = () => {
      const available = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty(
        '--scroll-progress',
        String(available > 0 ? window.scrollY / available : 0),
      );
    };
    onScrollProgress();
    window.addEventListener('scroll', onScrollProgress, { passive: true });

    const mm = gsap.matchMedia();
    mm.add(
      {
        animate: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 800px)',
      },
      (context) => {
        if (!context.conditions?.animate) return;

        const sections = gsap.utils.toArray<HTMLElement>('.section');
        sections.forEach((section) => {
          const heading = section.querySelector<HTMLElement>('h2');
          if (heading) {
            ScrollTrigger.create({
              trigger: heading,
              start: 'top 88%',
              once: true,
              onEnter: () => {
                gsap.from(heading, {
                  autoAlpha: 0,
                  y: 22,
                  duration: 0.55,
                  ease: 'power3.out',
                });
                decryptText(heading);
              },
            });
          }

          const rule = section.querySelector<HTMLElement>('.rule');
          if (rule) {
            gsap.from(rule, {
              scaleX: 0,
              transformOrigin: 'left center',
              duration: 1.1,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: rule,
                start: 'top 92%',
                once: true,
              },
            });
          }
        });

        ScrollTrigger.batch(
          '.section article, .section [data-motion-item]',
          {
            start: 'top 90%',
            once: true,
            batchMax: 6,
            onEnter: (items) => {
              gsap.from(items, {
                autoAlpha: 0,
                y: 16,
                duration: 0.45,
                stagger: 0.055,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            },
          },
        );

        if (context.conditions?.desktop) {
          gsap.to('[data-photo-orbit]', {
            rotation: 360,
            duration: 30,
            ease: 'none',
            repeat: -1,
          });

          sections.forEach((section, index) => {
            gsap.to(section, {
              '--section-drift': `${index % 2 === 0 ? -18 : 18}px`,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
              },
            });
          });

          void import('lenis').then(({ default: Lenis }) => {
            if (cancelled) return;
            const lenis = new Lenis({
              duration: 1.05,
              smoothWheel: true,
              wheelMultiplier: 0.9,
            });
            const update = (time: number) => lenis.raf(time * 1000);
            gsap.ticker.add(update);
            gsap.ticker.lagSmoothing(0);
            lenisCleanup = () => {
              gsap.ticker.remove(update);
              lenis.destroy();
            };
          });
        }

        gsap.utils
          .toArray<HTMLElement>('[data-hero^="name-"]')
          .forEach((line, index) => decryptText(line, 1.15, .25 + index * .12));
      },
    );

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScrollProgress);
      lenisCleanup?.();
      mm.revert();
    };
  }, []);

  return null;
}
