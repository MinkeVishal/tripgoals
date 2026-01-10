'use client';

import { useEffect, useState, FormEvent } from 'react';
import FloatingButtons from './FloatingButtons';
import { getBanner, getImageUrl } from '@/lib/appwrite';
import { Banner } from '@/types';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [destination, setDestination] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [duration, setDuration] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const data = await getBanner();
        setBanner(data);
      } catch (error) {
        console.error('Error loading banner:', error);
      }
    };

    fetchBanner();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (fromDate) params.append('fromDate', fromDate);
    if (duration) params.append('duration', duration);
    
    router.push(`/packages?${params.toString()}`);
  };

  const backgroundImage = banner?.backgroundImageId
    ? getImageUrl(banner.backgroundImageId)
    : 'https://images.unsplash.com/photo-1601333924055-f92c327e598b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <section 
      id="home" 
      className="h-96 flex items-center justify-center relative z-10 pt-12"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/5" aria-hidden></div>
      <div className="max-w-7xl mx-auto px-5 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left Side - Title and Button */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold font-dancing-script text-white drop-shadow mb-3 animate-fade-in-up">
              <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
                {banner?.title || 'Discover Incredible India'}
              </span>
            </h1>
            <p className="text-base md:text-lg text-yellow-200/95 mb-6 leading-relaxed animate-fade-in-up text-shadow-sm">
              {banner?.subtitle || 'Experience the magic of India with our travel packages'}
            </p>
            
            <button 
              onClick={() => scrollToSection('packages')}
              className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-none px-8 py-3 text-base rounded-full cursor-pointer transition-all duration-300 font-semibold inline-flex items-center space-x-2 animate-fade-in-up hover:from-gray-200 hover:to-gray-400 hover:-translate-y-0.5 shadow-lg hover:shadow-black/40"
            >
              <span>{banner?.ctaLabel || 'Explore All Packages'}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          {/* Right Side - Search Form */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg animate-fade-in-up">
            <h3 className="text-lg font-bold text-white mb-4">Find Your Holiday Destination</h3>
            
            <form onSubmit={handleSearch} className="space-y-3">
              {/* Destination Select */}
              <div className="flex flex-col">
                <label className="text-white text-xs font-semibold mb-1">Destination</label>
                <select 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-white/20 border border-white/30 text-black rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-sm"
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

              {/* From Date */}
              <div className="flex flex-col">
                <label className="text-white text-xs font-semibold mb-1">From</label>
                <input 
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-sm"
                  placeholder="dd-mm-yyyy"
                />
              </div>

              {/* Duration Select */}
              <div className="flex flex-col">
                <label className="text-white text-xs font-semibold mb-1">Duration</label>
                <select 
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="bg-white/20 border border-white/30 text-black rounded-lg px-3 py-2 focus:outline-none focus:border-yellow-400 focus:bg-white/30 transition-all duration-300 placeholder-white/50 text-sm"
                >
                  <option value="">Select...</option>
                  <option value="3-days">3 Days</option>
                  <option value="5-days">5 Days</option>
                  <option value="7-days">7 Days</option>
                  <option value="10-days">10 Days</option>
                  <option value="15-days">15 Days</option>
                </select>
              </div>

              {/* Search Button */}
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-semibold px-4 py-2 rounded-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-yellow-400/30 flex items-center justify-center space-x-2 text-sm mt-2"
              >
                <i className="fas fa-search"></i>
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </div>
      <FloatingButtons/>
    </section>
  );
}