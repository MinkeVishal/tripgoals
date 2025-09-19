'use client';

import { useEffect, useState } from 'react';
import { getPackages } from '@/lib/appwrite';
import { Package } from '@/types';

export default function AllPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await getPackages();
        setPackages(response.documents as Package[]);
        setFilteredPackages(response.documents as Package[]);
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  useEffect(() => {
    let filtered = packages.filter(pkg => {
      const matchesSearch = pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !categoryFilter || pkg.category === categoryFilter;
      
      let matchesPrice = true;
      if (priceFilter) {
        const price = parseInt(pkg.price);
        switch(priceFilter) {
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
      
      return matchesSearch && matchesCategory && matchesPrice;
    });
    
    setFilteredPackages(filtered);
  }, [packages, searchTerm, categoryFilter, priceFilter]);

  const bookPackage = (packageId: string) => {
    const pkg = packages.find(p => p.$id === packageId);
    if (!pkg) return;
    
    const whatsappMessage = encodeURIComponent(
      `Hi! I'm interested in booking the following package:\n\n` +
      `Package: ${pkg.title}\n` +
      `Duration: ${pkg.days} days\n` +
      `Price: ₹${pkg.price}\n\n` +
      `Please provide me with more details and booking information.`
    );
    
    const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift"></div>
      
      <div className="relative z-10">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-black/70 via-black/40 to-black/60 text-white py-20 text-center relative z-10">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              All Travel Packages
            </h1>
            <p className="text-lg md:text-xl opacity-90 drop-shadow-md">
              Discover amazing destinations across India
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="bg-white/50 py-10 sticky top-10 z-10 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-5">
            <div className="flex flex-col md:flex-row justify-center items-center space-y-1 md:space-y-0 md:space-x-2">
              <input 
                type="text" 
                placeholder="Search packages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 min-w-[200px]"
              />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 min-w-[200px]"
              >
                <option value="">All Categories</option>
                <option value="popular">Popular</option>
                <option value="special">Special</option>
                <option value="adventure">Adventure</option>
              </select>
              <select 
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="px-2 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500 min-w-[200px]"
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
                  >
                    <div className="h-[200px] overflow-hidden relative">
                      <img 
                        src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/images/files/${pkg.imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
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
                          <span>{pkg.days} days</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => {
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
          background-image: url('https://images.unsplash.com/photo-1580475805491-3b1b70c4ef86?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
        }
      `}</style>
    </div>
  );
}