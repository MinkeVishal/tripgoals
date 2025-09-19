'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPackageById, getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

export default function PackageDetails() {
  const params = useParams();
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);

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
      `Duration: ${packageData.days} days\n` +
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
            {/* Package Header */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
              <div className="relative rounded-2xl overflow-hidden h-96">
                <img 
                  src={getImageUrl(packageData.imageId)}
                  alt={packageData.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-5 right-5 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-3 rounded-3xl font-bold text-lg shadow-lg">
                  ₹{parseInt(packageData.price).toLocaleString()}
                </div>
              </div>
              
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {packageData.title}
                </h1>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {packageData.subtitle}
                </p>
                <div className="flex space-x-8">
                  <div className="flex items-center space-x-2 text-blue-600 font-medium">
                    <i className="fas fa-clock"></i>
                    <span>{packageData.days} days</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 font-medium">
                    <i className="fas fa-tag"></i>
                    <span className="capitalize">{packageData.category}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Package Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8">
              <div className="bg-white/95 p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-base">
                  {packageData.description}
                </p>
              </div>
              
              <div className="bg-white/95 p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {packageData.whatsIncluded.map((item: string, index: number) => (
                    <li key={index} className="flex items-center space-x-3">
                      <i className="fas fa-check text-green-500 text-base"></i>
                      <span className="text-gray-700 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Booking Actions */}
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6 p-8 mt-8">
              <button 
                onClick={bookPackage}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white border-none px-10 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 inline-flex items-center justify-center space-x-3 hover:from-green-600 hover:to-green-500 hover:-translate-y-0.5 shadow-lg hover:shadow-green-500/30"
              >
                <i className="fab fa-whatsapp text-xl"></i>
                <span>Book via WhatsApp</span>
              </button>
              <button 
                onClick={makeInquiry}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none px-10 py-4 rounded-full text-lg font-semibold cursor-pointer transition-all duration-300 inline-flex items-center justify-center space-x-3 hover:from-blue-600 hover:to-blue-500 hover:-translate-y-0.5 shadow-lg hover:shadow-blue-500/30"
              >
                <i className="fas fa-phone text-xl"></i>
                <span>Make Inquiry</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .unified-background {
          background-image: url('https://images.unsplash.com/photo-1580475805491-3b1b70c4ef86?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
        }
      `}</style>
    </div>
  );
}