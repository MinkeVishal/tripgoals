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

export default function PackageSection({ title, section, limit = 10 }: PackageSectionProps) {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = section === 'new' 
          ? await getLatestPackages(limit) 
          : await getPackages(limit, section);
        setPackages(response.documents as Package[]);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [section, limit]);

  if (loading) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">{title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-56 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6 animate-fadeIn">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.$id} package={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}