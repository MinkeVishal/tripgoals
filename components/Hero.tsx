'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FloatingButtons from './FloatingButtons';
import { getBanner, getImageUrl } from '@/lib/appwrite';
import { Banner } from '@/types';
import { MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

const DESTINATIONS = [
  'Kashmir',
  'Goa',
  'Kerala',
  'Rajasthan',
  'Himachal Pradesh',
  'Varanasi',
  'Agra',
  'Darjeeling',
];

const DURATIONS = [
  { label: '1-3 Days', value: '1-3' },
  { label: '3-5 Days', value: '3-5' },
  { label: '5-7 Days', value: '5-7' },
  { label: '7-10 Days', value: '7-10' },
  { label: '10+ Days', value: '10+' },
];

export default function Hero() {
  const router = useRouter();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [duration, setDuration] = useState('');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (destination) params.append('search', destination);
    if (startDate) params.append('startDate', startDate);
    if (duration) params.append('duration', duration);
    
    router.push(`/packages?${params.toString()}`);
  };

  const backgroundImage = banner?.backgroundImageId
    ? getImageUrl(banner.backgroundImageId)
    : 'https://images.unsplash.com/photo-1601333924055-f92c327e598b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  return (
    <section id="home" className="w-full relative mb-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Banner Section - Left side */}
        <div className="lg:col-span-2 h-[350px] flex items-center justify-center relative overflow-hidden rounded-xl">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${backgroundImage})`,
            }}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-3xl mx-auto text-center px-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 drop-shadow-lg">{banner?.title || 'Discover Incredible India'}</h1>
            <p className="text-base sm:text-lg text-white mb-6 drop-shadow-lg">{banner?.subtitle || 'Experience the magic of India with our travel packages'}</p>

            <div className="flex justify-center gap-3">
              <button onClick={() => scrollToSection('packages')} className="px-4 sm:px-6 py-2 bg-yellow-400 text-black rounded-lg font-semibold text-sm hover:bg-yellow-500 transition-all shadow-lg">{banner?.ctaLabel || 'Explore Packages'}</button>
              <a href="/contact" className="px-4 sm:px-6 py-2 border-2 border-white rounded-lg text-sm text-white hover:bg-white/10 transition-all shadow-lg">Contact Us</a>
            </div>
          </div>
        </div>

        {/* Search Filter - Right side */}
        <div className="lg:col-span-1 h-fit">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-5 border-2 border-blue-100 sticky top-20">
            <h3 className="text-base font-bold text-gray-900 mb-3 text-center">Find Your Holiday</h3>
            <div className="space-y-2">
              {/* Destination */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide">
                  <MapPin className="inline h-3 w-3 mr-1" />
                  Destination
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs text-gray-700 font-medium transition-all"
                >
                  <option value="">Select...</option>
                  {DESTINATIONS.map((dest) => (
                    <option key={dest} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide">
                  <Calendar className="inline h-3 w-3 mr-1" />
                  From
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs text-gray-700 font-medium transition-all"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-0.5 uppercase tracking-wide">
                  <Clock className="inline h-3 w-3 mr-1" />
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-2.5 py-1.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-xs text-gray-700 font-medium transition-all"
                >
                  <option value="">Select...</option>
                  {DURATIONS.map((dur) => (
                    <option key={dur.value} value={dur.value}>
                      {dur.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-1.5 px-3 rounded-lg transition-all duration-300 hover:shadow-lg text-xs mt-1"
              >
                Search
              </button>

              {/* Explore Themes Link */}
              <button
                type="button"
                onClick={() => router.push('/categories')}
                className="w-full flex items-center justify-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Explore Themes
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}