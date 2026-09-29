'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getPackages, getCategories, getImageUrl } from '@/lib/appwrite';
import { Package, Category } from '@/types';

function AllPackagesContent() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [fromDateFilter, setFromDateFilter] = useState('');
  const [toDateFilter, setToDateFilter] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const [packagesRes, categoriesRes] = await Promise.all([
          getPackages(),
          getCategories()
        ]);
        setPackages(packagesRes.documents as Package[]);
        setCategories(categoriesRes.documents as Category[]);
        setFilteredPackages(packagesRes.documents as Package[]);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlDestination = searchParams.get('destination') || '';
    const urlFromDate = searchParams.get('fromDate') || '';
    const urlToDate = searchParams.get('toDate') || '';
    const urlDuration = searchParams.get('duration') || '';
    const urlCategory = searchParams.get('category') ? decodeURIComponent(searchParams.get('category')!) : '';

    setSearchTerm(urlSearch);
    setDestinationFilter(urlDestination);
    setFromDateFilter(urlFromDate);
    setToDateFilter(urlToDate);
    setDurationFilter(urlDuration);
    setCategoryFilter(urlCategory);
  }, [searchParams]);

  useEffect(() => {
    let filtered = packages.filter(pkg => {
      const title = pkg.title || '';
      const subtitle = pkg.subtitle || '';
      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subtitle.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDestination = !destinationFilter ||
        title.toLowerCase().includes(destinationFilter.toLowerCase()) ||
        subtitle.toLowerCase().includes(destinationFilter.toLowerCase());

      const matchesCategory = !categoryFilter ||
        (pkg.category && pkg.category.toLowerCase().trim() === categoryFilter.toLowerCase().trim());

      const matchesDuration = !durationFilter || pkg.duration?.includes(durationFilter.split('-')[0]);

      let matchesPrice = true;
      if (priceFilter) {
        const price = parseInt(pkg.price);
        switch (priceFilter) {
          case 'low':
            matchesPrice = price < 20000;
            break;
          case 'medium':
            matchesPrice = price >= 20000 && price <= 50000;
            break;
          case 'high':
            matchesPrice = price > 50000;
            break;
        }
      }

      return matchesSearch && matchesDestination && matchesCategory && matchesDuration && matchesPrice;
    });

    setFilteredPackages(filtered);
  }, [packages, searchTerm, destinationFilter, fromDateFilter, toDateFilter, durationFilter, categoryFilter, priceFilter]);

  const bookPackage = (packageId: string) => {
    const pkg = packages.find(p => p.$id === packageId);
    if (!pkg) return;

    const whatsappMessage = encodeURIComponent(
      `Hi! I'm interested in booking the following package:\n\n` +
      `Package: ${pkg.title}\n` +
      `Duration: ${pkg.duration}\n` +
      `Price: ₹${pkg.price}\n\n` +
      `Please provide me with more details and booking information.`
    );

    const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift mb-0"></div>

      <div className="relative z-10">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-black/70 via-black/40 to-black/60 text-yellow-400 py-20 text-center relative z-10">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl md:text-4xl mb-2 drop-shadow-lg capitalize">
              {categoryFilter ? `${categoryFilter} Packages` : 'All Travel Packages'}
            </h1>
            <p className="text-lg md:text-xl opacity-90 drop-shadow-md text-orange-400">
              Discover amazing destinations across India
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white/50 py-3 sticky z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
              <input
                type="text"
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="text"
                placeholder="Destination..."
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="date"
                placeholder="From Date..."
                value={fromDateFilter}
                onChange={(e) => setFromDateFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              />
              <input
                type="date"
                placeholder="To Date..."
                value={toDateFilter}
                onChange={(e) => setToDateFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              />
              <select
                value={durationFilter}
                onChange={(e) => setDurationFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              >
                <option value="">All Durations</option>
                <option value="3-days">3 Days</option>
                <option value="5-days">5 Days</option>
                <option value="7-days">7 Days</option>
                <option value="10-days">10 Days</option>
                <option value="15-days">15 Days</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.$id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 w-full"
              >
                <option value="">All Prices</option>
                <option value="low">Under ₹20,000</option>
                <option value="medium">₹20,000 - ₹50,000</option>
                <option value="high">Above ₹50,000</option>
              </select>
            </div>
          </div>
        </section>

        {/* All Packages Grid */}
        <section className="py-10 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-5">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="bg-white/95 rounded-2xl h-96 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.$id}
                    className="bg-white/95 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer relative hover:-translate-y-1 hover:shadow-xl"
                    onClick={() => router.push(`/package/${pkg.$id}`)}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <img
                        src={getImageUrl(pkg.imageIds?.[0] || pkg.imageId)}
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-2xl font-semibold text-sm">
                        ₹{parseInt(pkg.price).toLocaleString()}
                      </div>
                      <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-xl text-xs capitalize">
                        {pkg.category}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 text-gray-800">{pkg.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{pkg.subtitle}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-2">
                          <i className="fas fa-clock text-blue-500"></i>
                          <span>{pkg.duration}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          bookPackage(pkg.$id);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white border-none px-6 py-3 rounded-full cursor-pointer font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:from-green-600 hover:to-green-500 hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/30"
                      >
                        <i className="fab fa-whatsapp"></i>
                        <span>Book Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredPackages.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-xl text-black/70">No packages found matching your criteria.</p>
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

export default function AllPackagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-20"></div>}>
      <AllPackagesContent />
    </Suspense>
  );
}