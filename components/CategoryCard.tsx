'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Category } from '@/types';
import { Clock, IndianRupee, ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/packages?category=${category.name}`}>
      <div className="
        min-w-[280px] w-[280px] h-[380px] 
        bg-white rounded-xl overflow-hidden shadow-lg 
        transition-all duration-300 cursor-pointer 
        hover:-translate-y-2 hover:shadow-2xl
        flex-shrink-0 group
        border border-gray-100 flex flex-col
      ">
        {/* Image Section */}
        <div className="h-44 overflow-hidden relative flex-shrink-0">
          <img
            src={category.image || getImageUrl(category.imageId)}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Overlays */}
          {category.subtitle && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
              <p className="text-white text-xs font-medium tracking-wide">
                {category.subtitle}
              </p>
            </div>
          )}
          {category.duration && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center space-x-1">
              <Clock size={12} className="text-yellow-400" />
              <p className="text-white text-xs font-bold">{category.duration}</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {category.name}
            </h3>
            {category.price && (
              <div className="flex items-center text-green-600 font-bold bg-green-50 px-2 py-1 rounded-lg">
                <IndianRupee size={14} />
                <span className="text-sm">{category.price}</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {category.description}
          </p>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Explore
            </span>
            <button className="bg-blue-600 group-hover:bg-blue-700 text-white p-2 rounded-full transition-colors">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}