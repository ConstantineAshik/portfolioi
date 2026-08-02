'use client';

import { useEffect } from 'react';

export const SCROLL_EVENT = 'portfolio-scroll';

export function SiteEffects() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.hydrated = 'true';
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight * 0.2;
    let pointerDirty = true;
    let scrollDirty = true;
    let frame = 0;
    let cancelled = false;
    let animationCleanup: (() => void) | undefined;

    const flush = () => {
      frame = 0;
      if (pointerDirty) {
        pointerDirty = false;
        root.style.setProperty('--pointer-x', `${pointerX}px`);
        root.style.setProperty('--pointer-y', `${pointerY}px`);
      }
      if (scrollDirty) {
        scrollDirty = false;
        const scrollY = window.scrollY;
        const available = root.scrollHeight - window.innerHeight;
        root.style.setProperty(
          '--scroll-progress',
          String(available > 0 ? scrollY / available : 0),
        );
        window.dispatchEvent(new CustomEvent(SCROLL_EVENT, { detail: { scrollY } }));
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(flush);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      pointerDirty = true;
      schedule();
    };
    const onScroll = () => {
      scrollDirty = true;
      schedule();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
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
                gsap.to('[data-photo-orbit]', {
                  rotation: 360,
                  duration: 30,
                  ease: 'none',
                  repeat: -1,
                });
                void import('lenis').then(({ default: Lenis }) => {
                  if (cancelled) return;
                  const lenis = new Lenis({
                    lerp: 0.1,
                    smoothWheel: true,
                    wheelMultiplier: 1,
                    anchors: true,
                  });
                  lenis.on('scroll', ScrollTrigger.update);
                  const update = (time: number) => lenis.raf(time * 1000);
                  gsap.ticker.add(update);
                  gsap.ticker.lagSmoothing(1000, 16);
                  lenisCleanup = () => {
                    gsap.ticker.remove(update);
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
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      animationCleanup?.();
      delete root.dataset.hydrated;
    };
  }, []);

  return null;
}
