import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import type { Metadata } from 'next';

import './globals.css';
import 'leaflet/dist/leaflet.css';
import Script from 'next/script';

import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Go2Copy - Online Štamparija',
  description: 'Naručite štampanje online - bez čekanja u redu',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <InitColorSchemeScript attribute="class" />
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
