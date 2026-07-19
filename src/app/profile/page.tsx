'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { Profile } from '@/lib/supabase';

export default function ProfilePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await fetch('/api/profile');
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFullName(data.full_name || '');
          setHandle(data.handle || '');
          setBio(data.bio || '');
        }
      } catch {
        // ignore
      }
    }

    loadProfile();
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName || null,
          handle: handle || null,
          bio: bio || null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setMessage('Profile saved.');
      } else {
        const err = await res.json();
        setMessage(err.error || 'Failed to save.');
      }
    } catch {
      setMessage('Network error.');
    }
    setSaving(false);
  };

  const handleRequestRole = async () => {
    try {
      const res = await fetch('/api/profile/role', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setMessage("Creator role requested. We'll review your application.");
      } else {
        const err = await res.json();
        setMessage(err.error || 'Failed to request role.');
      }
    } catch {
      setMessage('Network error.');
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div style={{ padding: '8rem 2rem', textAlign: 'center', minHeight: '100vh', background: 'var(--c-bg)' }}>
        <p className="section-tag">profile</p>
        <h1 className="section-h2">sign in to continue.</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--c-bg)' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: '7rem 2rem 4rem' }}>
        <p className="section-tag">profile</p>
        <h1 className="section-h2" style={{ marginBottom: '2rem' }}>your profile.</h1>

        <div style={{
          padding: '1.5rem',
          background: 'var(--c-bg-1)',
          border: '1px solid var(--c-border-hi)',
          borderRadius: 'var(--radius)',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--c-text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>email</span>
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--c-text-2)' }}>{user?.emailAddresses[0]?.emailAddress}</div>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--c-bg-1)',
                border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius-sm)',
                color: 'var(--c-text)', fontSize: '0.9rem', outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
              Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="@yourhandle"
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--c-bg-1)',
                border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius-sm)',
                color: 'var(--c-text)', fontSize: '0.9rem', outline: 'none',
                fontFamily: 'var(--f-mono)', transition: 'border-color 0.2s',
              }}
            />
            {handle && (
              <span className="mono" style={{ display: 'block', marginTop: '0.35rem', fontSize: '0.7rem', color: 'var(--c-text-3)' }}>
                @{handle}
              </span>
            )}
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 600 }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself and your editing style..."
              rows={4}
              style={{
                width: '100%', padding: '0.75rem 1rem', background: 'var(--c-bg-1)',
                border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius-sm)',
                color: 'var(--c-text)', fontSize: '0.9rem', outline: 'none',
                resize: 'vertical', lineHeight: 1.6, transition: 'border-color 0.2s',
              }}
            />
          </div>

          <div style={{
            padding: '0.75rem 1rem', background: 'rgba(245,245,245,0.03)',
            border: '1px solid var(--c-border)', borderRadius: 'var(--radius-sm)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--c-text-3)', textTransform: 'uppercase' }}>role</span>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: '2px', textTransform: 'capitalize' }}>
                {profile?.role || 'consumer'}
              </div>
            </div>
            {profile?.role === 'consumer' && (
              <button
                type="button"
                onClick={handleRequestRole}
                className="btn-outline-sm"
              >
                request creator role
              </button>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'saving...' : 'save profile'}
            </button>
            {message && (
              <span className="mono" style={{ fontSize: '0.8rem', color: message.includes('saved') ? '#30d158' : 'var(--c-text-2)' }}>
                {message}
              </span>
            )}
          </div>
        </form>

        {profile?.role === 'creator' && (
          <div style={{ marginTop: '2rem' }}>
            <Link href="/dashboard" className="btn-outline">manage packs &rarr;</Link>
          </div>
        )}
      </div>
    </div>
  );
}