'use client';

import { useEffect, useState } from 'react';
import { getPackages, getLatestPackages } from '@/lib/appwrite';
import { Package } from '@/types';
import PackageCard from './PackageCard';

interface PackageSectionProps {
  title: string;
  section: 'popular' | 'special' | 'new';
  limit?: number;
}

// Simple in-memory cache to prevent re-fetching on every render
const packageCache: { [key: string]: { data: Package[]; timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function PackageSection({ title, section, limit = 10 }: PackageSectionProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

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
                <div key={i} className="min-w-[240px] h-[250px] bg-white/10 rounded-[50px] animate-pulse flex-shrink-0" style={{ animationDuration: '0.8s' }} />
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

        <div className="relative overflow-hidden py-1">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar pb-4 py-4 scroll-smooth" style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}>
            {packages.map((pkg) => (
              <PackageCard key={pkg.$id} package={pkg} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
