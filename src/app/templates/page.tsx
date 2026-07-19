'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

export default function TemplatesPage() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const emptyRef = useRef<HTMLDivElement>(null);
  const selectedCreatorRef = useRef<HTMLSpanElement>(null);

  const handleCreatorClick = (name: string) => {
    const creators = document.querySelectorAll('.featured-creator');
    const categories = document.querySelectorAll('.pack-category');

    creators.forEach((item) => item.classList.remove('is-selected'));
    categories.forEach((item) => item.classList.remove('active'));
    const clickedCreator = document.querySelector(`[data-creator-name="${name}"]`);
    if (clickedCreator) clickedCreator.classList.add('is-selected');

    if (headingRef.current) headingRef.current.textContent = name;
    if (selectedCreatorRef.current) selectedCreatorRef.current.textContent = name;
    if (gridRef.current) gridRef.current.hidden = true;
    if (emptyRef.current) emptyRef.current.hidden = false;
  };

  const handleCategoryClick = () => {
    const creators = document.querySelectorAll('.featured-creator');
    const categories = document.querySelectorAll('.pack-category');

    creators.forEach((item) => item.classList.remove('is-selected'));
    categories.forEach((item) => item.classList.remove('active'));

    if (headingRef.current) headingRef.current.textContent = 'Jump cut Packs';
    if (gridRef.current) gridRef.current.hidden = false;
    if (emptyRef.current) emptyRef.current.hidden = true;
  };

  return (
    <div className="packs-page">
      <main className="packs-shell">
        <header className="packs-topbar" aria-label="Jumpcut packs header">
          <Link className="packs-brand" href="/#top" aria-label="Jumpcut home">Jumpcut</Link>
        </header>

        <div className="packs-workspace">
          <aside className="packs-sidebar" aria-label="Pack categories">
            <label className="pack-search">
              <span className="sr-only">Search Jumpcut packs</span>
              <input type="search" placeholder="Search" />
            </label>

            <section className="featured-creators" aria-labelledby="featured-creators-heading">
              <h2 id="featured-creators-heading">
                <span className="featured-star" aria-hidden="true"></span>
                Featured creators
              </h2>
              <div className="featured-creator-list">
                <button
                  className="featured-creator"
                  type="button"
                  data-creator-name="Katz Wick"
                  onClick={() => handleCreatorClick('Katz Wick')}
                >
                  <span className="featured-creator-mark">
                    <img src="/assets/profile-pics/brandon.jpeg" alt="" />
                  </span>
                  <span>
                    <strong>Katz Wick</strong>
                    <small>@st6ozzie</small>
                  </span>
                </button>
                <button
                  className="featured-creator"
                  type="button"
                  data-creator-name="Jumpcut Studio"
                  onClick={() => handleCreatorClick('Jumpcut Studio')}
                >
                  <span className="featured-creator-mark">
                    <img src="/assets/J_period_transparent.png" alt="" />
                  </span>
                  <span>
                    <strong>Jumpcut Studio</strong>
                    <small>staff picks</small>
                  </span>
                </button>
              </div>
            </section>

            <nav className="pack-categories" aria-label="Template pack categories">
              <button className="pack-category active" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-all" aria-hidden="true"></span>
                All packs
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-community" aria-hidden="true"></span>
                Community drops
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-new" aria-hidden="true"></span>
                New releases
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-device" aria-hidden="true"></span>
                Editing pads
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-title" aria-hidden="true"></span>
                Title packs
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-transition" aria-hidden="true"></span>
                Transitions
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-audio" aria-hidden="true"></span>
                Sound design
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-color" aria-hidden="true"></span>
                Color grades
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-shorts" aria-hidden="true"></span>
                Shorts systems
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-longform" aria-hidden="true"></span>
                Long-form kits
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-ads" aria-hidden="true"></span>
                Ad edits
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-brand" aria-hidden="true"></span>
                Brand motion
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-web" aria-hidden="true"></span>
                Website loops
              </button>
              <button className="pack-category" type="button" onClick={handleCategoryClick}>
                <span className="pack-category-icon icon-ui" aria-hidden="true"></span>
                UI overlays
              </button>
            </nav>
          </aside>

          <section className="packs-main" aria-labelledby="packs-heading">
            <h1 id="packs-heading" ref={headingRef}>Jump cut Packs</h1>

            <div className="pack-grid" ref={gridRef}>
              <article className="pack-card">
                <div className="motion-preview motion-preview-vlog">
                  <div className="preview-frame">
                    <span className="preview-panel panel-left"></span>
                    <span className="preview-panel panel-right"></span>
                    <span className="preview-subject"></span>
                    <span className="preview-title">HOOK</span>
                    <span className="preview-caption">retention cut</span>
                  </div>
                  <div className="preview-scrub"><span></span></div>
                  <span className="template-badge free">new</span>
                </div>
                <h2>Retention Hook Pack</h2>
              </article>

              <article className="pack-card">
                <div className="motion-preview motion-preview-title">
                  <div className="preview-frame">
                    <span className="title-word title-word-a">CUT</span>
                    <span className="title-word title-word-b">FAST</span>
                    <span className="title-track"></span>
                    <span className="preview-caption">kinetic type</span>
                  </div>
                  <div className="preview-scrub"><span></span></div>
                  <span className="template-badge free">new</span>
                </div>
                <h2>Kinetic Title Kit</h2>
              </article>

              <article className="pack-card">
                <div className="motion-preview motion-preview-sound">
                  <div className="preview-frame">
                    <span className="wave wave-a"></span>
                    <span className="wave wave-b"></span>
                    <span className="wave wave-c"></span>
                    <span className="preview-caption">sound sync</span>
                  </div>
                  <div className="preview-scrub"><span></span></div>
                  <span className="template-badge free">new</span>
                </div>
                <h2>SFX Transition Stack</h2>
              </article>

              <article className="pack-card">
                <div className="motion-preview motion-preview-grade">
                  <div className="preview-frame">
                    <span className="preview-grade before">before</span>
                    <span className="preview-grade after">after</span>
                    <span className="preview-wipe"></span>
                    <span className="preview-caption">grade pass</span>
                  </div>
                  <div className="preview-scrub"><span></span></div>
                  <span className="template-badge free">new</span>
                </div>
                <h2>Cinematic Grade Set</h2>
              </article>

              <article className="pack-card">
                <div className="motion-preview motion-preview-shorts">
                  <div className="preview-frame vertical-frame">
                    <span className="phone-feed feed-one"></span>
                    <span className="phone-feed feed-two"></span>
                    <span className="phone-feed feed-three"></span>
                    <span className="preview-caption">vertical edit</span>
                  </div>
                  <div className="preview-scrub"><span></span></div>
                  <span className="template-badge free">new</span>
                </div>
                <h2>Shorts Structure Pack</h2>
              </article>

              <article className="pack-card">
                <div className="pack-placeholder">
                  <span className="pack-placeholder-grid" aria-hidden="true"></span>
                  <span className="pack-placeholder-title">PACK</span>
                  <span className="template-badge free">soon</span>
                </div>
                <h2>Creator Ad Framework</h2>
              </article>
            </div>

            <div className="creator-listing-empty" ref={emptyRef} hidden>
              <span className="creator-listing-kicker">creator listing</span>
              <h2><span ref={selectedCreatorRef}>Creator</span></h2>
              <p>No packs listed yet.</p>
            </div>
          </section>
        </div>
        <Link className="packs-help" href="/#faq-section" id="faq" aria-label="Help">?</Link>
      </main>
    </div>
  );
}