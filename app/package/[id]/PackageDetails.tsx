'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPackageById, getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

export default function PackageDetails() {
  const params = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        if (params.id) {
          const response = await getPackageById(params.id as string);
          setPackageData(response as Package);
        }
      } catch (error) {
        console.error('Error fetching package:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [params.id]);

  const bookPackage = () => {
    if (!packageData) return;

    const whatsappMessage = encodeURIComponent(
      `Hi! I'm interested in booking the following package:\n\n` +
      `Package: ${packageData.title}\n` +
      `Duration: ${packageData.duration}\n` +
      `Price: ₹${packageData.price}\n\n` +
      `Please provide me with more details and booking information.`
    );

    const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const makeInquiry = () => {
    if (!packageData) return;

    const whatsappMessage = encodeURIComponent(
      `Hi! I have some questions about the following package:\n\n` +
      `Package: ${packageData.title}\n` +
      `Price: ₹${packageData.price}\n\n` +
      `Could you please provide more information?`
    );

    const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const contactPackage = () => {
    if (!packageData) return;

    const whatsappMessage = encodeURIComponent(
      `Hi! I would like to inquire about:\n\n` +
      `Package: ${packageData.title}\n` +
      `Duration: ${packageData.duration}\n` +
      `Price: ₹${packageData.price}\n\n` +
      `Please contact me with more details.`
    );

    const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift"></div>
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Package Not Found</h1>
            <p>The package you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="unified-background min-h-screen bg-cover bg-center bg-fixed animate-background-move relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-gray-700/30 animate-gradient-shift"></div>

      <div className="relative z-10 pt-20">
        <div className="max-w-6xl mx-auto px-5 py-8">
          <div className="bg-white/95 rounded-3xl overflow-hidden shadow-2xl">
            {/* Package Header - Image Carousel */}
            {(() => {
              const images = packageData.imageIds?.length ? packageData.imageIds : (packageData.imageId ? [packageData.imageId] : []);
              const hasMultipleImages = images.length > 1;

              return (
                <div className="relative w-full h-64 md:h-80 lg:h-96 overflow-hidden">
                  <img
                    src={getImageUrl(images[currentImageIndex])}
                    alt={`${packageData.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {/* Price Badge */}
                  <div className="absolute top-5 right-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-3xl font-bold text-lg shadow-lg">
                    ₹{parseInt(packageData.price).toLocaleString()}
                  </div>

                  {/* Navigation Arrows - REMOVED */}

                  {/* Dot Indicators */}
                  {hasMultipleImages && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentImageIndex
                            ? 'bg-yellow-400 scale-110'
                            : 'bg-white/60 hover:bg-white'
                            }`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Package Info */}
            <div className="p-8">
              {/* Title row with CTA buttons on right */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                  {packageData.title}
                </h1>
                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-2 flex-shrink-0">
                  <button
                    onClick={bookPackage}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-full font-semibold flex items-center gap-2 hover:from-green-600 hover:to-green-700 transition-all shadow-md text-sm"
                  >
                    <i className="fab fa-whatsapp"></i>
                    Book Now
                  </button>
                  <button
                    onClick={contactPackage}
                    className="bg-white border-2 border-blue-500 text-blue-600 py-2 px-4 rounded-full font-semibold flex items-center gap-2 hover:bg-blue-50 transition-all text-sm"
                  >
                    <i className="fas fa-phone-alt"></i>
                    Quick Contact
                  </button>
                  <button
                    className="bg-white border-2 border-red-400 text-red-500 py-2 px-4 rounded-full font-semibold flex items-center gap-2 hover:bg-red-50 transition-all text-sm"
                  >
                    <i className="fas fa-heart"></i>
                    Wishlist
                  </button>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {packageData.subtitle}
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  <i className="fas fa-clock"></i>
                  <span>{packageData.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  <i className="fas fa-tag"></i>
                  <span className="capitalize">{packageData.category}</span>
                </div>
              </div>
            </div>

            {/* Package Content Tabs */}
            <div className="bg-white/95 rounded-2xl shadow-lg overflow-hidden mx-5 md:mx-0">
              <div className="flex flex-wrap border-b border-gray-100">
                {['Overview', 'Itinerary', 'Inclusions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={`flex-1 py-4 px-6 text-sm md:text-base font-semibold transition-all duration-300 ${activeTab === tab.toLowerCase()
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8 min-h-[400px]">
                {(() => {
                  // Parse description for Day wise itinerary
                  const lines = packageData.description.split(/\r?\n/).filter(line => line.trim() !== '');
                  const dayRegex = /^Day\s+(\d+)/i;

                  const overview: string[] = [];
                  const itinerary: { title: string; details: string[] }[] = [];
                  let currentDay: { title: string; details: string[] } | null = null;

                  lines.forEach(line => {
                    if (dayRegex.test(line)) {
                      if (currentDay) {
                        itinerary.push(currentDay);
                      }
                      currentDay = { title: line, details: [] };
                    } else if (currentDay) {
                      currentDay.details.push(line);
                    } else {
                      overview.push(line);
                    }
                  });

                  if (currentDay) {
                    itinerary.push(currentDay);
                  }

                  // Force show overview in Overview Tab
                  if (activeTab === 'overview') {
                    return (
                      <div className="space-y-4 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Tour Overview</h3>
                        <div className="text-gray-700 leading-relaxed space-y-2 text-base">
                          {overview.length > 0 ? (
                            overview.map((line, idx) => <div key={idx}>{line}</div>)
                          ) : (
                            <p>No overview available.</p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Force show itinerary in Itinerary Tab
                  if (activeTab === 'itinerary') {
                    // Use the new itinerary field if available, otherwise fall back to parsed description
                    const hasItineraryField = packageData.itinerary && packageData.itinerary.length > 0;

                    return (
                      <div className="animate-fadeIn">
                        <div className="flex items-center mb-6">
                          <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-map-marked-alt text-lg"></i>
                          </span>
                          <h3 className="text-2xl font-bold text-gray-800">Tour Itinerary</h3>
                        </div>
                        <div className="space-y-4">
                          {hasItineraryField ? (
                            packageData.itinerary!.map((item, idx) => (
                              <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
                                <div className="flex items-center p-4 bg-gray-50">
                                  <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm mr-3">
                                    {idx + 1}
                                  </span>
                                  <span className="font-semibold text-gray-800 text-lg">Day {idx + 1}</span>
                                </div>
                                <div className="p-4 bg-white border-t border-gray-100 text-gray-600">
                                  <div className="pl-11 relative">
                                    <span className="absolute left-4 top-2.5 w-1.5 h-1.5 bg-blue-200 rounded-full"></span>
                                    {item}
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : itinerary.length > 0 ? (
                            itinerary.map((day, idx) => (
                              <ItineraryItem key={idx} day={day} index={idx} />
                            ))
                          ) : (
                            <p className="text-gray-500 italic">No specific itinerary details provided. Please check the overview.</p>
                          )}
                        </div>
                      </div>
                    );
                  }

                  // Inclusions Tab
                  if (activeTab === 'inclusions') {
                    return (
                      <div className="animate-fadeIn">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">What's Included</h3>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {packageData.whatsIncluded.map((item: string, index: number) => (
                            <li key={index} className="flex items-start space-x-3 bg-green-50 p-3 rounded-lg">
                              <i className="fas fa-check-circle text-green-500 text-xl mt-0.5"></i>
                              <span className="text-gray-700 font-medium">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>

            {/* Map Section */}
            <div className="p-8 mt-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="fas fa-map-marker-alt text-red-500"></i>
                Destination Map
              </h3>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(packageData.title + ' ' + packageData.category + ' India')}`}
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
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

interface ItineraryItemProps {
  day: { title: string; details: string[] };
  index: number;
}

function ItineraryItem({ day, index }: ItineraryItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-md transition-shadow duration-300">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
            {index + 1}
          </span>
          <span className="font-semibold text-gray-800 text-lg">{day.title}</span>
        </div>
        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="p-4 bg-white border-t border-gray-100 text-gray-600 space-y-2">
          {day.details.length > 0 ? (
            day.details.map((detail, idx) => (
              <div key={idx} className="pl-11 relative">
                <span className="absolute left-4 top-2.5 w-1.5 h-1.5 bg-blue-200 rounded-full"></span>
                {detail}
              </div>
            ))
          ) : (
            <div className="pl-11 text-gray-400 italic">No details provided for this day.</div>
          )}
        </div>
      </div>
    </div>
  );
}