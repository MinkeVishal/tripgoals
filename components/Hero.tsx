'use client';

import FloatingButtons from "./FloatingButtons";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="h-[42vh] flex items-center justify-center text-center relative z-10 pt-12"
    >
      <div className="max-w-6xl mx-auto px-5 relative z-20">
        <h1 className="text-4xl md:text-5xl font-bold font-dancing-script text-black mb-4 animate-fade-in-up">
          <span className="bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
            Discover Incredible India
          </span>
        </h1>
        <p className="text-lg md:text-xl text-black/95 mb-8 leading-relaxed animate-fade-in-up text-shadow-sm">
          Experience the magic of India with our travel packages
        </p>
        
        <button 
          onClick={() => scrollToSection('packages')}
          className="bg-gradient-to-r from-white to-gray-300 text-black border-none px-10 py-4 text-lg rounded-full cursor-pointer transition-all duration-300 font-semibold inline-flex items-center space-x-2 animate-fade-in-up hover:from-gray-200 hover:to-gray-400 hover:-translate-y-0.5 shadow-lg hover:shadow-black/40"
        >
          <span>Explore All Packages</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
      <FloatingButtons/>
    </section>
  );
}