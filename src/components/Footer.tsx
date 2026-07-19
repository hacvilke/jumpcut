import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <Link className="nav-logo" href="/#top">
            <img src="/assets/J_period_transparent.png" alt="" className="nav-logo-mark" />
            <span>jumpcut</span>
          </Link>
          <nav className="footer-nav" aria-label="Footer navigation">
            <Link href="/creators">creators</Link>
            <Link href="/templates">templates</Link>
            <Link href="/community">community</Link>
            <Link href="/#services">services</Link>
            <Link href="/#faq-section">faq</Link>
            <Link href="mailto:hello@jumpcut.agency">contact</Link>
          </nav>
          <div className="footer-social">
            <a href="#" aria-label="X (Twitter)">x.com</a>
            <a href="#" aria-label="YouTube">youtube</a>
            <a href="https://discord.gg/5Wd3m2ZQCM" aria-label="Discord">discord</a>
          </div>
        </div>
        <div className="footer-bottom">
          <small className="mono">&copy; 2026 Jumpcut. Post-production community &amp; agency.</small>
          <small className="mono">hello@jumpcut.agency</small>
        </div>
      </div>
    </footer>
  );
}