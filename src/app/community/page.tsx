'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function CommunityPage() {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (widgetRef.current && !widgetRef.current.querySelector('widgetbot')) {
      const el = document.createElement('widgetbot') as HTMLElement & {
        setAttribute: (name: string, value: string) => void;
      };
      el.setAttribute('server', '1508170955317448724');
      el.setAttribute('channel', '1508172868733767711');
      widgetRef.current.appendChild(el);
    }
  }, []);

  return (
    <div className="community-page">
      <Nav activePage="community" />

      <main>
        <section className="section community-section" id="community">
          <div className="community-split">
            <div className="community-left">
              <p className="section-tag">the community</p>
              <h1 className="section-h2">more than edits.<br />it&apos;s a network.</h1>
              <p className="community-body">
                Jumpcut is a living community of editors, colorists, sound designers, and motion artists. Share your work, get feedback, find collaborators, and grow your craft alongside 2,400+ fellow creators.
              </p>

              <ul className="community-features">
                <li>
                  <span className="feature-icon">{'\u2726'}</span>
                  <div>
                    <strong>Drop your work</strong>
                    <p>Post edits for community feedback, critique sessions, and feature slots in our weekly picks.</p>
                  </div>
                </li>
                <li>
                  <span className="feature-icon">{'\u2726'}</span>
                  <div>
                    <strong>Collab &amp; commission</strong>
                    <p>Find editors, colorists, and motion designers to collaborate with or commission directly.</p>
                  </div>
                </li>
                <li>
                  <span className="feature-icon">{'\u2726'}</span>
                  <div>
                    <strong>Share &amp; sell templates</strong>
                    <p>Upload your Premiere, DaVinci, or CapCut templates and earn from every download.</p>
                  </div>
                </li>
              </ul>

              <a href="https://discord.gg/5Wd3m2ZQCM" className="btn-primary">join the community &rarr;</a>
            </div>

            <div className="community-right">
              <div className="community-widget-card" ref={widgetRef} aria-label="Jumpcut Discord community" />
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <Script async src="https://cdn.jsdelivr.net/npm/@widgetbot/html-embed" />
    </div>
  );
}