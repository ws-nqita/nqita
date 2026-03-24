'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type RoleOption =
  | 'Terminal User'
  | 'Developer'
  | 'Founder'
  | 'Pixel Artist'
  | 'Designer'
  | 'Web3 Operator'
  | 'Protocol Builder'
  | 'Curious Human';

type WaitlistEntry = {
  email: string;
  role: RoleOption;
  wantsUpdates: boolean;
  createdAt: string;
};

type SpriteCard = {
  title: string;
  src: string;
  note: string;
  status: string;
};

const roleOptions: RoleOption[] = [
  'Terminal User',
  'Developer',
  'Founder',
  'Pixel Artist',
  'Designer',
  'Web3 Operator',
  'Protocol Builder',
  'Curious Human',
];

const storageKey = 'nqita-waitlist-v1';

const currentSprites: SpriteCard[] = [
  {
    title: 'chibi cyborg',
    src: '/nqita-sprites/current/chibi-cyborg.gif',
    status: 'current shell',
    note: 'Closest to an everyday desktop companion that still feels technically sharp.',
  },
  {
    title: 'simple pink runner',
    src: '/nqita-sprites/current/simple-cyborg.gif',
    status: 'current shell',
    note: 'Small, readable, and ideal for persistent overlay behavior on dense screens.',
  },
  {
    title: 'cube core',
    src: '/nqita-sprites/current/cube-core.gif',
    status: 'current shell',
    note: 'Abstract daemon energy. Good for utility mode or network-state presence.',
  },
  {
    title: 'armored girl',
    src: '/nqita-sprites/current/armored-girl.gif',
    status: 'current shell',
    note: 'Heavier silhouette for a stronger operator persona and more overt identity.',
  },
];

const plannedSprites: SpriteCard[] = [
  {
    title: 'full walk-cycle shell',
    src: '/nqita-sprites/planned/walk-cycle-south.png',
    status: 'planned body',
    note: 'Best route for wandering desktop motion, idles, and room-to-room embodiment.',
  },
  {
    title: 'computer-head form',
    src: '/nqita-sprites/planned/computer-head-south.png',
    status: 'planned body',
    note: 'Feels stranger and more post-human. Strong fit if identity leans deeper into agenthood.',
  },
  {
    title: 'monitor-body form',
    src: '/nqita-sprites/planned/monitor-body-south.png',
    status: 'planned body',
    note: 'Tighter link to terminal, dashboards, ledgers, and workstation-native presence.',
  },
  {
    title: 'soft chibi front',
    src: '/nqita-sprites/planned/chibi-south.png',
    status: 'planned body',
    note: 'The safest readable fallback if we need friendlier public-facing surfaces.',
  },
];

const web3Signals = [
  {
    label: 'wallet-adjacent operator',
    detail: 'Built for people living between terminal tabs, dashboards, wallets, contracts, and Discord war rooms.',
  },
  {
    label: 'byok and hosted path',
    detail: 'Bring your own key for serious usage, or use the hosted path with limits while Nqita hardens.',
  },
  {
    label: 'persistent identity',
    detail: 'Not just another chat tab. The agent should stay present across surfaces and context boundaries.',
  },
];

const stackRows = [
  'terminal command surface',
  'local daemon memory + state',
  'wallet / account-aware workflows later',
  'browser + desktop embodiment',
  'protocol and operator tooling over time',
];

const tickerItems = [
  'daemon awake',
  'sprite candidates live',
  'pink network room online',
  'wallet-aware workflows planned',
  'desktop shell under construction',
  'byok path supported',
  'hosted path with limits',
  'identity still evolving',
];

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

      <footer className="footer shell">
        <span>nqita.wokspec.org</span>
        <div className="footer__links">
          <a href="#waitlist-form">waitlist</a>
          <a href="#current-shells">sprites</a>
          <a href="#web3-scope">scope</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            ws-nqita
          </a>
        </div>
      </footer>
    </main>
  );
}
