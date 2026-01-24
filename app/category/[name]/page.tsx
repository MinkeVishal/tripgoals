'use client';

import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getPackages, getCategories, getImageUrl } from '@/lib/appwrite';
import { Package, Category } from '@/types';

function CategoryDetailContent() {
    const params = useParams();
    const router = useRouter();
    const categoryName = decodeURIComponent(params.name as string);

    const [packages, setPackages] = useState<Package[]>([]);
    const [category, setCategory] = useState<Category | null>(null);
    const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [packagesResponse, categoriesResponse] = await Promise.all([
                    getPackages(),
                    getCategories()
                ]);

                const allPackages = packagesResponse.documents as Package[];
                const allCategories = categoriesResponse.documents as Category[];

                // Debug logging
                console.log('Category from URL:', categoryName);
                console.log('All packages:', allPackages.map(p => ({ title: p.title, category: p.category })));

                // Find the category
                const foundCategory = allCategories.find(
                    c => c.name.toLowerCase() === categoryName.toLowerCase()
                );
                setCategory(foundCategory || null);

                // Filter packages by category
                const categoryPackages = allPackages.filter(
                    pkg => pkg.category && pkg.category.toLowerCase() === categoryName.toLowerCase()
                );

                console.log('Filtered packages:', categoryPackages);

                setPackages(categoryPackages);
                setFilteredPackages(categoryPackages);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [categoryName]);

    useEffect(() => {
        const filtered = packages.filter(pkg =>
            pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pkg.subtitle && pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPackages(filtered);
    }, [searchTerm, packages]);

    const bookPackage = (pkg: Package) => {
        const whatsappMessage = encodeURIComponent(
            `Hi! I'm interested in booking the following package:\n\n` +
            `Package: ${pkg.title}\n` +
            `Duration: ${pkg.duration}\n` +
            `Price: ₹${parseInt(pkg.price).toLocaleString()}\n\n` +
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
                        <h1 className="text-2xl md:text-4xl mb-2 drop-shadow-lg capitalize">{categoryName} Packages</h1>
                        <p className="text-lg md:text-xl opacity-90 drop-shadow-md text-orange-400">
                            {category?.description || `Explore our ${categoryName} travel packages`}
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
                                    placeholder="Search packages..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Packages Grid */}
                <section className="py-10 min-h-[60vh]">
                    <div className="max-w-7xl mx-auto px-5">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
                                {[...Array(6)].map((_, i) => (
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
                                        <div className="h-[200px] overflow-hidden relative">
                                            <img
                                                src={getImageUrl(pkg.imageIds?.[0] || pkg.imageId)}
                                                alt={pkg.title}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-2xl font-semibold text-sm">
                                                ₹{parseInt(pkg.price).toLocaleString()}
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
                                                    bookPackage(pkg);
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
                                <p className="text-xl text-black/70">No packages found in this category.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <style jsx>{`
        .unified-background {
          background-image: url('https://images.unsplash.com/photo-1601333924055-f92c327e598b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
        }

        @media (max-width: 768px) {
          .unified-background {
            background-image: url('https://images.unsplash.com/photo-1662984130816-aee412d03066?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
          }
        }
      `}</style>
        </div>
    );
}

export default function CategoryDetailPage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-20"></div>}>
            <CategoryDetailContent />
        </Suspense>
    );
}
