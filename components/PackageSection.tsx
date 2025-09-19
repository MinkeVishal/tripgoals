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
      <section className="py-4 relative z-10">
        <div className="max-w-full mx-auto px-5">
          <h2 className="text-xl font-bold text-center text-black mt-16 mb-4">
            {title}
          </h2>
          <p className="text-center text-black/90 mb-2 text-base">
            Explore India's most sought-after destinations
          </p>
          
          <div className="relative overflow-hidden py-1">
            <div className="flex space-x-4 overflow-x-auto hide-scrollbar py-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="min-w-[240px] h-[250px] bg-white/20 rounded-[50px] animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="packages" className="py-4 relative z-10">
      <div className="max-w-full mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-black mt-16 mb-4">
          {title}
        </h2>
        <p className="text-center text-black/90 mb-2 text-base">
          Explore India's most sought-after destinations
        </p>
        
        <div className="relative overflow-hidden py-1">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar py-4 smooth-scroll">
            {packages.map((pkg) => (
              <PackageCard key={pkg.$id} package={pkg} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}