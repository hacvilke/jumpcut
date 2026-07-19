'use client';

import Link from 'next/link';
import { useAuth, useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

interface NavProps {
  activePage?: string;
}

export default function Nav({ activePage }: NavProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  return (
    <header className="nav" id="nav">
      <div className="nav-inner">
        <Link className="nav-logo" href="/" aria-label="Jumpcut">
          <img src="/assets/J_period_transparent.png" alt="" className="nav-logo-mark" />
          <span>jumpcut</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <Link href="/" className={`nav-link${activePage === 'home' ? ' active' : ''}`}>home</Link>
          <Link href="/creators" className={`nav-link${activePage === 'creators' ? ' active' : ''}`}>creators</Link>
          <Link href="/templates" className={`nav-link${activePage === 'templates' ? ' active' : ''}`}>templates</Link>
          <Link href="/community" className={`nav-link${activePage === 'community' ? ' active' : ''}`}>community</Link>
          {isLoaded && isSignedIn && (
            <Link href="/dashboard" className={`nav-link${activePage === 'dashboard' ? ' active' : ''}`}>dashboard</Link>
          )}
        </nav>

        <div className="nav-actions">
          {isLoaded && isSignedIn ? (
            <>
              <Link href="/dashboard" className="btn-ghost">dashboard</Link>
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <button className="btn-ghost">sign in</button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="btn-cta">get started</button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}