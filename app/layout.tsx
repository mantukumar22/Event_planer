import type { Metadata } from 'next';
import '@fontsource-variable/unbounded';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource/playfair-display/400-italic.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventCraft AI - Royal Event Planning Assistant',
  description:
    'Plan the party they will never forget. GenAI event planning assistant for weddings, birthdays, and community galas with royal-grade budgets, timelines, and checklists.',
  openGraph: {
    title: 'EventCraft AI - Royal Event Planning Assistant',
    description:
      'Plan the party they will never forget. AI-powered event planning with live budgets, countdown timelines, and vendor checklists.',
    type: 'website',
    images: [
      {
        url: '/images/og-image.webp',
        width: 1200,
        height: 630,
        alt: 'EventCraft AI - Royal Event Planning Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventCraft AI - Royal Event Planning Assistant',
    description:
      'Plan the party they will never forget. AI-powered event planning with live budgets, countdown timelines, and vendor checklists.',
    images: ['/images/og-image.webp'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth dark" style={{ colorScheme: 'dark' }}>
      <body
        className="font-body min-h-full bg-[var(--ink)] text-[var(--text)] antialiased selection:bg-[var(--royal)] selection:text-[var(--text)] flex flex-col film-grain"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-[var(--cyan)] focus:text-[#04121A] focus:font-bold focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-[var(--gold)]"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
