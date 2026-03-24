import type { Metadata, Viewport } from 'next';
import { Inter, Silkscreen } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const silkscreen = Silkscreen({
  variable: '--font-silkscreen',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff82bf',
};

export const metadata: Metadata = {
  title: 'Nqita Waitlist',
  description: 'Join the Nqita waitlist for the pink pixel desktop companion.',
  metadataBase: new URL('https://nqita.wokspec.org'),
  openGraph: {
    type: 'website',
    siteName: 'Nqita',
    url: 'https://nqita.wokspec.org',
    title: 'Nqita Waitlist',
    description: 'A cutesy pink pixel waitlist for the Nqita desktop companion.',
    images: [{ url: '/og.png' }],
  },
  twitter: { card: 'summary_large_image', site: '@wokspec' },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ background: '#fff4fb' }}>
      <body className={`${inter.variable} ${silkscreen.variable}`}>{children}</body>
    </html>
  );
}
