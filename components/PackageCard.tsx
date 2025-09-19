'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Link href={`/package/${pkg.$id}`}>
      <div className="min-w-[240px] h-[250px] bg-white/10 backdrop-blur-md rounded-[50px] overflow-hidden shadow-lg transition-all duration-400 cursor-pointer relative flex-shrink-0 border border-white/20 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:bg-white/15 hover:border-black/30">
        <div className="h-[140px] overflow-hidden relative">
          <img 
            src={getImageUrl(pkg.imageId)} 
            alt={pkg.title}
            className="w-full h-full object-cover transition-transform duration-400 hover:scale-110"
          />
        </div>
        
        <div className="px-4 py-4 relative z-10 bg-white/5 backdrop-blur-sm h-[110px] flex flex-col justify-center">
          <h3 className="text-sm font-bold mb-1 text-black text-center">
            {pkg.title}
          </h3>
          <p className="text-black/90 text-xs leading-relaxed text-center">
            {pkg.subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}