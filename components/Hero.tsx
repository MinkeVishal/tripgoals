'use client';

import { useEffect, useState, FormEvent } from 'react';
import FloatingButtons from './FloatingButtons';
import { getBanner, getImageUrl, getPackages } from '@/lib/appwrite';
import { Banner, Package } from '@/types';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [destination, setDestination] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [duration, setDuration] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [carType, setCarType] = useState('');
  const [customCar, setCustomCar] = useState('');
  const [durations, setDurations] = useState<string[]>([]);
  const router = useRouter();

  // Array of images from public folder
  const slideshowImages = [
    '/1.jpeg',
    '/2.jpeg',
    '/3.jpeg',
    '/4.jpeg',
    '/5.jpeg',
    '/6.jpeg',
    '/7.jpeg',
    '/8.jpeg',
    '/9.jpeg',
    '/10.jpeg',
    '/11.jpeg',
    '/12.jpeg',
    '/13.jpeg',
    '/14.jpeg',
    '/15.jpeg',
    '/16.jpeg',
    '/17.jpeg',
    '/18.jpeg',
    '/19.jpeg',
    '/20.jpeg',
    '/21.jpeg',
    '/22.jpeg',
    '/23.jpeg',
  ];

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBanner();
        setBanner(data);
      } catch (error) {
        console.error('Error loading banner:', error);
      }
    };

    const fetchDurations = async () => {
      try {
        const packagesData = await getPackages();
        const uniqueDurations = [...new Set(packagesData.documents.map((pkg: Package) => pkg.duration).filter(Boolean))];
        setDurations(uniqueDurations);
      } catch (error) {
        console.error('Error loading durations:', error);
      }
    };

    fetchBanner();
    fetchDurations();
  }, []);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 6000); // Change image every 6 seconds

    return () => clearInterval(interval);
  }, [slideshowImages.length]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Handles the lower form (destination, date, duration)
  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (fromDate) params.append('fromDate', fromDate);
    if (toDate) params.append('toDate', toDate);
    if (duration) params.append('duration', duration);
    router.push(`/packages?${params.toString()}`);
  };

  // Quick search handler
  const handleQuickSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/packages?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  const backgroundImage = slideshowImages[currentImageIndex];

  return (
    <section
      id="home"
      className="w-full min-h-48 md:min-h-56 lg:h-96 flex items-center justify-center relative z-10 overflow-hidden pt-20 sm:pt-24 md:pt-28 lg:pt-16 pb-8 lg:pb-12"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', transition: 'background-image 0.8s ease-in-out' }}
      suppressHydrationWarning
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/40" aria-hidden></div>
      <div className="max-w-7xl mx-auto px-4 lg:px-5 relative z-20 w-full h-full flex flex-col items-center justify-center" suppressHydrationWarning>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-3 items-start lg:items-center w-full pt-2 md:pt-2 lg:pt-4" suppressHydrationWarning>
          {/* Left Side - Title and Button */}
          <div className="text-center lg:text-left py-2 lg:py-0">
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold font-dancing-script text-white drop-shadow mb-1 lg:mb-2 animate-fade-in-up">
              {banner?.title || 'Discover Incredible India'}
            </h1>
            <p className="text-xs md:text-sm lg:text-base text-yellow-200/95 mb-2 lg:mb-3 leading-relaxed animate-fade-in-up text-shadow-sm">
              {banner?.subtitle || 'Experience the magic of India with our travel packages'}
            </p>

            <button
              onClick={() => scrollToSection('packages')}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-none px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm rounded-full cursor-pointer transition-all duration-300 font-semibold inline-flex items-center space-x-2 animate-fade-in-up hover:from-gray-200 hover:to-gray-400 hover:-translate-y-0.5 shadow-lg hover:shadow-black/40"
            >
              <span>{banner?.ctaLabel || 'Explore All Packages'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* Right Side - Search Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg lg:rounded-xl p-2 lg:p-3 shadow-lg animate-fade-in-up max-w-sm lg:max-w-none">
            <h3 className="text-xs lg:text-sm font-bold text-white mb-1.5 lg:mb-2">Search Your Dream Place</h3>

            {/* Quick Search Bar */}
            <form onSubmit={handleQuickSearch} className="relative mb-3">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-xs"></i>
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/20 border border-white/30 text-white rounded-lg pl-8 pr-20 py-2 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-xs"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold px-3 py-1 rounded-md hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 text-xs"
              >
                Search
              </button>
            </form>


            <form onSubmit={handleSearch} className="space-y-1 lg:space-y-1.5">
              {/* From Where and To Where */}
              <div className="flex items-end gap-2">
                <div className="flex flex-col flex-1">
                  <label className="text-white text-xs font-semibold mb-0.5">From</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-white/20 border border-white/30 text-black rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-xs w-full"
                  >
                    <option value="">Select...</option>
                    <option value="Goa">Goa</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Kashmir">Kashmir</option>
                    <option value="Himachal">Himachal Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>

                <span className="text-white text-xs font-semibold pb-2">To</span>

                <div className="flex flex-col flex-1">
                  <label className="text-white text-xs font-semibold mb-0.5">Where</label>
                  <select
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-white/20 border border-white/30 text-black rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-xs w-full"
                  >
                    <option value="">Select...</option>
                    <option value="Goa">Goa</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Kashmir">Kashmir</option>
                    <option value="Himachal">Himachal Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                  </select>
                </div>
              </div>

              {/* Start Date and End Date */}
              <div className="flex items-end gap-2">
                <div className="flex flex-col flex-1">
                  <label className="text-white text-xs font-semibold mb-0.5">Start Date</label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="bg-white/20 border border-white/30 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-xs w-full"
                    placeholder="dd-mm-yyyy"
                  />
                </div>

                <span className="text-white text-xs font-semibold pb-2">To</span>

                <div className="flex flex-col flex-1">
                  <label className="text-white text-xs font-semibold mb-0.5">End Date</label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="bg-white/20 border border-white/30 text-white rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-xs w-full"
                    placeholder="dd-mm-yyyy"
                  />
                </div>
              </div>

              {/* Duration Select */}
              <div className="flex flex-col">
                <label className="text-white text-xs font-semibold mb-0.5">Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-white/20 border border-white/30 text-black rounded-lg px-2 py-1.5 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-xs"
                >
                  <option value="">Select...</option>
                  {durations.map((dur) => (
                    <option key={dur} value={dur}>{dur}</option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold px-3 py-1.5 rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-yellow-400/30 flex items-center justify-center space-x-2 text-xs mt-1 lg:mt-2"
              >
                <i className="fas fa-search"></i>
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <FloatingButtons />
    </section>
  );
}