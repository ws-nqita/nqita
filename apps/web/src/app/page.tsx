'use client';

import { useEffect } from 'react';
import { Press_Start_2P } from 'next/font/google';
import { spriteOptions } from '../content/site';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

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
    <main className="site-page site-page--single">
      <div className="site-grid" aria-hidden="true" />
      <div className="ambient-orbs" aria-hidden="true">
        <span className="ambient-orb ambient-orb--one" />
        <span className="ambient-orb ambient-orb--two" />
        <span className="ambient-orb ambient-orb--three" />
        <span className="ambient-orb ambient-orb--four" />
      </div>

      <section className="site-shell hero-minimal">
        <div className="hero-minimal__frame" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <h1 className={`hero-minimal__title ${pixelFont.className}`}>Nqita</h1>

        <div className="hero-minimal__actions">
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
            href="https://discord.gg/juunCaGpTW"
            target="_blank"
            rel="noreferrer"
          >
            <DiscordIcon />
            Discord
          </a>
        </div>

        <a className="scroll-cue" href="#sprites">
          scroll down
        </a>
      </section>

      <section className="site-shell sprite-river" id="sprites">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">Potential sprites</p>
          <h2>Potential sprites</h2>
        </div>

        <div className="sprite-gallery sprite-gallery--wide">
          {spriteOptions.map((sprite, index) => (
            <div
              key={sprite.id}
              className={`sprite-stage-card sprite-stage-card--v${(index % 3) + 1}`}
              aria-label={`Potential sprite ${index + 1}`}
            >
              <div className="sprite-stage-card__glow" aria-hidden="true" />
              <img className="sprite-stage-card__image" src={sprite.src} alt={sprite.alt} />
            </div>
          ))}
        </div>
      </section>

      <section className="site-shell story-river" id="about">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">What is going on</p>
          <h2>A calmer, clearer version of the project.</h2>
        </div>

        <div className="story-layout">
          <article className="story-card story-card--large">
            <p>
              Nqita is an open source desktop companion by WokSpec. The goal is simple: make a
              character that can live on your computer and feel present without feeling annoying.
            </p>
            <p>
              The real thing is still being built. What works today is the CLI and local runtime.
              That is the starting point, not the final shape.
            </p>
          </article>

          <article className="story-card">
            <h3>Where help matters most</h3>
            <p>
              Pixel art, animation, art direction, visual design, and motion are some of the
              biggest open needs right now.
            </p>
          </article>

          <article className="story-card">
            <h3>Open source scope</h3>
            <p>
              There is room for artists, designers, frontend people, and systems developers. If
              you can help shape how this looks, moves, or behaves, that work matters.
            </p>
          </article>

          <article className="story-card">
            <h3>Where to jump in</h3>
            <p>
              Start in the main GitHub org. The live prototype repo is{' '}
              <a href="https://github.com/ws-nqita/nqita-cli" target="_blank" rel="noreferrer">
                nqita-cli
              </a>
              . The art side especially needs people.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
