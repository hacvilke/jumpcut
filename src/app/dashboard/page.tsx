'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import type { Pack, PackItem, Profile } from '@/lib/supabase';

export default function DashboardPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [packs, setPacks] = useState<Pack[]>([]);
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [packItems, setPackItems] = useState<PackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPackName, setNewPackName] = useState('');
  const [newPackCategory, setNewPackCategory] = useState('title');
  const [newPackDescription, setNewPackDescription] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [newItemType, setNewItemType] = useState('file');

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) { setLoading(false); return; }

    let cancelled = false;

    async function load() {
      try {
        const [profileRes, packsRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/packs'),
        ]);
        if (cancelled) return;
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        }
        if (packsRes.ok) {
          const packsData = await packsRes.json();
          setPacks(Array.isArray(packsData) ? packsData : []);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [isLoaded, isSignedIn]);

  const handleCreatePack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackName.trim()) return;
    try {
      const res = await fetch('/api/packs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newPackName,
          category: newPackCategory,
          description: newPackDescription || null,
        }),
      });
      if (res.ok) {
        setNewPackName('');
        setNewPackDescription('');
        setShowCreateForm(false);
        reloadPacks();
      }
    } catch {
      // ignore
    }
  };

  const handleTogglePublish = async (packId: string, currentStatus: boolean) => {
    try {
      await fetch(`/api/packs/${packId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !currentStatus }),
      });
      reloadPacks();
      if (selectedPack?.id === packId) {
        setSelectedPack({ ...selectedPack, is_published: !currentStatus });
      }
    } catch {
      // ignore
    }
  };

  const handleDeletePack = async (packId: string) => {
    if (!confirm('Delete this pack? This cannot be undone.')) return;
    try {
      await fetch(`/api/packs/${packId}`, { method: 'DELETE' });
      if (selectedPack?.id === packId) {
        setSelectedPack(null);
        setPackItems([]);
      }
      reloadPacks();
    } catch {
      // ignore
    }
  };

  const reloadPacks = async () => {
    try {
      const res = await fetch('/api/packs');
      if (res.ok) {
        const data = await res.json();
        setPacks(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    }
  };

  const handleSelectPack = async (pack: Pack) => {
    setSelectedPack(pack);
    try {
      const res = await fetch(`/api/packs/${pack.id}`);
      if (res.ok) {
        const data = await res.json();
        setPackItems(data.pack_items || []);
      }
    } catch {
      setPackItems([]);
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPack || !newItemName.trim()) return;
    try {
      await fetch(`/api/packs/${selectedPack.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          file_url: newItemUrl || null,
          file_type: newItemType,
        }),
      });
      setNewItemName('');
      setNewItemUrl('');
      handleSelectPack(selectedPack);
    } catch {
      // ignore
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!selectedPack) return;
    try {
      await fetch(`/api/packs/${selectedPack.id}/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId }),
      });
      setPackItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="packs-page" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <p className="section-tag">loading&hellip;</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="packs-page" style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <p className="section-tag">dashboard</p>
        <h1 className="section-h2" style={{ marginBottom: '1rem' }}>sign in to continue.</h1>
        <p style={{ color: 'var(--c-text-2)' }}>You need to be signed in to access your dashboard.</p>
      </div>
    );
  }

  if (profile && profile.role !== 'creator') {
    return (
      <div className="packs-page" style={{ padding: '8rem 2rem', textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
        <p className="section-tag">dashboard</p>
        <h1 className="section-h2" style={{ marginBottom: '1rem' }}>creator access only.</h1>
        <p style={{ color: 'var(--c-text-2)', marginBottom: '2rem', lineHeight: 1.7 }}>
          The dashboard is for verified creators who manage their template packs. Apply for creator status to get started.
        </p>
        <Link href="/profile" className="btn-primary">request creator role</Link>
      </div>
    );
  }

  return (
    <div className="packs-page" style={{ minHeight: '100vh' }}>
      <main style={{ padding: '6rem var(--page-pad) 4rem', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p className="section-tag">dashboard</p>
            <h1 className="section-h2">your packs.</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Link href="/profile" className="btn-ghost">profile</Link>
            <button className="btn-primary" onClick={() => setShowCreateForm(!showCreateForm)}>
              {showCreateForm ? 'cancel' : '+ new pack'}
            </button>
          </div>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreatePack} style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--c-bg-1)', border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius)' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Create New Pack</h3>
            <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: '1fr 1fr' }}>
              <input
                type="text"
                placeholder="Pack name"
                value={newPackName}
                onChange={(e) => setNewPackName(e.target.value)}
                required
                style={{ padding: '0.7rem 1rem', background: 'var(--c-bg-2)', border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius-sm)', color: 'var(--c-text)', fontSize: '0.9rem', outline: 'none' }}
              />
              <select
                value={newPackCategory}
                onChange={(e) => setNewPackCategory(e.target.value)}
                style={{ padding: '0.7rem 1rem', background: 'var(--c-bg-2)', border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius-sm)', color: 'var(--c-text)', fontSize: '0.9rem', outline: 'none' }}
              >
                <option value="title">Title packs</option>
                <option value="transition">Transitions</option>
                <option value="sound">Sound design</option>
                <option value="color">Color grades</option>
                <option value="shorts">Shorts systems</option>
                <option value="longform">Long-form kits</option>
                <option value="ads">Ad edits</option>
                <option value="brand">Brand motion</option>
                <option value="other">Other</option>
              </select>
              <textarea
                placeholder="Description (optional)"
                value={newPackDescription}
                onChange={(e) => setNewPackDescription(e.target.value)}
                rows={2}
                style={{ padding: '0.7rem 1rem', background: 'var(--c-bg-2)', border: '1px solid var(--c-border-hi)', borderRadius: 'var(--radius-sm)', color: 'var(--c-text)', fontSize: '0.9rem', outline: 'none', resize: 'vertical', gridColumn: '1 / -1' }}
              />
              <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1' }}>create pack</button>
            </div>
          </form>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
          {/* Pack list */}
          <div>
            {packs.length === 0 && (
              <div style={{ padding: '3rem 1.5rem', border: '1px dashed var(--c-border-hi)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <p className="mono" style={{ color: 'var(--c-text-3)', marginBottom: '0.5rem' }}>no packs yet</p>
                <p style={{ color: 'var(--c-text-2)', fontSize: '0.85rem' }}>Create your first pack to get started.</p>
              </div>
            )}
            {packs.map((pack) => (
              <div
                key={pack.id}
                onClick={() => handleSelectPack(pack)}
                style={{
                  padding: '1rem 1.25rem',
                  background: selectedPack?.id === pack.id ? 'var(--c-bg-2)' : 'var(--c-bg-1)',
                  border: `1px solid ${selectedPack?.id === pack.id ? 'var(--c-border-hi)' : 'var(--c-border)'}`,
                  borderRadius: 'var(--radius-sm)',
                  marginBottom: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{pack.name}</div>
                  <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--c-text-3)' }}>
                    {pack.category} &middot; {pack.is_published ? 'published' : 'draft'}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleTogglePublish(pack.id, pack.is_published); }}
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    {pack.is_published ? 'unpublish' : 'publish'}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeletePack(pack.id); }}
                    className="btn-ghost"
                    style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#ff453a' }}
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pack detail / items */}
          <div>
            {selectedPack ? (
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{selectedPack.name}</h3>
                <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--c-text-3)', marginBottom: '1.5rem' }}>
                  {selectedPack.category} &middot; {selectedPack.is_published ? 'published' : 'draft'} &middot; {packItems.length} items
                </p>
                {selectedPack.description && (
                  <p style={{ color: 'var(--c-text-2)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                    {selectedPack.description}
                  </p>
                )}

                {/* Add item form */}
                <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    required
                    style={{ flex: 1, minWidth: 140, padding: '0.6rem 0.8rem', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--radius-sm)', color: 'var(--c-text)', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <input
                    type="url"
                    placeholder="File URL (optional)"
                    value={newItemUrl}
                    onChange={(e) => setNewItemUrl(e.target.value)}
                    style={{ flex: 1, minWidth: 140, padding: '0.6rem 0.8rem', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--radius-sm)', color: 'var(--c-text)', fontSize: '0.85rem', outline: 'none' }}
                  />
                  <select
                    value={newItemType}
                    onChange={(e) => setNewItemType(e.target.value)}
                    style={{ padding: '0.6rem 0.8rem', background: 'var(--c-bg-2)', border: '1px solid var(--c-border)', borderRadius: 'var(--radius-sm)', color: 'var(--c-text)', fontSize: '0.85rem', outline: 'none' }}
                  >
                    <option value="file">File</option>
                    <option value="preset">Preset</option>
                    <option value="lut">LUT</option>
                    <option value="sfx">SFX</option>
                    <option value="other">Other</option>
                  </select>
                  <button type="submit" className="btn-cta" style={{ fontSize: '0.8rem' }}>add</button>
                </form>

                {/* Items list */}
                {packItems.length === 0 && (
                  <p className="mono" style={{ color: 'var(--c-text-3)', fontSize: '0.8rem' }}>no items in this pack</p>
                )}
                {packItems.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      background: 'var(--c-bg-1)',
                      border: '1px solid var(--c-border)',
                      borderRadius: 'var(--radius-sm)',
                      marginBottom: '0.4rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{item.name}</div>
                      <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--c-text-3)' }}>
                        {item.file_type || 'file'} {item.sort_order ? `#${item.sort_order}` : ''}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn-ghost"
                      style={{ fontSize: '0.75rem', padding: '4px 8px', color: '#ff453a' }}
                    >
                      remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem 1.5rem', border: '1px dashed var(--c-border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <p style={{ color: 'var(--c-text-2)', fontSize: '0.85rem' }}>Select a pack to view and manage its items.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}