"use client";

import Hero from '@/components/Hero';
import PackageSection from '@/components/PackageSection';
import CategoriesSection from '@/components/CategoriesSection';
import ForeignerGuideSection from '@/components/ForeignerGuideSection';
import AdventureSection from '@/components/AdventureSection';

export default function Home() {
  return (
    <div className="relative min-h-screen text-gray-800 bg-white">
      {/* Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Hero />

        <section className="mt-12">
          <PackageSection title="Popular Packages" section="popular" />
        </section>

        <section className="mt-12">
          <PackageSection title="Special Packages" section="special" />
        </section>

        <section className="mt-12">
          <CategoriesSection />
        </section>

        <section className="mt-12">
          <ForeignerGuideSection />
        </section>

        <section className="mt-12">
          <AdventureSection />
        </section>
      </main>

      <style jsx>{`
        @keyframes gradient-slow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes zoom-slow {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-gradient-slow {
          background-size: 400% 400%;
          animation: gradient-slow 20s ease infinite;
        }

        .animate-zoom-slow {
          animation: zoom-slow 15s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

