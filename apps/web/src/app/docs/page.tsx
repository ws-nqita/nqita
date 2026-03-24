import type { Metadata } from 'next';
import Link from 'next/link';
import { buildPlan, documentationLinks, homepageFacts } from '../../content/site';

export const metadata: Metadata = {
  title: 'Documentation - Nqita',
  description: 'Plain-language documentation hub for the Nqita desktop companion project.',
};

export default function DocsPage() {
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
          <a href="#overview">overview</a>
          <a href="#library">docs</a>
          <Link href="/contribute">contribute</Link>
        </nav>
      </header>

      <section className="site-shell page-intro" id="overview">
        <p className="eyebrow">Documentation</p>
        <h1>What the project is trying to build.</h1>
        <p className="section-copy">
          This page is the short version. Use it to understand the project before you drop into the
          deeper repo docs.
        </p>
      </section>

      <section className="site-shell content-river">
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

      <section className="site-shell docs-river" id="library">
        <div className="section-heading section-heading--tight">
          <p className="eyebrow">Reading list</p>
          <h2>Start with these.</h2>
          <p className="section-copy">
            These links are the fastest way to understand the shape of the system, the sprite work,
            and what is already running today.
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

      <section className="site-shell notes-river">
        <div className="section-heading section-heading--tight">
          <p className="eyebrow">Current state</p>
          <h2>What is real right now.</h2>
        </div>

        <div className="prose-stack prose-stack--wide">
          <p>
            The CLI is the runnable public prototype today. It already shows the intended split
            between the daemon, terminal chat flow, and sprite state updates.
          </p>
          <p>
            The full desktop companion is still being built. The public site exists to explain the
            direction, recruit contributors, and keep the work visible.
          </p>
          <p>
            If you want to help on the visual side, start with sprite direction, animation, and
            interface feel. If you want to help on the engineering side, start with the daemon,
            overlay, state, and permissions work.
          </p>
        </div>
      </section>
    </main>
  );
}
