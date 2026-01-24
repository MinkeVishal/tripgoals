'use client';

import Link from 'next/link';
import Image from 'next/image';
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

  // Debug: Check what amenityIds is receiving
  console.log('Package:', pkg.title, 'amenityIds:', pkg.amenityIds, 'parsed:', amenities);

  return (
    <Link href={`/package/${pkg.$id}`}>
      <div className="
        min-w-[280px] w-[280px] h-[360px]
        bg-white/10 backdrop-blur-md rounded-none 
        overflow-hidden shadow-lg transition-all duration-400 cursor-pointer 
        relative flex-shrink-0 border border-white/20 
        hover:shadow-xl 
        hover:bg-white/15 hover:border-black/30
      ">
        {/* Image */}
        <div className="h-[190px] relative overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Image
            src={getImageUrl(pkg.imageIds?.[0] || pkg.imageId)}
            alt={pkg.title}
            width={300}
            height={200}
            className="w-full h-full object-cover object-top transition-transform duration-500"
          />
        </div>

        {/* Text */}
        <div className="px-3 py-2 relative z-10 bg-white/5 backdrop-blur-sm h-[170px] flex flex-col">
          <h3 className="text-sm font-bold mb-0.5 text-black text-center line-clamp-3">
            {pkg.title}
          </h3>
          {pkg.subtitle && (
            <p className="text-[10px] text-cyan-600 font-medium text-center mb-0.5 line-clamp-1">
              {pkg.subtitle}
            </p>
          )}

          <p className="text-xs sm:text-xs md:text-sm text-black/90 leading-tight text-center">
            {pkg.duration}
          </p>

          {/* Amenity Icons with Names - After Duration */}
          {amenities.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 my-1">
              {amenities.slice(0, 4).map((amenity, index) => (
                <div key={index} className="flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full border border-white/10">
                  <i className={`${amenity.icon} text-yellow-400 text-[11px]`}></i>
                  <span className="text-[11px] text-white/90 font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          )}

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
