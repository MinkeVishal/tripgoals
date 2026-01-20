'use client';

import { useEffect, useState } from 'react';
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
  // Split packages into rows of 5
  const packagesPerRow = 5;
  const rows: Package[][] = [];
  for (let i = 0; i < packages.length; i += packagesPerRow) {
    rows.push(packages.slice(i, i + packagesPerRow));
  }

  return (
    <section id="packages" className="py-4 relative z-10" suppressHydrationWarning>
      <div className="max-w-full mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-white mt-7 mb-4">
          {title}
        </h2>

        <div className="relative py-1 space-y-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex space-x-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth"
              style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
            >
              {row.map((pkg) => (
                <PackageCard key={pkg.$id} package={pkg} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
