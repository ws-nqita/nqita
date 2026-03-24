'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Press_Start_2P } from 'next/font/google';
import { buildPlan, documentationLinks, homepageFacts, spriteOptions } from '../content/site';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const uniqueSprites = spriteOptions.filter(
  (sprite, index, allSprites) => allSprites.findIndex((entry) => entry.src === sprite.src) === index,
);

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.48 2 2 6.58 2 12.22c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49
        0-.24-.01-1.04-.01-1.89-2.78.62-3.37-1.21-3.37-1.21-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62
        1 .07 1.53 1.06 1.53 1.06.9 1.58 2.35 1.12 2.92.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.08
        0-1.12.39-2.03 1.03-2.75-.11-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.7.12 2.5.35
        1.9-1.33 2.75-1.05 2.75-1.05.54 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.95-2.34 4.81-4.57 5.07.36.32.68.95.68 1.92
        0 1.39-.01 2.5-.01 2.84 0 .27.18.6.69.49A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.32 4.37A16.57 16.57 0 0 0 16.23 3a11.26 11.26 0 0 0-.52 1.08 15.3 15.3 0 0 0-4.44 0A11.2 11.2 0 0 0 10.74 3
        16.45 16.45 0 0 0 6.65 4.37C4.06 8.17 3.36 11.88 3.71 15.53a16.7 16.7 0 0 0 5.02 2.55c.41-.57.77-1.18 1.08-1.82
        -.59-.23-1.15-.51-1.68-.84.14-.1.28-.21.41-.32 3.24 1.55 6.76 1.55 9.96 0 .14.11.27.22.41.32-.54.33-1.1.61-1.68.84.31.64.67 1.25 1.08 1.82
        a16.63 16.63 0 0 0 5.02-2.55c.41-4.23-.7-7.91-2.99-11.16ZM9.68 13.28c-.97 0-1.76-.91-1.76-2.03 0-1.13.78-2.04 1.76-2.04.99 0 1.77.92 1.76 2.04
        0 1.12-.78 2.03-1.76 2.03Zm4.64 0c-.97 0-1.76-.91-1.76-2.03 0-1.13.78-2.04 1.76-2.04.99 0 1.77.92 1.76 2.04 0 1.12-.77 2.03-1.76 2.03Z"
      />
    </svg>
  );
}

export default function HomePage() {
  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <main className="site-page">
      <div className="site-grid" aria-hidden="true" />

      <header className="site-shell site-topbar">
        <Link className="site-brand" href="/">
          <span>Nqita</span>
          <small>open source desktop companion by WokSpec</small>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <a href="#about">about</a>
          <a href="#docs">docs</a>
          <a href="#sprites">sprites</a>
          <Link href="/contribute">contribute</Link>
        </nav>
      </header>

      <section className="site-shell hero-flow">
        <div className="hero-copy">
          <p className="eyebrow">WokSpec is building Nqita in the open.</p>
          <h1 className={`hero-title ${pixelFont.className}`}>Nqita</h1>
          <p className="hero-lede">
            Nqita is a pixel desktop companion meant to live on your computer, not inside a tab.
            The live prototype today is the CLI stack. The bigger goal is a visible local runtime
            with a sprite, memory, and a desktop presence that feels alive without getting in your
            way.
          </p>

          <div className="hero-actions">
            <a
              className="action-button action-button--primary"
              href="https://github.com/ws-nqita"
              target="_blank"
              rel="noreferrer"
            >
              <GitHubIcon />
              GitHub
            </a>
            <a
              className="action-button action-button--secondary"
              href="https://github.com/ws-nqita/nqita-cli"
              target="_blank"
              rel="noreferrer"
            >
              nqita-cli repo
            </a>
            <Link className="action-button action-button--ghost" href="/docs">
              Read docs
            </Link>
          </div>

          <p className="human-callout">
            If you have real design, art direction, sprite animation, or pixel art experience,
            please help our open source project by WokSpec. This part matters. Nqita will only feel
            right if artists and designers help shape her.
          </p>
        </div>

        <div className="hero-stage">
          <div className="hero-stage__backdrop" />
          <img
            className="hero-stage__room"
            src="/nqita-sprites/server-room.png"
            alt=""
          />
          <img
            className="hero-stage__sprite"
            src="/nqita-sprites/current/chibi-cyborg.gif"
            alt="Animated preview of Nqita on the desktop"
          />

          <div className="coming-soon-chip" aria-label="Discord bot coming soon">
            <DiscordIcon />
            <span>Discord bot coming soon</span>
          </div>
        </div>
      </section>

      <section className="site-shell content-river" id="about">
        <div className="section-heading">
          <p className="eyebrow">What Nqita is becoming</p>
          <h2>Clear idea, real prototype, open work.</h2>
        </div>

        <div className="content-columns">
          <div className="prose-stack">
            {homepageFacts.map((fact) => (
              <p key={fact}>{fact}</p>
            ))}
          </div>

          <ol className="plain-steps">
            {buildPlan.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="site-shell docs-river" id="docs">
        <div className="section-heading section-heading--tight">
          <p className="eyebrow">Documentation on the site</p>
          <h2>Read the plan without digging through jargon.</h2>
          <p className="section-copy">
            The docs explain the same simple idea from different angles: Nqita should run locally,
            stay visible, respect permissions, and keep the sprite behavior tied to the same runtime
            state as the chat and tools.
          </p>
        </div>

        <div className="docs-list">
          {documentationLinks.map((link) => (
            <a
              key={link.href}
              className="doc-row"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className="doc-row__title">{link.title}</span>
              <span className="doc-row__body">{link.description}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="site-shell sprite-river" id="sprites">
        <div className="section-heading section-heading--tight">
          <p className="eyebrow">Potential sprites</p>
          <h2>Potential sprites.</h2>
        </div>

        <div className="sprite-gallery">
          {uniqueSprites.map((sprite, index) => (
            <div key={sprite.id} className="sprite-stage-card" aria-label={`Potential sprite ${index + 1}`}>
              <img className="sprite-stage-card__image" src={sprite.src} alt={sprite.alt} />
            </div>
          ))}
        </div>
      </section>

      <footer className="site-shell site-footer">
        <div>
          <strong>Nqita</strong>
          <p>Open source desktop companion by WokSpec.</p>
        </div>

        <div className="site-footer__links">
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://github.com/ws-nqita/nqita-cli" target="_blank" rel="noreferrer">
            nqita-cli
          </a>
          <Link href="/docs">Docs</Link>
          <Link href="/contribute">Contribute</Link>
        </div>
      </footer>
    </main>
  );
}
