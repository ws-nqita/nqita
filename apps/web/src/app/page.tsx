'use client';

import { FormEvent, useEffect, useState } from 'react';
import {
  currentSprites,
  plannedSprites,
  roleOptions,
  type RoleOption,
} from '../content/site';

type WaitlistEntry = {
  email: string;
  role: RoleOption;
  wantsUpdates: boolean;
  createdAt: string;
};

const storageKey = 'nqita-waitlist-v1';

function readStoredEntries(): WaitlistEntry[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleOption>('Terminal User');
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const entries = readStoredEntries();
    setSavedCount(entries.length);
    setSubmitted(entries.some((entry) => entry.email.toLowerCase() === email.toLowerCase()));
  }, [email]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return;
    }

    const nextEntry: WaitlistEntry = {
      email: normalizedEmail,
      role,
      wantsUpdates,
      createdAt: new Date().toISOString(),
    };

    const entries = readStoredEntries();
    const deduped = entries.filter((entry) => entry.email !== normalizedEmail);
    const nextEntries = [nextEntry, ...deduped].slice(0, 250);

    window.localStorage.setItem(storageKey, JSON.stringify(nextEntries));
    setSavedCount(nextEntries.length);
    setSubmitted(true);
  }

  const spriteCandidates = [...currentSprites, ...plannedSprites];

  return (
    <main className="simple-home">
      <header className="simple-shell simple-topbar">
        <a className="simple-wordmark" href="#waitlist-form">
          <span className="simple-wordmark__eyebrow">alpha waitlist</span>
          <span className="simple-wordmark__title">nqita</span>
        </a>

        <nav className="simple-nav" aria-label="Primary">
          <a href="#waitlist-form">waitlist</a>
          <a href="#current-shells">sprites</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            github
          </a>
        </nav>
      </header>

      <section className="simple-shell simple-hero">
        <div className="simple-hero__copy">
          <p className="simple-pill">terminal-first ai companion</p>
          <h1>nqita starts in your terminal and grows into a persistent desktop companion.</h1>
          <p className="simple-pronunciation">pronounced nick-ee-tah</p>
          <p className="simple-lede">
            A light, cute waitlist for a pink AI companion. No locked logo yet. The character,
            behavior, and sprite body are still being figured out.
          </p>

          <div className="simple-actions">
            <a className="simple-button simple-button--primary" href="#waitlist-form">
              join waitlist
            </a>
            <a className="simple-button simple-button--secondary" href="#current-shells">
              view sprite candidates
            </a>
          </div>

          <div className="simple-stats">
            <div className="simple-stat">
              <span>saved locally</span>
              <strong>{savedCount.toString().padStart(2, '0')}</strong>
            </div>
            <div className="simple-stat">
              <span>current focus</span>
              <strong>waitlist + sprite direction</strong>
            </div>
          </div>
        </div>

        <div className="simple-hero__art">
          <div className="hero-preview">
            <div className="hero-preview__label">current candidate</div>
            <img
              className="hero-preview__sprite"
              src="/nqita-sprites/hero-agent-transparent.png"
              alt="Potential Nqita sprite candidate"
            />
            <p className="hero-preview__note">
              soft pink body, pixel silhouette, no final brand mark yet.
            </p>
          </div>
        </div>
      </section>

      <section className="simple-shell simple-grid">
        <article className="simple-card" id="waitlist-form">
          <div className="simple-card__eyebrow">waitlist</div>
          <h2>Get early access while the runtime and sprite identity are still taking shape.</h2>
          <p>
            Join the list for build drops, site updates, CLI progress, and sprite tests.
          </p>

          {submitted ? (
            <div className="simple-success" role="status" aria-live="polite">
              <strong>you&apos;re on the list.</strong>
              <p>This signup is currently saved locally on this device.</p>
            </div>
          ) : (
            <form className="simple-form" onSubmit={handleSubmit}>
              <label>
                email
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label>
                role
                <select value={role} onChange={(event) => setRole(event.target.value as RoleOption)}>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="simple-checkbox">
                <input
                  type="checkbox"
                  checked={wantsUpdates}
                  onChange={(event) => setWantsUpdates(event.target.checked)}
                />
                <span>send updates about builds and sprite direction</span>
              </label>

              <button className="simple-button simple-button--primary" type="submit">
                join waitlist
              </button>
            </form>
          )}
        </article>

        <article className="simple-card simple-card--soft">
          <div className="simple-card__eyebrow">what nqita is</div>
          <h2>Simple now. More embodied later.</h2>
          <ul className="simple-list">
            <li>Starts in the terminal.</li>
            <li>Moves toward a daemon-backed desktop companion.</li>
            <li>Light by default, local-first, and character-led.</li>
          </ul>
        </article>
      </section>

      <section className="simple-shell simple-sprites" id="current-shells">
        <div className="section-heading">
          <div className="panel__eyebrow">sprite candidates</div>
          <h2>Potential bodies for Nqita.</h2>
          <p>
            These are the main directions under consideration right now. The site should help make
            that choice feel obvious.
          </p>
        </div>

        <div className="simple-sprite-grid">
          {spriteCandidates.map((sprite) => (
            <article key={`${sprite.status}-${sprite.title}`} className="simple-sprite-card">
              <div className="simple-sprite-card__media">
                <img src={sprite.src} alt={sprite.title} />
              </div>
              <div className="simple-sprite-card__body">
                <span>{sprite.status}</span>
                <strong>{sprite.title}</strong>
                <p>{sprite.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="simple-shell simple-footer">
        <span>nqita.wokspec.org</span>
        <div className="simple-nav">
          <a href="#waitlist-form">waitlist</a>
          <a href="#current-shells">sprites</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            ws-nqita
          </a>
        </div>
      </footer>
    </main>
  );
}
