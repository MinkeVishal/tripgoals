'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { getPackages, getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

// Hardcoded adventure activities (original ones)
const hardcodedAdventures = [
    {
        id: '201',
        title: "Malvan Water Sports",
        subtitle: "Exciting water activities at Malvan beach",
        image: "https://cdn.thegoavilla.com/static/img/articles/goa-water-sports.jpg",
        price: "3500",
        duration: "1 day",
        description: "Experience thrilling water sports at Malvan beach including jet skiing, parasailing, and scuba diving.",
    },
    {
        id: '202',
        title: "Goa Water Activities",
        subtitle: "Beach fun and water sports in Goa",
        image: "https://goabeachwatersports.com/wp-content/uploads/2018/11/parasailing-in-goa-1532506746-e1576503895532.jpg",
        price: "4000",
        duration: "1 day",
        description: "Enjoy various water activities on Goa's beautiful beaches. Perfect for adventure enthusiasts.",
    },
    {
        id: '203',
        title: "Paragliding",
        subtitle: "Soar through the skies",
        image: "https://cdn.pixabay.com/photo/2015/03/31/18/47/paraglider-701440_1280.jpg",
        price: "2500",
        duration: "1 day",
        description: "Experience the thrill of paragliding with certified instructors. Soar above beautiful landscapes.",
    },
    {
        id: '204',
        title: "Bungee Jumping",
        subtitle: "Ultimate adrenaline rush",
        image: "https://miro.medium.com/v2/resize:fit:669/1*tmHq_5mEp_OrXjJ0BuoI8w.jpeg",
        price: "4000",
        duration: "1 day",
        description: "Take the ultimate leap of faith with India's highest bungee jump. Feel the adrenaline rush like never before.",
    },
    {
        id: '205',
        title: "Rappelling",
        subtitle: "Descend cliff faces",
        image: "https://images.unsplash.com/photo-1557685888-2d3621ddf615?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        price: "2000",
        duration: "1 day",
        description: "Learn the art of rappelling and descend cliff faces safely with professional guidance.",
    },
    {
        id: '206',
        title: "Kashmir Gondola Ride",
        subtitle: "Scenic cable car rides",
        image: "https://charzanholidays.com/wp-content/uploads/2024/07/Gulmarg.jpg",
        price: "1500",
        duration: "1 day",
        description: "Enjoy breathtaking views of Kashmir from the famous Gulmarg Gondola, one of the highest cable cars in the world.",
    },
    {
        id: '207',
        title: "River Rafting",
        subtitle: "Navigate thrilling rapids",
        image: "https://images.unsplash.com/photo-1629248457649-b082812aea6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cml2ZXIlMjByYWZ0aW5nfGVufDB8fDB8fHww",
        price: "3000",
        duration: "1 day",
        description: "Experience the thrill of white water rafting through exciting rapids with professional guides.",
    },
    {
        id: '208',
        title: "Rock Climbing",
        subtitle: "Scale challenging rock faces",
        image: "https://27crags.s3.amazonaws.com/photos/000/384/384110/size_m-60cb2f6afd63676c62143b6984f08253.jpg",
        price: "2500",
        duration: "1 day",
        description: "Challenge yourself with rock climbing on natural rock formations with expert instruction.",
    },
    {
        id: '209',
        title: "Scuba Diving",
        subtitle: "Explore underwater marine life",
        image: "https://plus.unsplash.com/premium_photo-1661894232140-73d96a67731b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2N1YmElMjBkaXZpbmd8ZW58MHx8MHx8fDA%3D",
        price: "5000",
        duration: "1 day",
        description: "Discover the underwater world with certified scuba diving experiences in crystal clear waters.",
    },
    {
        id: '210',
        title: "Zip Lining",
        subtitle: "High-speed canopy adventures",
        image: "https://images.unsplash.com/photo-1675259113512-db50297ce326?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8emlwJTIwbGluaW5nfGVufDB8fDB8fHww",
        price: "1800",
        duration: "1 day",
        description: "Zip through forest canopies at high speeds for an exhilarating adventure experience.",
    }
];

function AllAdventureContent() {
    const [dbAdventures, setDbAdventures] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchAdventures = async () => {
            try {
                const response = await getPackages(100, 'adventure');
                setDbAdventures(response.documents as Package[]);
            } catch (error) {
                console.error('Error fetching adventures:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdventures();
    }, []);

    // Filter both hardcoded and database adventures
    const filteredHardcoded = hardcodedAdventures.filter(activity =>
        activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredDb = dbAdventures.filter(pkg =>
        pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (pkg.subtitle && pkg.subtitle.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const bookActivity = (title: string, duration: string, price: string) => {
        const whatsappMessage = encodeURIComponent(
            `Hi! I'm interested in booking the following activity:\n\n` +
            `Activity: ${title}\n` +
            `Duration: ${duration}\n` +
            `Price: ₹${parseInt(price).toLocaleString()}\n\n` +
            `Please provide me with more details and booking information.`
        );

        const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const bookPackage = (pkg: Package) => {
        const whatsappMessage = encodeURIComponent(
            `Hi! I'm interested in booking the following activity:\n\n` +
            `Activity: ${pkg.title}\n` +
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
                        <h1 className="text-2xl md:text-4xl mb-2 drop-shadow-lg">Adventure Activities</h1>
                        <p className="text-lg md:text-xl opacity-90 drop-shadow-md text-orange-400">
                            Thrilling experiences for the brave
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
                                    placeholder="Search adventures..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl text-sm bg-white transition-colors focus:outline-none focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Adventure Grid */}
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
                                {/* Hardcoded adventures */}
                                {filteredHardcoded.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="bg-white/95 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer relative hover:-translate-y-1 hover:shadow-xl"
                                        onClick={() => bookActivity(activity.title, activity.duration, activity.price)}
                                    >
                                        <div className="aspect-[4/3] overflow-hidden relative">
                                            <img
                                                src={activity.image}
                                                alt={activity.title}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                            />
                                            <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-2xl font-semibold text-sm">
                                                ₹{parseInt(activity.price).toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h3 className="text-lg font-semibold mb-2 text-gray-800">{activity.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4">{activity.subtitle}</p>
                                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                                <div className="flex items-center space-x-2">
                                                    <i className="fas fa-clock text-blue-500"></i>
                                                    <span>{activity.duration}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    bookActivity(activity.title, activity.duration, activity.price);
                                                }}
                                                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white border-none px-6 py-3 rounded-full cursor-pointer font-semibold inline-flex items-center justify-center space-x-2 transition-all duration-300 hover:from-green-600 hover:to-green-500 hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/30"
                                            >
                                                <i className="fab fa-whatsapp"></i>
                                                <span>Book Now</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* Database adventures */}
                                {filteredDb.map((pkg) => (
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

                        {filteredHardcoded.length === 0 && filteredDb.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <p className="text-xl text-black/70">No adventure activities found matching your search.</p>
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

export default function AllAdventurePage() {
    return (
        <Suspense fallback={<div className="min-h-screen pt-20"></div>}>
            <AllAdventureContent />
        </Suspense>
    );
}
