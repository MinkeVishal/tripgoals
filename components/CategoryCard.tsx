'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/category/${encodeURIComponent(category.name)}`}>
      <div className="
        min-w-[180px] h-[200px]
        sm:min-w-[220px] sm:h-[240px]
        md:min-w-[260px] md:h-[280px]
        bg-white/95 rounded-2xl overflow-hidden shadow-lg 
        transition-all duration-300 cursor-pointer 
        hover:shadow-xl
        flex-shrink-0
      ">
        {/* Image Section */}
        <div className="h-[120px] sm:h-[140px] md:h-[160px] overflow-hidden relative bg-gray-100">
          <img
            src={category.image || getImageUrl(category.imageId)}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="px-3 py-3 bg-white h-20 flex flex-col justify-center">
          <h3 className="text-sm sm:text-base font-bold mb-1 text-black text-center line-clamp-2">
            {category.name}
          </h3>
          <p className="text-black/90 text-xs sm:text-sm leading-tight text-center line-clamp-1">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}