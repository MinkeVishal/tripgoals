"use client";

import Hero from '@/components/Hero';
import PackageSection from '@/components/PackageSection';
import CategoriesSection from '@/components/CategoriesSection';
import ForeignerGuideSection from '@/components/ForeignerGuideSection';
import AdventureSection from '@/components/AdventureSection';
import InteractiveMap from '@/components/InteractiveMap';
import FloatingButtons from '@/components/FloatingButtons';

export default function Home() {
  return (
    <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift"></div>

      <div className="relative z-10">
        <Hero />
        <PackageSection title="Popular Packages" section="popular" />
        <PackageSection title="Special Packages" section="special" />
        <CategoriesSection />
        <ForeignerGuideSection />
        <AdventureSection />
        <InteractiveMap />
        <FloatingButtons />
      </div>

      <style jsx>{`
        .unified-background {
          background-image: url('https://images.unsplash.com/photo-1601333924055-f92c327e598b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); /* default: desktop */
        }

        /* For tablets and smaller screens */
        @media (max-width: 768px) {
          .unified-background {
            background-image: url('https://images.unsplash.com/photo-1662984130816-aee412d03066?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
          }
        }
      `}</style>
    </div>
  );
}
