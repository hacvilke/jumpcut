'use client';

import Script from 'next/script';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import HomeAnimations from '@/components/HomeAnimations';

export default function HomePage() {
  return (
    <>
      <Script
        src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"
        strategy="afterInteractive"
      />
      <Nav activePage="home" />

      <main>
        {/* ===== HERO ===== */}
        <section className="hero" id="top">
          <div className="hero-display" aria-hidden="true">
            <div className="hero-display-row row-1">
              <span className="display-fill">JUMP</span><span className="display-stroke">CUT</span>
            </div>
            <div className="hero-display-row row-2">
              <span className="display-stroke">VIDEO</span><span className="display-fill">EDIT</span>
            </div>
          </div>

          <div className="hero-content">
            <div className="hero-text-col">
              <p className="hero-label">community &times; agency &times; marketplace</p>
              <h1 className="hero-headline">
                where editors,<br />
                creators, and<br />
                templates live.
              </h1>
              <p className="hero-sub">
                Browse community-made edit templates, follow top creators, get your videos professionally edited — all in one place.
              </p>
              <div className="hero-btns">
                <Link href="/creators" className="btn-primary">explore creators</Link>
                <Link href="/templates" className="btn-outline">browse templates</Link>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat">
                <span className="stat-n">2,400+</span>
                <span className="stat-l">community members</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-n">580</span>
                <span className="stat-l">free templates</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat">
                <span className="stat-n">98%</span>
                <span className="stat-l">satisfaction rate</span>
              </div>
            </div>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <span className="scroll-hint-text">scroll</span>
            <div className="scroll-hint-line"></div>
          </div>
        </section>

        {/* ===== TICKER TAPE ===== */}
        <div className="ticker-wrap" aria-hidden="true">
          <div className="ticker-track">
            <div className="ticker-inner">
              <span>retention editing</span><span className="sep">&times;</span>
              <span>color science</span><span className="sep">&times;</span>
              <span>creator templates</span><span className="sep">&times;</span>
              <span>sound design</span><span className="sep">&times;</span>
              <span>motion graphics</span><span className="sep">&times;</span>
              <span>community</span><span className="sep">&times;</span>
              <span>short-form cuts</span><span className="sep">&times;</span>
              <span>cinematic grading</span><span className="sep">&times;</span>
            </div>
            <div className="ticker-inner" aria-hidden="true">
              <span>retention editing</span><span className="sep">&times;</span>
              <span>color science</span><span className="sep">&times;</span>
              <span>creator templates</span><span className="sep">&times;</span>
              <span>sound design</span><span className="sep">&times;</span>
              <span>motion graphics</span><span className="sep">&times;</span>
              <span>community</span><span className="sep">&times;</span>
              <span>short-form cuts</span><span className="sep">&times;</span>
              <span>cinematic grading</span><span className="sep">&times;</span>
            </div>
          </div>
        </div>

        {/* ===== FEATURED CREATORS ===== */}
        <section className="section creators-section" id="creators">
          <div className="section-header">
            <div>
              <p className="section-tag">featured creator</p>
              <h2 className="section-h2">editor &amp; creator<br />building here.</h2>
            </div>
            <Link href="/creators" className="view-all">more profiles soon</Link>
          </div>

          <div className="creators-grid" id="creators-grid">
            <article className="creator-card" data-handle="@st6ozzie">
              <div className="creator-card-inner">
                <div className="creator-card-top">
                  <div className="creator-avatar">
                    <img src="/assets/profile-pics/brandon.jpeg" alt="Kätz Wick profile photo" />
                  </div>
                </div>
                <div className="creator-template-pill" aria-label="43 templates">
                  <strong>43</strong>
                  <span>templates</span>
                </div>
                <div className="creator-meta">
                  <strong>Kätz Wick</strong>
                  <span className="handle">@st6ozzie</span>
                </div>
                <p className="creator-bio">Short-form editor focused on fast hooks and retention pacing.</p>
                <div className="creator-tags" aria-label="Creator apps">
                  <span>Premiere</span>
                  <span>CapCut</span>
                </div>
                <a href="https://www.tiktok.com/@st6ozzie?lang=en" className="creator-follow-btn" aria-label="Follow Kätz Wick on TikTok">follow</a>
              </div>
            </article>
          </div>
        </section>

        {/* ===== TEMPLATES GRID ===== */}
        <section className="section templates-section" id="templates">
          <div className="section-header">
            <div>
              <p className="section-tag">editor previews</p>
              <h2 className="section-h2">motion-driven<br />video previews.</h2>
            </div>
            <div className="template-filters" role="group" aria-label="Filter templates">
              <button className="filter-btn active" data-filter="all">all</button>
              <button className="filter-btn" data-filter="premiere">premiere</button>
              <button className="filter-btn" data-filter="davinci">davinci</button>
              <button className="filter-btn" data-filter="aftereffects">after effects</button>
              <button className="filter-btn" data-filter="capcut">capcut</button>
              <button className="filter-btn" data-filter="free">free only</button>
            </div>
          </div>

          <div className="templates-grid" id="templates-grid">
            <article className="template-card">
              <div className="motion-preview motion-preview-vlog">
                <div className="preview-frame">
                  <span className="preview-panel panel-left"></span>
                  <span className="preview-panel panel-right"></span>
                  <span className="preview-subject"></span>
                  <span className="preview-title">HOOK</span>
                  <span className="preview-caption">retention cut</span>
                </div>
                <div className="preview-scrub"><span></span></div>
                <span className="template-badge free">free</span>
              </div>
              <div className="template-info">
                <h3 className="template-name">Retention Hook Cut</h3>
                <span className="template-creator">by @st6ozzie</span>
                <div className="template-meta">
                  <span className="template-app premiere">Premiere Pro</span>
                  <span className="template-dl">0:18 loop</span>
                </div>
              </div>
            </article>

            <article className="template-card">
              <div className="motion-preview motion-preview-grade">
                <div className="preview-frame">
                  <span className="preview-grade before">before</span>
                  <span className="preview-grade after">after</span>
                  <span className="preview-wipe"></span>
                  <span className="preview-caption">grade pass</span>
                </div>
                <div className="preview-scrub"><span></span></div>
                <span className="template-badge paid">$12</span>
              </div>
              <div className="template-info">
                <h3 className="template-name">Cinematic Grade Loop</h3>
                <span className="template-creator">by @mayarosario</span>
                <div className="template-meta">
                  <span className="template-app davinci">DaVinci</span>
                  <span className="template-dl">0:12 loop</span>
                </div>
              </div>
            </article>

            <article className="template-card">
              <div className="motion-preview motion-preview-sound">
                <div className="preview-frame">
                  <span className="wave wave-a"></span>
                  <span className="wave wave-b"></span>
                  <span className="wave wave-c"></span>
                  <span className="preview-caption">sound sync</span>
                </div>
                <div className="preview-scrub"><span></span></div>
                <span className="template-badge free">free</span>
              </div>
              <div className="template-info">
                <h3 className="template-name">SFX Transition Stack</h3>
                <span className="template-creator">by @leokang</span>
                <div className="template-meta">
                  <span className="template-app all">All Apps</span>
                  <span className="template-dl">0:09 loop</span>
                </div>
              </div>
            </article>

            <article className="template-card">
              <div className="motion-preview motion-preview-title">
                <div className="preview-frame">
                  <span className="title-word title-word-a">CUT</span>
                  <span className="title-word title-word-b">FAST</span>
                  <span className="title-track"></span>
                  <span className="preview-caption">kinetic type</span>
                </div>
                <div className="preview-scrub"><span></span></div>
                <span className="template-badge paid">$24</span>
              </div>
              <div className="template-info">
                <h3 className="template-name">Kinetic Title Sequence</h3>
                <span className="template-creator">by @priyasharma</span>
                <div className="template-meta">
                  <span className="template-app aftereffects">After Effects</span>
                  <span className="template-dl">0:15 loop</span>
                </div>
              </div>
            </article>

            <article className="template-card">
              <div className="motion-preview motion-preview-shorts">
                <div className="preview-frame vertical-frame">
                  <span className="phone-feed feed-one"></span>
                  <span className="phone-feed feed-two"></span>
                  <span className="phone-feed feed-three"></span>
                  <span className="preview-caption">vertical edit</span>
                </div>
                <div className="preview-scrub"><span></span></div>
                <span className="template-badge free">free</span>
              </div>
              <div className="template-info">
                <h3 className="template-name">Vertical Shorts Cut</h3>
                <span className="template-creator">by @st6ozzie</span>
                <div className="template-meta">
                  <span className="template-app capcut">CapCut</span>
                  <span className="template-dl">0:11 loop</span>
                </div>
              </div>
            </article>

            <article className="template-card template-card-more">
              <div className="more-cta">
                <span className="more-num">580</span>
                <span className="more-label">motion previews<br />&amp; counting</span>
                <Link href="/templates" className="btn-outline-sm">browse all &rarr;</Link>
              </div>
            </article>
          </div>
        </section>

        {/* ===== SERVICES ===== */}
        <section className="section services-section" id="services">
          <div className="services-label-row">
            <p className="section-tag">what we do</p>
          </div>
          <div className="services-list">
            <div className="service-row" data-index="01">
              <span className="service-num">01</span>
              <h3 className="service-name">retention pacing</h3>
              <p className="service-desc">Jumpcuts, speed ramps, hook engineering, dead air removal — engineered for watch-time.</p>
              <span className="service-arrow">&rarr;</span>
            </div>
            <div className="service-row" data-index="02">
              <span className="service-num">02</span>
              <h3 className="service-name">cinematic grading</h3>
              <p className="service-desc">Custom LUTs, exposure balancing, and multi-cam color matching built frame by frame.</p>
              <span className="service-arrow">&rarr;</span>
            </div>
            <div className="service-row" data-index="03">
              <span className="service-num">03</span>
              <h3 className="service-name">spatial sound design</h3>
              <p className="service-desc">Denoise, frequency sculpting, SFX layering — full audio environments from scratch.</p>
              <span className="service-arrow">&rarr;</span>
            </div>
            <div className="service-row" data-index="04">
              <span className="service-num">04</span>
              <h3 className="service-name">motion graphics</h3>
              <p className="service-desc">Kinetic type, animated lower thirds, tracking graphics, and brand VFX composites.</p>
              <span className="service-arrow">&rarr;</span>
            </div>
            <div className="service-row" data-index="05">
              <span className="service-num">05</span>
              <h3 className="service-name">short-form strategy</h3>
              <p className="service-desc">Platform-optimised cuts for Shorts, Reels, TikTok — vertical and square formats.</p>
              <span className="service-arrow">&rarr;</span>
            </div>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="section faq-section" id="faq-section">
          <div className="section-header">
            <div>
              <p className="section-tag">faq</p>
              <h2 className="section-h2">common questions.</h2>
            </div>
          </div>

          <div className="faq-list">
            <details className="faq-item">
              <summary>Is the community free to join?</summary>
              <p>Yes, completely free. Create a profile, browse templates, post your work, and engage with other editors — no credit card needed. Paid plans are only for professional editing commissions.</p>
            </details>
            <details className="faq-item">
              <summary>Can I sell my own templates on Jumpcut?</summary>
              <p>Yes. Apply to become a verified creator, upload your Premiere Pro, DaVinci Resolve, After Effects, or CapCut templates, set your price (or make them free), and earn from every download. We take a 15% platform fee.</p>
            </details>
            <details className="faq-item">
              <summary>What editing software do you use for commissions?</summary>
              <p>Primarily Premiere Pro, DaVinci Resolve Studio, and After Effects. For sound we use Adobe Audition and Pro Tools. We can deliver full source project files on Creator and Brand Premium plans.</p>
            </details>
            <details className="faq-item">
              <summary>How fast is the turnaround?</summary>
              <p>One-off cuts: 3–5 business days. Creator Plan: 3–4 days per video. Brand Premium: 48-hour priority queue for all drafts.</p>
            </details>
            <details className="faq-item">
              <summary>How does the revision process work?</summary>
              <p>We use Frame.io for timestamped feedback directly on the video draft. Comments come through instantly and editors action them within one business day. Creator and Brand plans include unlimited revisions.</p>
            </details>
          </div>
        </section>

        {/* ===== JOIN SECTION ===== */}
        <section className="join-section" id="join">
          <div className="join-inner">
            <div className="join-display" aria-hidden="true">
              <span className="join-big-text">JOIN</span>
            </div>
            <div className="join-content">
              <p className="section-tag">featured creator</p>
              <h2>become a<br /><em>featured creator.</em></h2>
              <p className="join-sub">Apply for a profile slot on Jumpcut. Featured creators can showcase their editing style, packs, templates, and creator links inside the community.</p>
              <form className="join-form" id="join-form">
                <input type="email" placeholder="your creator email" className="join-input" required aria-label="Creator email address" />
                <button type="submit" className="btn-primary">apply to be featured &rarr;</button>
              </form>
              <p className="join-note mono">Creator applications are reviewed manually. No spam.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <HomeAnimations />
    </>
  );
}