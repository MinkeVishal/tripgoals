'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories?filter=${category.name}`}>
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer relative min-w-[120px] flex-shrink-0 hover:-translate-y-1 hover:shadow-xl">
        <div className="h-20 overflow-hidden relative">
          <img 
            src={getImageUrl(category.imageId)} 
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
        </div>
        <div className="p-3 bg-white">
          <h3 className="text-xs font-semibold mb-1 text-black text-center">
            {category.name}
          </h3>
          <p className="text-black/90 text-[10px] leading-tight text-center">
            {category.description}
          </p>
        </div>
      </div>
    </Link>
  );
}