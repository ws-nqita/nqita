'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // If already signed in, go straight to chat
    const key = localStorage.getItem('eral_token');
    if (key) router.replace('/chat');
  }, [router]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', color: 'var(--foreground)', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{ width: '2rem', height: '2rem', background: 'var(--accent)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>E</div>
          <span style={{ fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-0.01em' }}>Eral</span>
        </div>
        <a href="/login" style={{ background: 'var(--accent)', color: '#fff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '0.625rem', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', cursor: 'pointer' }}>
          Sign in
        </a>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: '999px', padding: '0.3rem 1rem', marginBottom: '2rem', fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 500 }}>
          ✦ Powered by WokSpec
        </div>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, marginBottom: '1.25rem', maxWidth: '720px' }}>
          Meet Eral,<br />your WokSpec AI
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--muted)', maxWidth: '520px', lineHeight: 1.65, marginBottom: '2.5rem' }}>
          The intelligent layer across all WokSpec products — chat, generate, analyze, and build with AI that knows your context.
        </p>
        <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/login" style={{ background: 'var(--accent)', color: '#fff', padding: '0.8125rem 2rem', borderRadius: '0.75rem', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Start chatting →
          </a>
          <a href="https://wokspec.org" style={{ background: 'var(--card)', color: 'var(--foreground)', padding: '0.8125rem 1.5rem', borderRadius: '0.75rem', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', border: '1px solid var(--border)' }}>
            Learn more
          </a>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '5rem', maxWidth: '760px', width: '100%', textAlign: 'left' }}>
          {[
            { icon: '💬', title: 'Chat', desc: 'Conversational AI with memory across sessions' },
            { icon: '⚡', title: 'Generate', desc: 'Text, copy, and content for any context' },
            { icon: '🔍', title: 'Analyze', desc: 'Understand and extract insights from anything' },
            { icon: '🔌', title: 'Embeddable', desc: 'Drop into any site with one script tag' },
          ].map(f => (
            <div key={f.title} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '1rem', padding: '1.25rem' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{f.title}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--muted)' }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

