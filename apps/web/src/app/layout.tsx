import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f6dce7',
};

export const metadata: Metadata = {
  title: 'Nqita',
  description: 'Open source desktop companion by WokSpec. Pixel-first identity, local runtime, and GitHub-first development.',
  metadataBase: new URL('https://nqita.wokspec.org'),
  openGraph: {
    type: 'website',
    siteName: 'Nqita',
    url: 'https://nqita.wokspec.org',
    title: 'Nqita',
    description: 'Open source desktop companion by WokSpec with a pixel-first public site and GitHub-first development.',
    images: [{ url: '/og.png' }],
  },
  twitter: { card: 'summary_large_image', site: '@wokspec' },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#fff6f9' }}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
