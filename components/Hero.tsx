'use client';

import { useEffect, useState } from 'react';
import FloatingButtons from './FloatingButtons';
import { getBanner, getImageUrl } from '@/lib/appwrite';
import { Banner } from '@/types';

export default function Hero() {
  const [banner, setBanner] = useState<Banner | null>(null);

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

  const backgroundImage = banner?.backgroundImageId
    ? getImageUrl(banner.backgroundImageId)
    : 'https://images.unsplash.com/photo-1601333924055-f92c327e598b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <section 
      id="home" 
      className="h-[42vh] flex items-center justify-center text-center relative z-10 pt-12"
      style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-white/5" aria-hidden></div>
      <div className="max-w-6xl mx-auto px-5 relative z-20">
        <h1 className="text-4xl md:text-5xl font-bold font-dancing-script text-white drop-shadow mb-4 animate-fade-in-up">
          <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
            {banner?.title || 'Discover Incredible India'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-yellow-200/95 mb-8 leading-relaxed animate-fade-in-up text-shadow-sm">
          {banner?.subtitle || 'Experience the magic of India with our travel packages'}
        </p>
        
        <button 
          onClick={() => scrollToSection('packages')}
          className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black border-none px-10 py-4 text-lg rounded-full cursor-pointer transition-all duration-300 font-semibold inline-flex items-center space-x-2 animate-fade-in-up hover:from-gray-200 hover:to-gray-400 hover:-translate-y-0.5 shadow-lg hover:shadow-black/40"
        >
          <span>{banner?.ctaLabel || 'Explore All Packages'}</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
      <FloatingButtons/>
    </section>
  );
}