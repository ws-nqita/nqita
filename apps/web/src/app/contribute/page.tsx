import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contribute - Nqita',
  description: 'Nqita contribution entry points currently live on GitHub.',
};

export default function ContributePage() {
  return (
    <main className="site-page docs-page">
      <section className="docs-shell docs-simple">
        <h1>Contribution lives on GitHub.</h1>
        <p>Open issues, repos, and contribution paths are all there for now.</p>
        <div className="docs-simple__links">
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            github.com/ws-nqita
          </a>
          <a
            href="https://github.com/ws-nqita/nqita/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noreferrer"
          >
            contributing
          </a>
          <Link href="/">home</Link>
        </div>
      </section>
    </main>
  );
}
