'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/appwrite';
import { Category } from '@/types';
import CategoryCard from './CategoryCard';

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.documents as Category[]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-5 relative z-10">
      <div className="max-w-full mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-white mb-4">Categories</h2>
        <p className="text-center text-yellow-600 mb-2 text-base">Choose your travel style</p>

        <div className="flex space-x-4 mt-6 overflow-x-auto hide-scrollbar py-2">
          {categories.map((category) => (
            //@ts-ignore
            <CategoryCard key={category.$id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}