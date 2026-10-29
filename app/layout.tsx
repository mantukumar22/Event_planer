import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EventCraft AI - Intelligent Event Planning Assistant',
  description:
    'AI-powered event planning assistant for weddings, birthdays, and community events with live budgets, schedules, vendor checklists, and interactive ideas.',
  openGraph: {
    title: 'EventCraft AI - Intelligent Event Planning Assistant',
    description:
      'AI-powered event planning assistant for weddings, birthdays, and community events with live budgets, schedules, vendor checklists, and interactive ideas.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EventCraft AI - Intelligent Event Planning Assistant',
    description:
      'AI-powered event planning assistant for weddings, birthdays, and community events with live budgets, schedules, vendor checklists, and interactive ideas.',
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
        className="min-h-full bg-stone-50 text-stone-900 antialiased selection:bg-amber-200 selection:text-amber-900 flex flex-col font-sans"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-amber-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
