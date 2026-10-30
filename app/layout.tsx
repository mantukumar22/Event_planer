import type { Metadata } from 'next';
import { Unbounded, Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  weight: ['400', '600', '700', '800', '900'],
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['400', '600', '700'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

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
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${unbounded.variable} ${playfair.variable} ${jakarta.variable} font-sans min-h-full bg-[var(--ink)] text-[var(--text)] antialiased selection:bg-[var(--royal)] selection:text-[var(--text)] flex flex-col film-grain`}
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
