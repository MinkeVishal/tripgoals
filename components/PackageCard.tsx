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
        min-w-[240px] h-[300px]
        sm:min-w-[270px] sm:h-[330px] 
        md:min-w-[300px] md:h-[360px]
        bg-white/10 backdrop-blur-md rounded-[25px] 
        overflow-hidden shadow-lg transition-all duration-400 cursor-pointer 
        relative flex-shrink-0 border border-white/20 
        hover:-translate-y-2 hover:scale-105 hover:shadow-xl 
        hover:bg-white/15 hover:border-black/30
      ">
        {/* Image */}
        <div className="h-[160px] sm:h-[180px] md:h-[200px] overflow-hidden relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            src={getImageUrl(pkg.imageIds?.[0] || pkg.imageId)}
            alt={pkg.title}
            width={300}
            height={200}
            className="w-full h-full object-cover transition-transform duration-400 hover:scale-110"
          />
        </div>

        {/* Text */}
        <div className="px-2 sm:px-3 py-1.5 relative z-10 bg-white/5 backdrop-blur-sm h-[140px] sm:h-[150px] md:h-[160px] flex flex-col">
          <h3 className="text-sm sm:text-sm md:text-base font-bold mb-0.5 text-black text-center line-clamp-2">
            {pkg.title}
          </h3>
          {pkg.subtitle && (
            <p className="text-[10px] sm:text-[10px] md:text-xs text-cyan-600 font-medium text-center mb-0.5 line-clamp-1">
              {pkg.subtitle}
            </p>
          )}
          <p className="text-xs sm:text-xs md:text-sm text-black/90 leading-tight text-center">
            {pkg.duration}
          </p>
          <div className="mt-auto flex justify-center pb-1">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-md">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
