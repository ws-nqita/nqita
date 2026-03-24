'use client';

import { useEffect, useState } from 'react';
import { Press_Start_2P } from 'next/font/google';
import { spriteOptions } from '../content/site';

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

const backgroundCells = Array.from({ length: 36 }, (_, index) => index);

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
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const root = document.documentElement;
      const xRatio = event.clientX / window.innerWidth - 0.5;
      const yRatio = event.clientY / window.innerHeight - 0.5;

      root.style.setProperty('--cursor-x', `${event.clientX}px`);
      root.style.setProperty('--cursor-y', `${event.clientY}px`);
      root.style.setProperty('--tilt-x', `${(-yRatio * 8).toFixed(2)}deg`);
      root.style.setProperty('--tilt-y', `${(xRatio * 8).toFixed(2)}deg`);
      root.style.setProperty('--scene-shift-x', `${(xRatio * 10).toFixed(2)}px`);
      root.style.setProperty('--scene-shift-y', `${(yRatio * 8).toFixed(2)}px`);
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        setActiveIndex((current) => (current - 1 + spriteOptions.length) % spriteOptions.length);
      }

      if (event.key === 'ArrowRight') {
        setActiveIndex((current) => (current + 1) % spriteOptions.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const activeSprite = spriteOptions[activeIndex];
  const previousSprite = spriteOptions[(activeIndex - 1 + spriteOptions.length) % spriteOptions.length];
  const nextSprite = spriteOptions[(activeIndex + 1) % spriteOptions.length];

  function go(step: number) {
    setActiveIndex((current) => (current + step + spriteOptions.length) % spriteOptions.length);
  }

  return (
    <main className={`site-page home-page ${pixelFont.className}`}>
      <div className="home-grid-glow" aria-hidden="true">
        {backgroundCells.map((cell) => (
          <span key={cell} className={`home-grid-glow__cell home-grid-glow__cell--${cell % 6}`} />
        ))}
      </div>

      <section className="home-shell hero-home">
        <div className="saas-stage" aria-hidden="true">
          <div className="saas-stage__back" />
          <div className="saas-stage__platform" />
          <div className="saas-stage__deck" />
          <div className="saas-stage__column saas-stage__column--left" />
          <div className="saas-stage__column saas-stage__column--right" />
          <div className="saas-stage__cube saas-stage__cube--left" />
          <div className="saas-stage__cube saas-stage__cube--center" />
          <div className="saas-stage__cube saas-stage__cube--right" />
        </div>

        <div className="hero-home__content">
          <h1 className="hero-home__title">Nqita</h1>
          <div className="hero-home__actions">
            <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
            <a href="https://discord.gg/juunCaGpTW" target="_blank" rel="noreferrer" aria-label="Discord">
              <DiscordIcon />
            </a>
          </div>
          <a className="hero-home__jump" href="#sprites" aria-label="Scroll to sprite collection">
            <span />
            <span />
            <span />
          </a>
        </div>
      </section>

      <section className="home-shell home-section" id="sprites">
        <div className="sprite-module">
          <div className="sprite-module__title">SPRITE COLLECTION</div>
          <div className="sprite-viewer">
            <div className="sprite-viewer__panel">
              <div className="sprite-viewer__scene" aria-hidden="true">
                <span className="sprite-viewer__wall" />
                <span className="sprite-viewer__floor" />
                <span className="sprite-viewer__pedestal" />
                <span className="sprite-viewer__pedestal-top" />
                <span className="sprite-viewer__beam" />
                <span className="sprite-viewer__dock sprite-viewer__dock--left" />
                <span className="sprite-viewer__dock sprite-viewer__dock--right" />
                <span className="sprite-viewer__rail sprite-viewer__rail--top" />
                <span className="sprite-viewer__rail sprite-viewer__rail--bottom" />
                <span className="sprite-viewer__mini sprite-viewer__mini--left-top" />
                <span className="sprite-viewer__mini sprite-viewer__mini--left-bottom" />
                <span className="sprite-viewer__mini sprite-viewer__mini--right-top" />
                <span className="sprite-viewer__mini sprite-viewer__mini--right-bottom" />
              </div>

              <button
                className="sprite-viewer__hover sprite-viewer__hover--left"
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous sprite"
              >
                <span className="sprite-viewer__hover-label">
                  <i />
                  previous
                </span>
              </button>

              <button
                className="sprite-viewer__hover sprite-viewer__hover--right"
                type="button"
                onClick={() => go(1)}
                aria-label="Next sprite"
              >
                <span className="sprite-viewer__hover-label">
                  <i />
                  next
                </span>
              </button>

              <img className="sprite-viewer__sprite sprite-viewer__sprite--ghost-left" src={previousSprite.src} alt="" aria-hidden="true" />
              <img className="sprite-viewer__sprite" src={activeSprite.src} alt={activeSprite.alt} />
              <img className="sprite-viewer__sprite sprite-viewer__sprite--ghost-right" src={nextSprite.src} alt="" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <section className="home-shell home-section home-section--info">
        <div className="help-module">
          <p>WE NEED HELP!</p>
          <p>DEVELOPERS AND ARTISTS.</p>
          <p>ANYONE.</p>
          <p>OPEN SOURCE.</p>
        </div>
      </section>
    </main>
  );
}
