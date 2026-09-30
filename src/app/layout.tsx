import type { Metadata } from 'next';
import '../styles/globals.css';
import { ClientRoot } from '@/components/layout/ClientRoot';

export const metadata: Metadata = {
  title: { default: 'BROOD — Luxury Fashion', template: '%s | BROOD' },
  description: 'BROOD — curated luxury footwear, horology, eyewear, and accessories.',
  metadataBase: new URL('https://brood.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientRoot>{children}</ClientRoot>
      </body>
    </html>
  );
}
