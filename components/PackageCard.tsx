'use client';

import Link from 'next/link';
import Image from 'next/image';
import { getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  return (
    <Link href={`/package/${pkg.$id}`}>
      <div className="
        min-w-[180px] h-[200px]   /* smaller on mobile */
        sm:min-w-[200px] sm:h-[220px] 
        md:min-w-[240px] md:h-[250px]  /* normal size on larger screens */
        bg-white/10 backdrop-blur-md rounded-[40px] 
        overflow-hidden shadow-lg transition-all duration-400 cursor-pointer 
        relative flex-shrink-0 border border-white/20 
        hover:-translate-y-2 hover:scale-105 hover:shadow-xl 
        hover:bg-white/15 hover:border-black/30
      ">
        {/* Image */}
        <div className="h-[100px] sm:h-[120px] md:h-[140px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image 
            src={getImageUrl(pkg.imageId)} 
            alt={pkg.title}
            width={240}
            height={140}
            className="w-full h-full object-cover transition-transform duration-400 hover:scale-110"
          />
        </div>
        
        {/* Text */}
        <div className="px-3 sm:px-4 py-3 relative z-10 bg-white/5 backdrop-blur-sm h-[100px] sm:h-[110px] flex flex-col justify-center">
          <h3 className="text-base sm:text-sm md:text-base font-bold mb-1 text-black text-center">
            {pkg.title}
          </h3>
          <p className="text-sm sm:text-xs md:text-sm text-black/90 leading-relaxed text-center">
            {pkg.duration}
          </p>
        </div>
      </div>
    </Link>
  );
}
