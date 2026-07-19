/* global Lenis */

(function () {
  'use strict';

  // ── 0. Scroll progress bar ──────────────────────────────────────────────
  const scrollBar = Object.assign(document.createElement('div'), { className: 'scroll-bar' });
  document.body.prepend(scrollBar);

  // ── 1. Lenis smooth scroll ──────────────────────────────────────────────
  const lenis = new Lenis({
    duration: 1.3,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    touchMultiplier: 1.8,
    infinite: false,
  });

  // Expose lenis globally for debugging
  window.lenisInstance = lenis;

  // Ticker
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // ── 2. Scroll progress ──────────────────────────────────────────────────
  let scrollProgress = 0;
  let scrollVelocity = 0;

  lenis.on('scroll', ({ scroll, limit, velocity }) => {
    scrollProgress = scroll / limit;
    scrollVelocity = velocity;

    // Scroll progress bar
    scrollBar.style.transform = `scaleX(${scrollProgress})`;

    // CSS custom properties for scroll-linked animations
    document.documentElement.style.setProperty('--scroll-p', scrollProgress.toFixed(4));
    document.documentElement.style.setProperty('--scroll-v', Math.abs(velocity).toFixed(4));
  });

  // ── 3. Nav hide/show on scroll ──────────────────────────────────────────
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let navVisible = true;

  lenis.on('scroll', ({ scroll }) => {
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

  lenis.on('scroll', ({ scroll }) => {
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

  // Set initial state for animated elements
  animEls.forEach((el, i) => {
    el.style.opacity = '0';
    if (el.classList.contains('creator-card')) {
      el.style.transition = `opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${(i % 5) * 0.06}s`;
    } else {
      el.style.transform = 'translateY(28px)';
      el.style.transition = `opacity 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${(i % 5) * 0.06}s, transform 0.7s cubic-bezier(0.25, 1, 0.5, 1) ${(i % 5) * 0.06}s`;
    }
  });

  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        target.style.opacity = '1';
        if (!target.classList.contains('creator-card')) {
          target.style.transform = 'translateY(0)';
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

    const resetCreatorHover = () => {
      cancelAnimationFrame(hoverFrame);
      card.classList.remove('is-hovered');
      card.style.setProperty('--hover-x', '50%');
      card.style.setProperty('--hover-y', '42%');
      card.style.transform = '';
    };

    card.addEventListener('pointerenter', () => {
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s, box-shadow 0.35s, background 0.35s, filter 0.35s';
      card.classList.add('is-hovered');
    });

    card.addEventListener('pointermove', (event) => {
      if (reduceMotion) return;

      cancelAnimationFrame(hoverFrame);
      hoverFrame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 8;
        const rotateY = (x - 0.5) * 10;

        card.style.setProperty('--hover-x', `${Math.max(0, Math.min(100, x * 100)).toFixed(1)}%`);
        card.style.setProperty('--hover-y', `${Math.max(0, Math.min(100, y * 100)).toFixed(1)}%`);
        card.style.transform = `perspective(900px) translateY(-10px) scale(1.025) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      });
    });

    card.addEventListener('pointerleave', resetCreatorHover);
    card.addEventListener('blur', resetCreatorHover, true);
  });

  // ── 7. Template filter tabs ──────────────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const templateCards = document.querySelectorAll('.template-card:not(.template-card-more)');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      templateCards.forEach((card) => {
        const appEl = card.querySelector('.template-app');
        const freeEl = card.querySelector('.template-badge.free');

        let show = true;
        if (filter !== 'all') {
          if (filter === 'free') {
            show = !!freeEl;
          } else {
            show = appEl ? appEl.classList.contains(filter) || appEl.classList.contains('all') : false;
          }
        }

        card.style.transition = 'opacity 0.3s, transform 0.3s';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0.15';
          card.style.transform = 'scale(0.97)';
          card.style.pointerEvents = 'none';
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
      const following = btn.dataset.following === 'true';
      btn.dataset.following = String(!following);
      btn.textContent = following ? 'follow' : 'following ✓';
      btn.style.background = following ? '' : 'var(--c-text)';
      btn.style.color = following ? '' : 'var(--c-bg)';
    });
  });

  // ── 9. Active nav link on scroll ─────────────────────────────────────────
  const sections = document.querySelectorAll('section[id], .join-section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          const activeLink = document.querySelector(
            `.nav-link[href="#${target.id}"], .nav-link[href="${target.id}.html"], .nav-link[href="index.html#${target.id}"]`
          );
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach((s) => sectionObs.observe(s));

  // ── 10. Join form ─────────────────────────────────────────────────────────
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = joinForm.querySelector('.join-input');
      const email = input.value.trim();
      if (!email) return;

      const btn = joinForm.querySelector('button');
      btn.textContent = 'application received ✓';
      btn.style.background = '#30d158';
      btn.disabled = true;
      input.value = '';
      input.placeholder = 'we will review your profile';
    });
  }

  // ── 11. Simulated live community feed ─────────────────────────────────────
  const feedPosts = [
    {
      initials: 'EA', gradient: 'linear-gradient(135deg,#ff3b30,#ff6b35)',
      user: '@st6ozzie',
      text: 'just shipped the retention masterclass — 47min of pacing theory. free for community members.',
      time: 'just now',
    },
    {
      initials: 'TW', gradient: 'linear-gradient(135deg,#ff375f,#ff2d55)',
      user: '@tomokawata',
      text: 'anyone know a good mic for podcast editing? i\'m getting terrible room noise on the boom. 🎤',
      time: '1 min ago',
    },
    {
      initials: 'MR', gradient: 'linear-gradient(135deg,#5e5ce6,#9b59b6)',
      user: '@mayarosario',
      text: 'vellichor v2 lut pack drops tomorrow — adding 4 extra tungsten looks 🔥',
      time: '3 min ago',
    },
    {
      initials: 'LK', gradient: 'linear-gradient(135deg,#30d158,#34aadc)',
      user: '@leokang',
      text: 'outdoor ambience SFX pack is live and FREE. 40 files, no watermark. link in bio.',
      time: '6 min ago',
    },
    {
      initials: 'PS', gradient: 'linear-gradient(135deg,#ffd60a,#ff9f0a)',
      user: '@priyasharma',
      text: 'kinetic type speed-run tonight at 9PM EST — building a full title sequence live on stream ✨',
      time: '12 min ago',
    },
  ];

  let feedIndex = 0;
  const feedContainer = document.getElementById('community-feed-posts');

  function addFeedPost() {
    if (!feedContainer) return;

    const post = feedPosts[feedIndex % feedPosts.length];
    feedIndex++;

    const div = document.createElement('div');
    div.className = 'feed-post';
    div.style.opacity = '0';
    div.style.transform = 'translateY(-10px)';
    div.innerHTML = `
      <span class="feed-avatar" style="background: ${post.gradient}">${post.initials}</span>
      <div class="feed-post-body">
        <span class="feed-post-user">${post.user}</span>
        <p>${post.text}</p>
        <span class="feed-post-time mono">${post.time}</span>
      </div>
    `;

    feedContainer.prepend(div);

    // Animate in
    requestAnimationFrame(() => {
      div.style.transition = 'opacity 0.5s, transform 0.5s';
      div.style.opacity = '1';
      div.style.transform = 'translateY(0)';
    });

    // Cap feed at 5 posts visible
    const posts = feedContainer.querySelectorAll('.feed-post');
    if (posts.length > 5) {
      const last = posts[posts.length - 1];
      last.style.transition = 'opacity 0.4s';
      last.style.opacity = '0';
      setTimeout(() => last.remove(), 400);
    }

    // Update times
    feedContainer.querySelectorAll('.feed-post-time').forEach((t, i) => {
      if (i === 0) t.textContent = 'just now';
    });
  }

  // Rotate feed every 6 seconds when the feed exists on the current page.
  if (feedContainer) setInterval(addFeedPost, 6000);

  // ── 12. Velocity-based body skew (subtle) ─────────────────────────────────
  const bodyEl = document.body;
  let currentSkew = 0;

  lenis.on('scroll', ({ velocity }) => {
    const targetSkew = Math.max(-1.5, Math.min(1.5, velocity * -0.015));
    currentSkew += (targetSkew - currentSkew) * 0.06;

    if (Math.abs(currentSkew) > 0.001) {
      bodyEl.style.transform = `skewY(${currentSkew.toFixed(3)}deg)`;
    } else {
      bodyEl.style.transform = '';
    }
  });

})();
