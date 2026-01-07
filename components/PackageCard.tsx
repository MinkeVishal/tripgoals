'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';
import { useState } from 'react';

interface PackageCardProps {
  package: Package;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=90';

export default function PackageCard({ package: pkg }: PackageCardProps) {
  const [imageSrc, setImageSrc] = useState(() => {
    if (!pkg.imageId) return FALLBACK_IMAGE;
    try {
      return getImageUrl(pkg.imageId);
    } catch (e) {
      return FALLBACK_IMAGE;
    }
  });

  return (
    <Link href={`/package/${pkg.$id}`}>
      <div className="min-w-[180px] h-[200px] sm:min-w-[200px] sm:h-[220px] md:min-w-[240px] md:h-[250px] bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 cursor-pointer hover:shadow-2xl hover:-translate-y-3 hover:scale-110 animate-fadeInUp group border border-white/10">
        {/* Image */}
        <div className="h-[100px] sm:h-[120px] md:h-[140px] overflow-hidden relative bg-gray-200">
          <img 
            src={imageSrc} 
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
            onError={() => setImageSrc(FALLBACK_IMAGE)}
          />
        </div>
        
        {/* Text */}
        <div className="px-4 py-3 relative z-10 bg-white h-[100px] sm:h-[110px] flex flex-col justify-center transition-all duration-300 group-hover:bg-gray-50">
          <h3 className="text-base sm:text-sm md:text-base font-bold mb-1 text-gray-900 text-center transition-all duration-300 line-clamp-2">
            {pkg.title}
          </h3>
          <p className="text-sm sm:text-xs md:text-sm text-gray-600 leading-relaxed text-center transition-all duration-300 group-hover:text-gray-900 line-clamp-2">
            {pkg.subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}
