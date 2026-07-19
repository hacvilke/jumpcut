import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export default function CreatorsPage() {
  return (
    <div className="creators-page">
      <Nav activePage="creators" />

      <main>
        <section className="section creators-section" id="creators">
          <div className="section-header">
            <div>
              <p className="section-tag">featured creator</p>
              <h1 className="section-h2">editor &amp; creator<br />building here.</h1>
            </div>
            <span className="view-all">more profiles soon</span>
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
      </main>

      <Footer />
    </div>
  );
}