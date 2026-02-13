import type { Metadata } from 'next';

import './globals.css';
import 'leaflet/dist/leaflet.css';
import { Providers } from './providers';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'PrintSerbia - Online Štamparija',
  description: 'Naručite štampanje online - bez čekanja u redu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
      />
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
