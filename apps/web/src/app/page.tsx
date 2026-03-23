'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type RoleOption = 'Developer' | 'Founder' | 'Designer' | 'Curious Human';

type WaitlistEntry = {
  email: string;
  role: RoleOption;
  wantsUpdates: boolean;
  createdAt: string;
};

const roleOptions: RoleOption[] = ['Developer', 'Founder', 'Designer', 'Curious Human'];

const proofPoints = [
  'Pixel companion energy, built to live on your desktop instead of another tab.',
  'Privacy-first by default, with local-first memory and calm ambient behavior.',
  'Fast setup across the WokSpec universe, with browser and API touchpoints already underway.',
];

const unlocks = [
  { label: 'Desktop sprite', value: 'Lv. 01' },
  { label: 'Browser panel', value: 'Lv. 02' },
  { label: 'API access', value: 'Lv. 03' },
];

const questSteps = [
  'Drop your email into the capsule.',
  'Pick the role that matches your build style.',
  'Get a ping when the first cutesy builds go live.',
];

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
  const [role, setRole] = useState<RoleOption>('Developer');
  const [wantsUpdates, setWantsUpdates] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    const entries = readStoredEntries();
    setSavedCount(entries.length);
    setSubmitted(entries.some((entry) => entry.email.toLowerCase() === email.toLowerCase()));
  }, [email]);

  const progressValue = useMemo(() => Math.min(88, 44 + savedCount * 7), [savedCount]);

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

  return (
    <main className="waitlist-page">
      <div className="waitlist-grid" aria-hidden="true" />

      <header className="topbar shell">
        <a className="brandmark" href="#waitlist-form">
          <span className="brandmark__sprite">NQ</span>
          <span>
            <strong>Nqita</strong>
            <small>pink pixel desktop friend</small>
          </span>
        </a>

        <nav className="topbar__nav" aria-label="Primary">
          <a href="/docs">Docs</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            ws-nqita
          </a>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero__copy">
          <p className="pixel-pill">waitlist quest open</p>
          <h1>
            A cutesy pink pixel pal
            <br />
            for your desktop life.
          </h1>
          <p className="hero__lede">
            Nqita is becoming an ambient desktop companion with sprite moods, soft autonomy, and
            game-like charm. Join the waitlist for early builds at <strong>nqita.wokspec.org</strong>.
          </p>

          <div className="hero__actions">
            <a className="pixel-button pixel-button--primary" href="#waitlist-form">
              Join the waitlist
            </a>
            <a className="pixel-button pixel-button--secondary" href="/docs">
              Peek at docs
            </a>
          </div>

          <div className="quest-panel">
            <div className="quest-panel__header">
              <span>launch meter</span>
              <strong>{progressValue}% charged</strong>
            </div>
            <div className="quest-bar" aria-hidden="true">
              <span style={{ width: `${progressValue}%` }} />
            </div>
            <ul className="quest-list">
              {questSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hero__art" aria-hidden="true">
          <div className="pixel-card">
            <div className="pixel-card__spark pixel-card__spark--one" />
            <div className="pixel-card__spark pixel-card__spark--two" />
            <div className="pixel-card__spark pixel-card__spark--three" />

            <div className="sprite-stage">
              <div className="sprite-stage__halo" />
              <div className="sprite">
                <span className="sprite__bow" />
                <span className="sprite__eye sprite__eye--left" />
                <span className="sprite__eye sprite__eye--right" />
                <span className="sprite__blush sprite__blush--left" />
                <span className="sprite__blush sprite__blush--right" />
              </div>
              <div className="sprite-stage__platform" />
            </div>

            <div className="unlock-grid">
              {unlocks.map((item) => (
                <div key={item.label} className="unlock-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="shell content-grid">
        <article className="panel panel--soft" id="waitlist-form">
          <div className="panel__eyebrow">join the party</div>
          <h2>Claim your spot on the first wave.</h2>
          <p>
            The current flow stores your signup in this browser while the shared waitlist backend is
            being wired up. It still gives you a clean, reusable handoff list for launch prep.
          </p>

          {submitted ? (
            <div className="success-box" role="status" aria-live="polite">
              <strong>You&apos;re on the list.</strong>
              <p>
                Your browser saved this waitlist entry. When the shared endpoint lands, this flow can
                switch from local capture to live collection without changing the page design.
              </p>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <label>
                Email
                <input
                  type="email"
                  required
                  placeholder="you@dreambuilds.dev"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label>
                Role
                <select value={role} onChange={(event) => setRole(event.target.value as RoleOption)}>
                  {roleOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={wantsUpdates}
                  onChange={(event) => setWantsUpdates(event.target.checked)}
                />
                <span>Send me build notes and launch pings.</span>
              </label>

              <button className="pixel-button pixel-button--primary" type="submit">
                Save my waitlist slot
              </button>
            </form>
          )}
        </article>

        <article className="panel">
          <div className="panel__eyebrow">why it feels different</div>
          <h2>Game energy without the noise.</h2>
          <ul className="proof-list">
            {proofPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="tiny-stat">
            <span>saved local signups</span>
            <strong>{savedCount.toString().padStart(2, '0')}</strong>
          </div>
        </article>
      </section>

      <section className="shell lower-grid">
        <article className="panel">
          <div className="panel__eyebrow">how it fits</div>
          <h2>Desktop character first, web layer second.</h2>
          <p>
            Nqita starts as a desktop sprite with moods, lightweight reactions, and a strong sense of
            presence. The web layer is there to handle docs, onboarding, keys, and launch access.
          </p>
          <p>
            That means the waitlist should feel playful, but still clean enough to convert founders,
            builders, and artists who want early access.
          </p>
        </article>

        <article className="panel panel--code">
          <div className="panel__eyebrow">future web handoff</div>
          <h2>When the API hooks in.</h2>
          <pre>{`POST https://nqita.wokspec.org/api/v1/waitlist
{
  "email": "you@dreambuilds.dev",
  "role": "${role}",
  "updates": ${wantsUpdates}
}`}</pre>
        </article>
      </section>

      <footer className="footer shell">
        <span>nqita.wokspec.org</span>
        <div className="footer__links">
          <a href="/docs">Docs</a>
          <a href="/login">Login</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            ws-nqita
          </a>
        </div>
      </footer>
    </main>
  );
}
