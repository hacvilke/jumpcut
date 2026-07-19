'use client';

import { useEffect } from 'react';

export default function HomeAnimations() {
  useEffect(() => {
    // ── 0. Scroll progress bar ──────────────────────────────────────────────
    const scrollBar = Object.assign(document.createElement('div'), { className: 'scroll-bar' });
    document.body.prepend(scrollBar);

    // ── 1. Lenis smooth scroll ──────────────────────────────────────────────
    const lenis = (window as unknown as { Lenis: new (opts: Record<string, unknown>) => LenisInstance }).Lenis;
    if (!lenis) return;

    const lenisInstance = new lenis({
      duration: 1.3,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.8,
      infinite: false,
    });

    (window as unknown as Record<string, unknown>).lenisInstance = lenisInstance;

    function raf(time: number) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ── 2. Scroll progress ──────────────────────────────────────────────────
    let scrollVelocity = 0;

    lenisInstance.on('scroll', ({ scroll, limit, velocity }: { scroll: number; limit: number; velocity: number }) => {
      const scrollProgress = scroll / limit;
      scrollVelocity = velocity;

      scrollBar.style.transform = `scaleX(${scrollProgress})`;

      document.documentElement.style.setProperty('--scroll-p', scrollProgress.toFixed(4));
      document.documentElement.style.setProperty('--scroll-v', Math.abs(velocity).toFixed(4));
    });

    // ── 3. Nav hide/show on scroll ──────────────────────────────────────────
    const nav = document.getElementById('nav');
    let lastScrollY = 0;
    let navVisible = true;

    lenisInstance.on('scroll', ({ scroll }: { scroll: number }) => {
      if (!nav) return;
      const goingDown = scroll > lastScrollY;
      const scrolled = scroll > 80;

      if (goingDown && scrolled && navVisible) {
        nav.style.transform = 'translateY(-100%)';
        navVisible = false;
      } else if (!goingDown && !navVisible) {
        nav.style.transform = 'translateY(0)';
        navVisible = true;
      }
      lastScrollY = scroll;
    });

    // ── 4. Hero display parallax ─────────────────────────────────────────────
    const heroDisplay = document.querySelector('.hero-display');

    lenisInstance.on('scroll', ({ scroll }: { scroll: number }) => {
      if (!heroDisplay) return;
      const speed = 0.35;
      heroDisplay.style.transform = `translateY(${scroll * speed}px)`;
    });

    // ── 5. Scroll-triggered entrance animations ──────────────────────────────
    const animEls = document.querySelectorAll(
      '.creator-card, .template-card, .service-row, .price-card, .faq-item, .hero-headline, .hero-sub, .hero-btns, .hero-stats, .section-h2, .community-left > *, .community-feed'
    );

    const observerOpts = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -5% 0px',
    };

    animEls.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      if (el.classList.contains('creator-card')) {
        (el as HTMLElement).style.transition = `opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${(i % 5) * 0.06}s`;
      } else {
        (el as HTMLElement).style.transform = 'translateY(28px)';
        (el as HTMLElement).style.transition = `opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${(i % 5) * 0.06}s, transform 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${(i % 5) * 0.06}s`;
      }
    });

    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          (target as HTMLElement).style.opacity = '1';
          if (!target.classList.contains('creator-card')) {
            (target as HTMLElement).style.transform = 'translateY(0)';
          }
          revealObs.unobserve(target);
        }
      });
    }, observerOpts);

    animEls.forEach((el) => revealObs.observe(el));

    // ── 6. Creator card hover motion ────────────────────────────────────────
    const creatorCards = document.querySelectorAll('.creator-card');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    creatorCards.forEach((card) => {
      let hoverFrame = 0;
      const cardEl = card as HTMLElement;

      const resetCreatorHover = () => {
        cancelAnimationFrame(hoverFrame);
        cardEl.classList.remove('is-hovered');
        cardEl.style.setProperty('--hover-x', '50%');
        cardEl.style.setProperty('--hover-y', '42%');
        cardEl.style.transform = '';
      };

      cardEl.addEventListener('pointerenter', () => {
        cardEl.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s, box-shadow 0.35s, background 0.35s, filter 0.35s';
        cardEl.classList.add('is-hovered');
      });

      cardEl.addEventListener('pointermove', (event) => {
        if (reduceMotion) return;

        cancelAnimationFrame(hoverFrame);
        hoverFrame = requestAnimationFrame(() => {
          const rect = cardEl.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width;
          const y = (event.clientY - rect.top) / rect.height;
          const rotateX = (0.5 - y) * 8;
          const rotateY = (x - 0.5) * 10;

          cardEl.style.setProperty('--hover-x', `${Math.max(0, Math.min(100, x * 100)).toFixed(1)}%`);
          cardEl.style.setProperty('--hover-y', `${Math.max(0, Math.min(100, y * 100)).toFixed(1)}%`);
          cardEl.style.transform = `perspective(900px) translateY(-10px) scale(1.025) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
        });
      });

      cardEl.addEventListener('pointerleave', resetCreatorHover);
      cardEl.addEventListener('blur', resetCreatorHover, true);
    });

    // ── 7. Template filter tabs ──────────────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card:not(.template-card-more)');

    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = (btn as HTMLElement).dataset.filter;

        templateCards.forEach((card) => {
          const appEl = card.querySelector('.template-app');
          const freeEl = card.querySelector('.template-badge.free');

          let show = true;
          if (filter !== 'all') {
            if (filter === 'free') {
              show = !!freeEl;
            } else {
              show = appEl ? (appEl.classList.contains(filter) || appEl.classList.contains('all')) : false;
            }
          }

          (card as HTMLElement).style.transition = 'opacity 0.3s, transform 0.3s';
          if (show) {
            (card as HTMLElement).style.opacity = '1';
            (card as HTMLElement).style.transform = 'scale(1)';
            (card as HTMLElement).style.pointerEvents = '';
          } else {
            (card as HTMLElement).style.opacity = '0.15';
            (card as HTMLElement).style.transform = 'scale(0.97)';
            (card as HTMLElement).style.pointerEvents = 'none';
          }
        });
      });
    });

    // ── 8. Creator follow button toggle ─────────────────────────────────────
    document.querySelectorAll('.creator-follow-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const href = btn.getAttribute('href') || '';
        if (href && href !== '#' && !href.startsWith('#')) return;

        e.preventDefault();
        const btnEl = btn as HTMLElement;
        const following = btnEl.dataset.following === 'true';
        btnEl.dataset.following = String(!following);
        btnEl.textContent = following ? 'follow' : 'following ✓';
        btnEl.style.background = following ? '' : 'var(--c-text)';
        btnEl.style.color = following ? '' : 'var(--c-bg)';
      });
    });

    // ── 9. Join form ─────────────────────────────────────────────────────────
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
      joinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = joinForm.querySelector('.join-input') as HTMLInputElement;
        const email = input.value.trim();
        if (!email) return;

        const btn = joinForm.querySelector('button');
        if (btn) {
          btn.textContent = 'application received ✓';
          (btn as HTMLElement).style.background = '#30d158';
          btn.disabled = true;
        }
        input.value = '';
        input.placeholder = 'we will review your profile';
      });
    }

    // ── 10. Velocity-based body skew (subtle) ─────────────────────────────────
    const bodyEl = document.body;
    let currentSkew = 0;

    lenisInstance.on('scroll', ({ velocity }: { velocity: number }) => {
      const targetSkew = Math.max(-1.5, Math.min(1.5, velocity * -0.015));
      currentSkew += (targetSkew - currentSkew) * 0.06;

      if (Math.abs(currentSkew) > 0.001) {
        bodyEl.style.transform = `skewY(${currentSkew.toFixed(3)}deg)`;
      } else {
        bodyEl.style.transform = '';
      }
    });

    return () => {
      // Cleanup
      cancelAnimationFrame(0);
      revealObs.disconnect();
      scrollBar.remove();
    };
  }, []);

  return null;
}

interface LenisInstance {
  raf: (time: number) => void;
  on: (event: string, callback: (data: { scroll: number; limit: number; velocity: number }) => void) => void;
}