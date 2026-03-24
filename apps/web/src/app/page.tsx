'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  buildLanes,
  currentSprites,
  osCompanionCards,
  plannedSprites,
  roleOptions,
  stackRows,
  tickerItems,
  web3Signals,
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

  const progressValue = useMemo(() => Math.min(96, 36 + savedCount * 7), [savedCount]);

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
      <div className="sky-glow sky-glow--one" aria-hidden="true" />
      <div className="sky-glow sky-glow--two" aria-hidden="true" />
      <div className="ambient-sprite ambient-sprite--one" aria-hidden="true">
        <img src="/nqita-sprites/current/chibi-cyborg.gif" alt="" />
      </div>
      <div className="ambient-sprite ambient-sprite--two" aria-hidden="true">
        <img src="/nqita-sprites/current/simple-cyborg.gif" alt="" />
      </div>
      <div className="ambient-sprite ambient-sprite--three" aria-hidden="true">
        <img src="/nqita-sprites/current/cube-core.gif" alt="" />
      </div>

      <header className="topbar shell">
        <a className="wordmark" href="#waitlist-form">
          <span className="wordmark__kicker">alpha waitlist</span>
          <span className="wordmark__title">nqita</span>
        </a>

        <nav className="topbar__nav" aria-label="Primary">
          <a href="#waitlist-form">waitlist</a>
          <a href="#current-shells">sprites</a>
          <a href="#web3-scope">scope</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            github
          </a>
        </nav>
      </header>

      <section className="ticker-shell shell" aria-label="Live status ribbon">
        <div className="ticker">
          <div className="ticker__track">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="hero shell">
        <div className="hero__copy">
          <p className="pixel-pill">pink terminal agent for web3-native operators</p>
          <h1>
            a persistent agent
            <br />
            for terminal, wallet,
            <br />
            browser, and desktop.
          </h1>
          <p className="hero__pronunciation">pronounced nick-ee-tah</p>
          <p className="hero__lede">
            Nqita starts in your terminal and grows into a visible operator companion across your
            tools. The long arc is not another dashboard. It is an embodied pink agent that can sit
            beside your workflows across chains, contracts, wallets, tabs, and the operating system.
          </p>

          <div className="pixel-meter">
            <div className="pixel-meter__label">
              <span>embodiment progress</span>
              <strong>{progressValue}% awake</strong>
            </div>
            <div className="pixel-meter__bar" aria-hidden="true">
              <span style={{ width: `${progressValue}%` }} />
            </div>
          </div>

          <div className="hero__actions">
            <a className="pixel-button pixel-button--primary" href="#waitlist-form">
              join the waitlist
            </a>
            <a className="pixel-button pixel-button--secondary" href="#current-shells">
              inspect candidate shells
            </a>
          </div>

          <div className="signal-row">
            {web3Signals.map((item) => (
              <div key={item.label} className="signal-tile">
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="hero__scene" aria-label="Nqita environment scene">
          <div className="scene-card scene-card--server-room">
            <div className="scene-card__header">
              <span>network room</span>
              <strong>web3 operator environment</strong>
            </div>

            <div className="scene-card__room scene-card__room--server">
              <img
                className="scene-card__backdrop"
                src="/nqita-sprites/server-room.png"
                alt="Pink pixel-art server room environment"
              />
              <div className="scene-card__scanlines" aria-hidden="true" />
              <div className="scene-card__beams" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="scene-card__status-orbs" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <img
                className="scene-card__sprite scene-card__sprite--hero"
                src="/nqita-sprites/hero-agent-transparent.png"
                alt="Current Nqita sprite candidate render"
              />
              <div className="scene-card__sprite-ghost scene-card__sprite-ghost--one" aria-hidden="true">
                <img src="/nqita-sprites/current/chibi-cyborg.gif" alt="" />
              </div>
              <div className="scene-card__sprite-ghost scene-card__sprite-ghost--two" aria-hidden="true">
                <img src="/nqita-sprites/current/simple-cyborg.gif" alt="" />
              </div>
              <div className="scene-card__note scene-card__note--left">
                candidate shell operating from the pink network corridor
              </div>
              <div className="scene-card__note scene-card__note--right">
                no final logo. identity emerges through body, motion, and scene
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell content-grid">
        <article className="panel panel--waitlist" id="waitlist-form">
          <div className="panel__eyebrow">join the list</div>
          <h2>Get the early builds while the site, shell, and operator flow are still hardening.</h2>
          <p>
            The current flow is intentionally simple. Sign up, get on the list, and get updates as
            Nqita becomes more real across the CLI, desktop embodiment, and future wallet-aware
            workflows.
          </p>

          {submitted ? (
            <div className="success-box" role="status" aria-live="polite">
              <strong>slot reserved.</strong>
              <p>
                Your signup is saved locally on this device for now. The shared waitlist backend can
                drop in later without changing the experience.
              </p>
            </div>
          ) : (
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <label>
                email
                <input
                  type="email"
                  required
                  placeholder="you@onchainoperator.xyz"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>

              <label>
                you are
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
                <span>send me build drops, sprite tests, protocol-adjacent updates, and launch notes</span>
              </label>

              <button className="pixel-button pixel-button--primary" type="submit">
                reserve my slot
              </button>
            </form>
          )}
        </article>

        <article className="panel panel--presence" id="web3-scope">
          <div className="panel__eyebrow">web3 scope</div>
          <h2>terminal-native, account-aware, and eventually protocol-literate.</h2>
          <ul className="presence-list">
            {stackRows.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <div className="tiny-stat">
            <span>saved local signups</span>
            <strong>{savedCount.toString().padStart(2, '0')}</strong>
          </div>
        </article>
      </section>

      <section className="shell market-strip">
        <article className="market-card">
          <span>phase one</span>
          <strong>terminal runtime</strong>
          <p>Chat, state, daemon loop, and visible sprite coherence.</p>
        </article>
        <article className="market-card">
          <span>phase two</span>
          <strong>desktop presence</strong>
          <p>Persistent overlay body, bubbles, reactions, and scene changes.</p>
        </article>
        <article className="market-card">
          <span>phase three</span>
          <strong>web3 operator layer</strong>
          <p>Wallet-adjacent workflows, protocol context, and account-linked assistance.</p>
        </article>
      </section>

      <section className="shell gallery-section" id="what-it-is">
        <div className="section-heading">
          <div className="panel__eyebrow">os-level companion</div>
          <h2>not a prompt box. a local runtime that already lives with you.</h2>
          <p>
            The site now carries the canonical framing for Nqita: terminal-first, daemon-backed,
            permissioned, and privacy-first. That gives the visual work a real product spine instead
            of leaving it as pure moodboarding.
          </p>
        </div>

        <div className="signal-row signal-row--companion">
          {osCompanionCards.map((item) => (
            <article key={item.title} className="signal-tile signal-tile--wide">
              <strong>{item.title}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="shell sensation-strip" aria-label="Nqita sensory feed">
        <article className="sensation-card">
          <span>presence</span>
          <strong>animated room, living shell, visible agent state</strong>
        </article>
        <article className="sensation-card">
          <span>motion</span>
          <strong>floating echoes, drift, pulse, scanlines, and sprite rhythm</strong>
        </article>
        <article className="sensation-card">
          <span>tone</span>
          <strong>pink control room energy instead of a generic saas landing page</strong>
        </article>
      </section>

      <section className="shell gallery-section" id="current-shells">
        <div className="section-heading">
          <div className="panel__eyebrow">current nqitas</div>
          <h2>candidate bodies we can ship and test with right now.</h2>
          <p>
            These are the live character directions currently available for testing motion, presence,
            readability, and long-session desktop feel.
          </p>
        </div>

        <div className="sprite-grid">
          {currentSprites.map((sprite) => (
            <article key={sprite.title} className="sprite-card">
              <div className="sprite-card__media">
                <img src={sprite.src} alt={sprite.title} />
              </div>
              <div className="sprite-card__body">
                <span>{sprite.status}</span>
                <strong>{sprite.title}</strong>
                <p>{sprite.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shell gallery-section">
        <div className="section-heading">
          <div className="panel__eyebrow">planned directions</div>
          <h2>forms we are actively pushing toward next.</h2>
          <p>
            Identity is still moving. These planned bodies are where the project can become stranger,
            stronger, and more clearly agentic.
          </p>
        </div>

        <div className="sprite-grid sprite-grid--planned">
          {plannedSprites.map((sprite) => (
            <article key={sprite.title} className="sprite-card sprite-card--planned">
              <div className="sprite-card__media sprite-card__media--planned">
                <img src={sprite.src} alt={sprite.title} />
              </div>
              <div className="sprite-card__body">
                <span>{sprite.status}</span>
                <strong>{sprite.title}</strong>
                <p>{sprite.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="shell lower-grid">
        <article className="panel panel--code">
          <div className="panel__eyebrow">runtime path</div>
          <h2>simple entry. serious destination.</h2>
          <pre>{`nqita chat
  -> local daemon
  -> sprite state + memory
  -> byok or hosted path
  -> browser + desktop presence
  -> wallet / protocol-aware workflows later`}</pre>
        </article>

        <article className="panel panel--soft">
          <div className="panel__eyebrow">identity rule</div>
          <h2>the character is the brand right now.</h2>
          <p>
            No locked logo, no fake final mark. The site should feel like a living pink control room
            for an agent that is still being discovered through sprite work, behavior, and scene.
          </p>
        </article>
      </section>

      <section className="shell gallery-section" id="build-lanes">
        <div className="section-heading">
          <div className="panel__eyebrow">build lanes</div>
          <h2>the site can move fast now because the work is split cleanly.</h2>
          <p>
            Artists, runtime developers, and plugin builders each have a clear lane. That makes the
            homepage a working project surface, not just a holding page.
          </p>
        </div>

        <div className="sprite-grid sprite-grid--lanes">
          {buildLanes.map((lane) => (
            <article key={lane.title} className="sprite-card sprite-card--lane">
              <div className="sprite-card__body">
                <span>open contribution lane</span>
                <strong>{lane.title}</strong>
                <p>{lane.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer shell">
        <span>nqita.wokspec.org</span>
        <div className="footer__links">
          <a href="#waitlist-form">waitlist</a>
          <a href="#current-shells">sprites</a>
          <a href="#what-it-is">runtime</a>
          <a href="#build-lanes">lanes</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            ws-nqita
          </a>
        </div>
      </footer>
    </main>
  );
}
