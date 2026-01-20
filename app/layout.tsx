import './globals.css';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import AuthModals from '@/components/AuthModals';
import { Toaster } from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Keep this

export const metadata: Metadata = {
  title: 'TripGoals - Discover Incredible India',
  description: 'Experience the magic of India with our travel packages',
  keywords: 'travel, vacation, tours, packages, adventure, India, Kashmir, Kerala, Rajasthan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="font-poppins" suppressHydrationWarning>
        <div className="unified-background min-h-screen">
          <Suspense fallback={<div className="h-16" />}>
            <Header />
          </Suspense>
          <main>{children}</main>
          <Footer />
          <FloatingButtons />
          <AuthModals />
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
