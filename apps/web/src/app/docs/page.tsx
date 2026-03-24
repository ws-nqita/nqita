import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Docs - Nqita',
  description: 'Nqita docs currently live on GitHub.',
};

export default function DocsPage() {
  return (
    <main className="site-page docs-page">
      <section className="docs-shell docs-simple">
        <h1>Docs live on GitHub.</h1>
        <p>There is no on-site docs section yet.</p>
        <div className="docs-simple__links">
          <a href="https://github.com/ws-nqita" target="_blank" rel="noreferrer">
            github.com/ws-nqita
          </a>
          <a href="https://github.com/ws-nqita/nqita-cli" target="_blank" rel="noreferrer">
            nqita-cli
          </a>
          <Link href="/">home</Link>
        </div>
      </section>
    </main>
  );
}
