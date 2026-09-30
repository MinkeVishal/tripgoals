import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { MotionProvider } from '@/components/motion/motion-provider';
import { JsonLd } from '@/components/site/json-ld';
import { Toaster } from '@/components/ui/sonner';
import { DEFAULT_SHARE_IMAGE, graph, organizationLd, websiteLd } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';

const sans = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: `${siteConfig.name} | India Tour Packages, Treks & Adventure Trips`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  keywords: ['travel', 'India tour packages', 'Kashmir', 'Kerala', 'Rajasthan', 'Goa', 'adventure', 'Aurangabad', 'Chhatrapati Sambhajinagar', 'Maharashtra', 'India'],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: 'travel',
  formatDetection: { telephone: true, email: true, address: false },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    locale: 'en_IN',
    url: '/',
    title: `${siteConfig.name} | India Tour Packages, Treks & Adventure Trips`,
    description: siteConfig.description,
    images: [DEFAULT_SHARE_IMAGE],
  },
  twitter: { card: 'summary_large_image', images: [DEFAULT_SHARE_IMAGE.url] },
  icons: { icon: '/Tripgoal_logo.png', apple: '/Tripgoal_logo.png' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfcfa' },
    { media: '(prefers-color-scheme: dark)', color: '#141a12' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning className={sans.variable}>
      <body>
        <JsonLd data={graph(organizationLd(), websiteLd())} />
        <ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange>
          <MotionProvider>{children}</MotionProvider>
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
