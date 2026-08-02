'use client';

import { useEffect } from 'react';

export const SCROLL_EVENT = 'portfolio-scroll';

export function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
    root.dataset.hydrated = 'true';
    let scrollDirty = true;
    let frame = 0;
    let cancelled = false;
    let animationCleanup: (() => void) | undefined;

    const flush = () => {
      frame = 0;
      if (scrollDirty) {
        scrollDirty = false;
        const scrollY = window.scrollY;
        const available = root.scrollHeight - window.innerHeight;
        const progress = available > 0 ? scrollY / available : 0;
        if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
        window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { scrollY } }));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const onScroll = () => {
      scrollDirty = true;
      schedule();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    schedule();

    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      async ([gsapModule, scrollTriggerModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.default;
        const { ScrollTrigger } = scrollTriggerModule;
        gsap.registerPlugin(ScrollTrigger);

        let lenisCleanup: (() => void) | undefined;
        const cipherGlyphs = '01<>/{}[]#$%&*+=?';
        const decryptText = (element: HTMLElement, duration = 1.05, delay = 0) => {
          const original =
            element.dataset.decryptOriginal ?? element.textContent?.trim() ?? '';
          if (!original) return;

          const characters = [...original];
          const output = [...characters];
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
              const revealed = Math.floor(characters.length * state.progress);
              for (let index = revealed; index < characters.length; index += 1) {
                output[index] = characters[index] === ' '
                  ? ' '
                  : cipherGlyphs[Math.floor(Math.random() * cipherGlyphs.length)];
              }
              for (let index = 0; index < revealed; index += 1) {
                output[index] = characters[index];
              }
              element.textContent = output.join('');
            },
            onComplete: () => {
              element.textContent = original;
              delete element.dataset.decrypting;
            },
          });
        };

        const context = gsap.context(() => {
          const mm = gsap.matchMedia();
          mm.add(
            {
              animate: '(prefers-reduced-motion: no-preference)',
              desktop: '(min-width: 800px)',
            },
            (media) => {
              if (!media.conditions?.animate) return;
              const sections = gsap.utils.toArray<HTMLElement>('.section');

              for (const section of sections) {
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
              }

              ScrollTrigger.batch('.section article, .section [data-motion-item]', {
                start: 'top 90%',
                once: true,
                batchMax: 6,
                onEnter: (items) => gsap.from(items, {
                  autoAlpha: 0,
                  y: 16,
                  duration: 0.45,
                  stagger: 0.055,
                  ease: 'power2.out',
                  overwrite: 'auto',
                }),
              });

              if (media.conditions.desktop) {
                void import('lenis').then(({ default: Lenis }) => {
                  if (cancelled) return;
                  const lenis = new Lenis({
                    lerp: 0.1,
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    anchors: true,
                    autoRaf: true,
                  });
                  lenis.on('scroll', ScrollTrigger.update);
                  lenisCleanup = () => {
                    lenis.destroy();
                  };
                });
              }

              gsap.utils.toArray<HTMLElement>('[data-hero^="name-"]').forEach(
                (line, index) => decryptText(line, 1.15, 0.25 + index * 0.12),
              );
            },
          );
          return () => mm.revert();
        });

        animationCleanup = () => {
          lenisCleanup?.();
          context.revert();
        };
      },
    );

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      animationCleanup?.();
      delete root.dataset.hydrated;
    };
  }, []);

  return null;
}
