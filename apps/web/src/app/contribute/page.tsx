import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contribute - Nqita',
  description: 'Contribution guide for artists, designers, and developers helping build Nqita.',
};

const tracks = [
  {
    title: 'Pixel art and animation',
    body:
      'This is one of the biggest needs in the whole project. We need walk cycles, idle loops, reactions, stronger character direction, and better scene art.',
  },
  {
    title: 'Design and interface direction',
    body:
      'We need help shaping the bubble, the desktop overlay, the logs view, and the overall feel so the project stays human and clear instead of looking bolted together.',
  },
  {
    title: 'Runtime and platform engineering',
    body:
      'The daemon, permissions, memory, overlay bridge, and platform work still need contributors who like systems problems and real product edges.',
  },
];

export default function ContributePage() {
  return (
    <main className="site-page site-page--docs">
      <div className="site-grid" aria-hidden="true" />

      <header className="site-shell site-topbar">
        <Link className="site-brand" href="/">
          <span>Nqita</span>
          <small>open source desktop companion by WokSpec</small>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          <Link href="/">home</Link>
          <Link href="/docs">docs</Link>
          <a href="#help">help</a>
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            github
          </a>
        </nav>
      </header>

      <section className="site-shell page-intro" id="help">
        <p className="eyebrow">Contribute</p>
        <h1>Nqita needs artists and designers in a serious way.</h1>
        <p className="section-copy">
          If you have experience with pixel art, sprite animation, interaction design, interface
          systems, or art direction, please help this open source WokSpec project. Engineering help
          matters too, but the visual and design side is one of the clearest gaps right now.
        </p>
      </section>

      <section className="site-shell notes-river">
        <div className="prose-stack prose-stack--wide">
          {tracks.map((track) => (
            <p key={track.title}>
              <strong>{track.title}:</strong> {track.body}
            </p>
          ))}
        </div>
      </section>

      <section className="site-shell docs-river">
        <div className="section-heading section-heading--tight">
          <p className="eyebrow">Where to start</p>
          <h2>Public entry points.</h2>
        </div>

        <div className="docs-list">
          <a
            className="doc-row"
            href="https://github.com/ws-nqita/nqita/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
          >
            <span className="doc-row__title">Main contributing guide</span>
            <span className="doc-row__body">
              Start here for the main project contribution path and repo expectations.
            </span>
          </a>
          <a
            className="doc-row"
            href="https://github.com/ws-nqita/nqita/blob/main/docs/SPRITE_SYSTEM.md"
            target="_blank"
            rel="noreferrer"
          >
            <span className="doc-row__title">Sprite system spec</span>
            <span className="doc-row__body">
              This is the most relevant doc if you want to help with pixel art and animation.
            </span>
          </a>
          <a
            className="doc-row"
            href="https://github.com/ws-nqita/nqita-cli"
            target="_blank"
            rel="noreferrer"
          >
            <span className="doc-row__title">nqita-cli repo</span>
            <span className="doc-row__body">
              This is the runnable public prototype for the daemon, terminal flow, and sprite state.
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
