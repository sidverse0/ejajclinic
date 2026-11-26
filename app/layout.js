import { Plus_Jakarta_Sans, Figtree } from 'next/font/google';
import './globals.css';

const display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });

export const metadata = {
  title: { default: 'Ejaz Clinic, Patna', template: '%s | Ejaz Clinic' },
  description:
    'Ejaz Clinic in Koiritola, Patna offers affordable surgical and primary care since 1987. OPD 9 AM to 9 PM.',
  // Set SITE_NOINDEX=1 on a demo/testing deployment so Google does not list it.
  robots: process.env.SITE_NOINDEX === '1' ? { index: false, follow: false } : undefined,
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#114b8f',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
