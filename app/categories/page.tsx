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
  const [priceFilter, setPriceFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

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

  // Helper function to check price range
  const checkPriceRange = (price?: string) => {
    if (!price) return priceFilter === '';
    const numPrice = parseInt(price);
    switch (priceFilter) {
      case 'low': return numPrice <= 5000;
      case 'medium': return numPrice > 5000 && numPrice <= 15000;
      case 'high': return numPrice > 15000;
      default: return true;
    }
  };

  // Helper function to check duration
  const checkDuration = (duration?: string) => {
    if (!duration) return durationFilter === '';
    const durationLower = duration.toLowerCase();
    switch (durationFilter) {
      case 'short': return durationLower.includes('1 day') || durationLower.includes('2 day') || durationLower.includes('half');
      case 'medium': return durationLower.includes('3 day') || durationLower.includes('4 day') || durationLower.includes('5 day');
      case 'long': return durationLower.includes('week') || durationLower.includes('6 day') || durationLower.includes('7 day') || parseInt(duration) > 5;
      default: return true;
    }
  };

  useEffect(() => {
    let filtered = categories.filter(cat => {
      const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesPrice = checkPriceRange(cat.price);
      const matchesDuration = checkDuration(cat.duration);
      return matchesSearch && matchesPrice && matchesDuration;
    });

    // Sort results
    if (sortBy === 'a-z') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'z-a') {
      filtered = [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => (parseInt(a.price || '0') - parseInt(b.price || '0')));
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => (parseInt(b.price || '0') - parseInt(a.price || '0')));
    }

    setFilteredCategories(filtered);
  }, [searchTerm, categories, priceFilter, durationFilter, sortBy]);

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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Price Filter */}
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
              >
                <option value="">All Prices</option>
                <option value="low">Budget (≤₹5,000)</option>
                <option value="medium">Mid (₹5,000-₹15,000)</option>
                <option value="high">Premium (₹15,000+)</option>
              </select>

              {/* Duration Filter */}
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
              >
                <option value="">All Durations</option>
                <option value="short">Short (1-2 Days)</option>
                <option value="medium">Medium (3-5 Days)</option>
                <option value="long">Long (6+ Days)</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
              >
                <option value="">Sort By</option>
                <option value="a-z">Name (A-Z)</option>
                <option value="z-a">Name (Z-A)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
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