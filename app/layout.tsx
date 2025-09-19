import './globals.css';
import type { Metadata } from 'next';
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
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-poppins">
        <div className="unified-background min-h-screen">
          <Header />
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
