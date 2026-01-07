'use client';

import Link from 'next/link';
import { getImageUrl } from '@/lib/appwrite';
import { Category } from '@/types';
import { useState } from 'react';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop&q=90';

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const [imageSrc, setImageSrc] = useState(() => {
    if (!category.imageId) return FALLBACK_IMAGE;
    try {
      return getImageUrl(category.imageId);
    } catch (e) {
      return FALLBACK_IMAGE;
    }
  });

  const card = (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-3 hover:scale-105 cursor-pointer animate-fadeInUp group border border-white/10">
      <div className="h-40 overflow-hidden relative bg-gray-200">
        <img
          src={imageSrc}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          style={{ backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
          onError={() => setImageSrc(FALLBACK_IMAGE)}
        />
      </div>
      <div className="p-4 bg-white transition-all duration-300 group-hover:bg-gray-50">
        <h3 className="text-base font-semibold mb-2 text-gray-900 transition-all duration-300 line-clamp-2">{category.name}</h3>
        <p className="text-sm text-gray-600 text-left transition-all duration-300 group-hover:text-gray-700 line-clamp-2">{category.description}</p>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick}>
        {card}
      </div>
    );
  }

  return (
    <Link href={`/categories?filter=${category.name}`}>
      {card}
    </Link>
  );
}