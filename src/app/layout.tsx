import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { AppProviders } from '@/app/providers/AppProviders';
import { Navbar, Footer } from '@/shared/components/Layout';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'SJMIT R&D Center',
  description: 'Research and Development Center at SJMIT Institute of Technology, Chitradurga.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <ErrorBoundary>
          <AppProviders>
            <div className="min-h-screen flex flex-col bg-white dark:bg-[#0a0c10]">
              <Suspense fallback={<header className="glass-nav h-20" />}>
                <Navbar />
              </Suspense>
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
