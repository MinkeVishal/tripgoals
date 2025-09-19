'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/appwrite';
import { Category } from '@/types';
import CategoryCard from './CategoryCard';

const defaultCategories = [
  {
    $id: '1',
    name: 'Heritage & Culture',
    description: 'Explore India\'s rich cultural heritage',
    imageId: '',
    image: 'https://i.pinimg.com/736x/4b/84/89/4b84892bb493ca6443d5f47cb9a1c6b2.jpg'
  },
  {
    $id: '2',
    name: 'Beach & Island',
    description: 'Pristine beaches and tropical islands',
    imageId: '',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6Iur7LarCTXLLXanO__3qtrI9YRPKP-1P8Q&s'
  },
  {
    $id: '3',
    name: 'Pilgrimage Circuits',
    description: 'Sacred journeys and spiritual experiences',
    imageId: '',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBHHoZAYz17kWSF4-sc_y7KNkIVjkPQYY5VQ&s'
  },
  {
    $id: '4',
    name: 'Nature & Adventure',
    description: 'Thrilling adventures in nature',
    imageId: '',
    image: 'https://images.unsplash.com/vector-1751633888465-cff17f965e39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bmF0dXJlJTIwYW5kJTIwYWR2ZW50dXJlfGVufDB8MHwwfHx8MA%3D%3D'
  },
  {
    $id: '5',
    name: 'Trekking Packages',
    description: 'Mountain trails and hiking adventures',
    imageId: '',
    image: 'https://plus.unsplash.com/premium_vector-1740368682952-121172781edd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0dXJlJTIwZXhwbG9yZXJ8ZW58MHwwfDB8fHww'
  },
  {
    $id: '6',
    name: 'Wildlife & Safari',
    description: 'Encounter India\'s magnificent wildlife',
    imageId: '',
    image: 'https://plus.unsplash.com/premium_vector-1682299114007-5d64f938a262?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fHw%3D'
  },
  {
    $id: '7',
    name: 'City Gateways',
    description: 'Explore vibrant Indian cities',
    imageId: '',
    image: 'https://plus.unsplash.com/premium_vector-1711987467596-afcb8dacb343?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG11bWJhaXxlbnwwfDB8MHx8fDA%3D'
  },
  {
    $id: '8',
    name: 'Hill Stations',
    description: 'Serene mountain retreats',
    imageId: '',
    image: 'https://plus.unsplash.com/premium_vector-1719514035076-0adda2b5097a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHZpZXclMjBwb2ludCUyMGhpbGx8ZW58MHwwfDB8fHww'
  },
  {
    $id: '9',
    name: 'States',
    description: 'Discover India state by state',
    imageId: '',
    image: 'https://media.istockphoto.com/id/621577320/vector/hand-drawn-india-skyline-vector-illustration.jpg?s=612x612&w=0&k=20&c=24KmWdqzLU8jMTmHNoZrNm-LcQfmQFwLGC40jMZsLoc='
  }
];

export default function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>(defaultCategories);
  const [loading, setLoading] = useState(false);

  const openCategoryPage = (categoryName: string) => {
    window.location.href = `/packages?category=${categoryName}`;
  };

  return (
    <section className="py-5 relative z-10">
      <div className="max-w-full mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-black mb-4">Categories</h2>
        <p className="text-center text-black/90 mb-2 text-base">Choose your travel style</p>
        
        <div className="flex space-x-4 mt-6 overflow-x-auto hide-scrollbar py-2">
          {categories.map((category) => (
            <div 
              key={category.$id}
              onClick={() => openCategoryPage(category.name)}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden shadow-lg transition-all duration-300 cursor-pointer relative min-w-[120px] flex-shrink-0 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-20 overflow-hidden relative">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <div className="p-3 bg-white">
                <h3 className="text-xs font-semibold mb-1 text-black text-center">
                  {category.name}
                </h3>
                <p className="text-black/90 text-[10px] leading-tight text-center">
                  {category.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}