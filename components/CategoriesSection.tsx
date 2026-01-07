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

  const openCategoryPage = (categoryName: string) => {
    window.location.href = `/packages?category=${categoryName}`;
  };

  if (loading) {
    return (
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Explore by Category</h2>
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-6 min-w-min">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-48 w-48 bg-gray-100 rounded-lg animate-pulse flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 animate-fadeIn">Explore by Category</h2>
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-6 min-w-min">
            {categories.map((cat) => (
              <div key={cat.$id} className="flex-shrink-0 w-48">
                <CategoryCard category={cat} onClick={() => openCategoryPage(cat.name)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}