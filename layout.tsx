// Blueprint III.C: Root layout for self-optimizing dashboards
import './globals.css';
import React from 'react';

export const metadata = {
  title: 'KlinkyLinks',
  description: 'Self-operating SaaS platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header> KlinkyLinks - Autonomous Protection </header>
        {children}
        <footer>Powered by xAI Agents</footer>
      </body>
    </html>
  );
}
