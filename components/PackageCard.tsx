'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

interface PackageCardProps {
  package: Package;
}

export default function PackageCard({ package: pkg }: PackageCardProps) {
  // Parse amenities from "icon|name" format
  const amenities = pkg.amenityIds?.map(a => {
    const [icon, name] = a.split('|');
    return { icon: icon || '', name: name || '' };
  }).filter(a => a.icon && a.name) || [];

  return (
    <Link href={`/package/${pkg.$id}`}>
      <div className="
        min-w-[180px] h-[230px]
        sm:min-w-[220px] sm:h-[260px]
        md:min-w-[260px] md:h-[300px]
        bg-white/95 rounded-2xl 
        overflow-hidden shadow-lg transition-all duration-400 cursor-pointer 
        relative flex-shrink-0
        hover:shadow-xl
      ">
        {/* Image */}
        <div className="h-[110px] sm:h-[130px] md:h-[160px] relative overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(pkg.imageIds?.[0] || pkg.imageId)}
            alt={pkg.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="px-3 py-2 bg-white h-[120px] sm:h-[130px] md:h-[140px] flex flex-col overflow-hidden relative">
          <h3 className="text-xs sm:text-sm font-bold mb-0.5 text-black text-center line-clamp-1">
            {pkg.title}
          </h3>
          {pkg.subtitle && (
            <p className="text-[10px] text-cyan-600 font-medium text-center mb-0.5 line-clamp-1">
              {pkg.subtitle}
            </p>
          )}
          <p className="text-[10px] text-black/90 text-center mb-1">
            {pkg.duration}
          </p>

          {/* Amenity Icons - show all on mobile */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-2">
              {amenities.slice(0, 3).map((amenity, index) => (
                <div key={index} className="flex items-center gap-0.5 bg-black/70 px-1.5 py-0.5 rounded-full">
                  <i className={`${amenity.icon} text-yellow-400 text-[8px]`}></i>
                  <span className="text-[8px] text-white/90 font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="absolute bottom-2 left-0 right-0 flex justify-center">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-[9px] sm:text-[10px] font-semibold px-3 py-1 rounded-full">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
