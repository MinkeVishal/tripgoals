'use client';

import { useEffect, useState, useRef } from 'react';
import { getPackages, getLatestPackages } from '@/lib/appwrite';
import { Package } from '@/types';
import PackageCard from './PackageCard';

interface PackageSectionProps {
  title: string;
  section: string;
  limit?: number;
}

// Simple in-memory cache to prevent re-fetching on every render
const packageCache: { [key: string]: { data: Package[]; timestamp: number } } = {};
const CACHE_DURATION = 30 * 1000; // 30 seconds for faster updates

export default function PackageSection({ title, section, limit = 10 }: PackageSectionProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cacheKey = `${section}-${limit}`;

    const fetchPackages = async () => {
      // Check cache first
      const cached = packageCache[cacheKey];
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setPackages(cached.data);
        setLoading(false);
        return;
      }

      try {
        const response = section === 'new'
          ? await getLatestPackages(limit)
          : await getPackages(limit, section);
        const docs = response.documents as Package[];

        console.log(`[PackageSection] Fetched ${docs.length} packages for section: ${section}`, docs);

        // Store in cache
        packageCache[cacheKey] = { data: docs, timestamp: Date.now() };
        setPackages(docs);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();

    // Listen for package updates
    const handlePackageUpdate = () => {
      // Clear cache for this section
      delete packageCache[cacheKey];
      setLoading(true);
      fetchPackages();
    };

    window.addEventListener('packageAdded', handlePackageUpdate);
    window.addEventListener('packageUpdated', handlePackageUpdate);

    return () => {
      window.removeEventListener('packageAdded', handlePackageUpdate);
      window.removeEventListener('packageUpdated', handlePackageUpdate);
    };
  }, [section, limit]);

  // Auto-scroll slideshow
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || loading || packages.length === 0) return;

    const scrollAmount = 300; // Card width (280) + gap (20) roughly
    let scrollDirection = 1;

    const interval = setInterval(() => {
      if (container) {
        // Check if we've reached the end
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [loading, packages.length]);

  if (loading) {
    return (
      <section className="py-2 relative z-10">
        <div className="max-w-full mx-auto px-5">
          <h2 className="text-xl font-bold text-center text-white mt-7 mb-4">
            {title}
          </h2>

          <div className="relative overflow-hidden py-1">
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4 py-4 scroll-smooth" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="min-w-[280px] h-[360px] bg-white/10 rounded-[25px] animate-pulse flex-shrink-0" style={{ animationDuration: '0.8s' }} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="packages" className="py-4 relative z-10" suppressHydrationWarning>
      <div className="max-w-full mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-white mt-7 mb-4">
          {title}
        </h2>

        <div className="relative py-1">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {packages.map((pkg) => (
              <PackageCard key={pkg.$id} package={pkg} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
