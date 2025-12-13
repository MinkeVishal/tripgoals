'use client';

import { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';

interface Place {
  id: number;
  name: string;
  location: string;
  description: string;
  imageUrl: string;
  coordinates: { x: number; y: number }; // percentage based positioning
}

const places: Place[] = [
  {
    id: 1,
    name: 'Kashmir',
    location: 'Jammu & Kashmir',
    description: 'Paradise on Earth with breathtaking valleys, Dal Lake, and snow-capped mountains.',
    imageUrl: 'https://images.unsplash.com/photo-1567601169793-64703dc5324a?w=400&h=300&fit=crop',
    coordinates: { x: 35, y: 15 }
  },
  {
    id: 2,
    name: 'Goa',
    location: 'Goa',
    description: 'Beautiful beaches, vibrant nightlife, Portuguese architecture, and water sports.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop',
    coordinates: { x: 28, y: 60 }
  },
  {
    id: 3,
    name: 'Kerala',
    location: 'Kerala',
    description: 'Gods Own Country with backwaters, houseboats, spice plantations, and beaches.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop',
    coordinates: { x: 32, y: 78 }
  },
  {
    id: 4,
    name: 'Rajasthan',
    location: 'Rajasthan',
    description: 'Royal palaces, desert safaris, colorful culture, and historic forts.',
    imageUrl: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=400&h=300&fit=crop',
    coordinates: { x: 25, y: 35 }
  },
  {
    id: 5,
    name: 'Himachal Pradesh',
    location: 'Himachal Pradesh',
    description: 'Hill stations, adventure sports, monasteries, and scenic mountain views.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop',
    coordinates: { x: 33, y: 22 }
  },
  {
    id: 6,
    name: 'Varanasi',
    location: 'Uttar Pradesh',
    description: 'Ancient spiritual city, Ganges ghats, temples, and cultural heritage.',
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop',
    coordinates: { x: 52, y: 38 }
  },
  {
    id: 7,
    name: 'Agra',
    location: 'Uttar Pradesh',
    description: 'Home to the iconic Taj Mahal, Agra Fort, and Mughal architecture.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400&h=300&fit=crop',
    coordinates: { x: 44, y: 32 }
  },
  {
    id: 8,
    name: 'Darjeeling',
    location: 'West Bengal',
    description: 'Tea gardens, toy train, Himalayan views, and colonial charm.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop',
    coordinates: { x: 65, y: 28 }
  }
];

export default function InteractiveMap() {
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white/5 backdrop-blur-sm relative z-10">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Navigation className="h-6 w-6 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">Explore India</h2>
          </div>
          <p className="text-lg text-white/80">Click on the pins to discover amazing destinations</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-3xl p-8 shadow-2xl relative overflow-hidden" style={{ minHeight: '500px' }}>
              {/* India Map SVG Outline */}
              <svg viewBox="0 0 100 120" className="w-full h-full opacity-20 absolute inset-0">
                <path
                  d="M35,10 L40,15 L45,12 L50,18 L55,15 L60,20 L58,25 L60,30 L58,35 L55,40 L52,45 L50,50 L48,55 L45,60 L42,65 L40,70 L38,75 L36,80 L34,85 L32,90 L30,95 L28,100 L26,105 L25,110 L30,108 L35,105 L38,100 L40,95 L42,90 L45,85 L48,80 L50,75 L52,70 L54,65 L56,60 L58,55 L60,50 L62,45 L64,40 L65,35 L64,30 L62,25 L60,22 L55,20 L50,22 L45,20 L40,18 Z"
                  fill="currentColor"
                  className="text-blue-300"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>

              {/* Interactive Pins */}
              {places.map((place) => (
                <div
                  key={place.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer transition-all duration-300"
                  style={{ left: `${place.coordinates.x}%`, top: `${place.coordinates.y}%` }}
                  onClick={() => setSelectedPlace(place)}
                  onMouseEnter={() => setHoveredId(place.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative">
                    <MapPin
                      className={`h-10 w-10 transition-all duration-300 ${
                        hoveredId === place.id || selectedPlace?.id === place.id
                          ? 'text-red-500 scale-125'
                          : 'text-red-600'
                      }`}
                      fill="currentColor"
                    />
                    {(hoveredId === place.id || selectedPlace?.id === place.id) && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white px-3 py-1 rounded-lg shadow-lg whitespace-nowrap text-sm font-semibold text-gray-800 z-10">
                        {place.name}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details Panel */}
          <div className="lg:col-span-1">
            {selectedPlace ? (
              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
                <div className="relative h-48">
                  <img
                    src={selectedPlace.imageUrl}
                    alt={selectedPlace.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => setSelectedPlace(null)}
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedPlace.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {selectedPlace.location}
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-6">{selectedPlace.description}</p>
                  <button
                    onClick={() => window.location.href = '/packages'}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                  >
                    View Packages
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                <MapPin className="h-16 w-16 text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Select a Destination</h3>
                <p className="text-gray-600">Click on any pin on the map to explore details about that destination</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick List */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-white text-center mb-6">Popular Destinations</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {places.map((place) => (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                className={`bg-white/90 hover:bg-white px-4 py-3 rounded-xl text-sm font-semibold text-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                  selectedPlace?.id === place.id ? 'ring-2 ring-blue-500 bg-white' : ''
                }`}
              >
                {place.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
