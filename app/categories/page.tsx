'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCategories } from '@/lib/appwrite';
import { Category } from '@/types';
import CategoryCard from '@/components/CategoryCard';
import { Search } from 'lucide-react';

function AllCategoriesContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        const docs = response.documents as Category[];
        setCategories(docs);
        setFilteredCategories(docs);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const filtered = categories.filter(cat =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  return (
    <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift mb-0"></div>

      <div className="relative z-10">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-black/70 via-black/40 to-black/60 text-yellow-400 py-20 text-center relative z-10">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl md:text-4xl mb-2 drop-shadow-lg">All Categories</h1>
            <p className="text-lg md:text-xl opacity-90 drop-shadow-md text-orange-400">
              Choose your travel style
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white/50 py-3 sticky z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-10 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-5">
            {loading ? (
              <div className="flex flex-wrap justify-center gap-8 py-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="min-w-[280px] w-[280px] h-[380px] bg-white/95 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center gap-8 py-8">
                {filteredCategories.map((category) => (
                  // @ts-ignore
                  <CategoryCard key={category.$id} category={category} />
                ))}
              </div>
            )}

            {filteredCategories.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-xl text-black/70">No categories found matching your search.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style jsx>{`
        .unified-background {
          background-image: url('https://images.unsplash.com/photo-1601333924055-f92c327e598b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); /* default: desktop */
        }

        /* For tablets and smaller screens */
        @media (max-width: 768px) {
          .unified-background {
            background-image: url('https://images.unsplash.com/photo-1662984130816-aee412d03066?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
          }
        }
      `}</style>
    </div>
  );
}

export default function AllCategoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20"></div>}>
      <AllCategoriesContent />
    </Suspense>
  );
}