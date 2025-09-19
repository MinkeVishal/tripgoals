'use client';

import { useState } from 'react';

const adventureActivities = [
  { 
    id: 201, 
    title: "Malvan Water Sports", 
    subtitle: "Exciting water activities at Malvan beach", 
    image: "https://cdn.thegoavilla.com/static/img/articles/goa-water-sports.jpg",
    price: 3500,
    duration: 1,
    description: "Experience thrilling water sports at Malvan beach including jet skiing, parasailing, and scuba diving.",
    inclusions: ["Water sports equipment", "Safety gear", "Professional instructors", "Beach lunch", "Transportation"],
    category: "adventure"
  },
  { 
    id: 202, 
    title: "Goa Water Activities", 
    subtitle: "Beach fun and water sports in Goa", 
    image: "https://goabeachwatersports.com/wp-content/uploads/2018/11/parasailing-in-goa-1532506746-e1576503895532.jpg",
    price: 4000,
    duration: 1,
    description: "Enjoy various water activities on Goa's beautiful beaches. Perfect for adventure enthusiasts.",
    inclusions: ["Water sports", "Beach activities", "Safety equipment", "Refreshments", "Beach access"],
    category: "adventure"
  },
  { 
    id: 203, 
    title: "Paragliding", 
    subtitle: "Soar through the skies", 
    image: "https://cdn.pixabay.com/photo/2015/03/31/18/47/paraglider-701440_1280.jpg",
    price: 2500,
    duration: 1,
    description: "Experience the thrill of paragliding with certified instructors. Soar above beautiful landscapes.",
    inclusions: ["Paragliding equipment", "Certified instructor", "Safety briefing", "Video recording", "Certificate"],
    category: "adventure"
  },
  { 
    id: 204, 
    title: "Bungee Jumping", 
    subtitle: "Ultimate adrenaline rush", 
    image: "https://miro.medium.com/v2/resize:fit:669/1*tmHq_5mEp_OrXjJ0BuoI8w.jpeg",
    price: 4000,
    duration: 1,
    description: "Take the ultimate leap of faith with India's highest bungee jump. Feel the adrenaline rush like never before.",
    inclusions: ["Safety equipment", "Professional supervision", "Medical support", "Jump video", "Certificate"],
    category: "adventure"
  },
  { 
    id: 205, 
    title: "Rappelling", 
    subtitle: "Descend cliff faces", 
    image: "https://images.unsplash.com/photo-1557685888-2d3621ddf615?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: 2000,
    duration: 1,
    description: "Learn the art of rappelling and descend cliff faces safely with professional guidance.",
    inclusions: ["Rappelling gear", "Safety equipment", "Professional guide", "Training session", "Certificate"],
    category: "adventure"
  },
  { 
    id: 206, 
    title: "Kashmir Gondola Ride", 
    subtitle: "Scenic cable car rides", 
    image: "https://charzanholidays.com/wp-content/uploads/2024/07/Gulmarg.jpg",
    price: 1500,
    duration: 1,
    description: "Enjoy breathtaking views of Kashmir from the famous Gulmarg Gondola, one of the highest cable cars in the world.",
    inclusions: ["Gondola tickets", "Scenic views", "Photography opportunities", "Local guide", "Refreshments"],
    category: "adventure"
  },
  { 
    id: 207, 
    title: "River Rafting", 
    subtitle: "Navigate thrilling rapids", 
    image: "https://images.unsplash.com/photo-1629248457649-b082812aea6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cml2ZXIlMjByYWZ0aW5nfGVufDB8fDB8fHww",
    price: 3000,
    duration: 1,
    description: "Experience the thrill of white water rafting through exciting rapids with professional guides.",
    inclusions: ["Rafting equipment", "Safety gear", "Professional guide", "Lunch", "Transportation"],
    category: "adventure"
  },
  { 
    id: 208, 
    title: "Rock Climbing", 
    subtitle: "Scale challenging rock faces", 
    image: "https://27crags.s3.amazonaws.com/photos/000/384/384110/size_m-60cb2f6afd63676c62143b6984f08253.jpg",
    price: 2500,
    duration: 1,
    description: "Challenge yourself with rock climbing on natural rock formations with expert instruction.",
    inclusions: ["Climbing gear", "Safety equipment", "Expert instructor", "Training", "Certificate"],
    category: "adventure"
  },
  { 
    id: 209, 
    title: "Scuba Diving", 
    subtitle: "Explore underwater marine life", 
    image: "https://plus.unsplash.com/premium_photo-1661894232140-73d96a67731b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2N1YmElMjBkaXZpbmd8ZW58MHx8MHx8fDA%3D",
    price: 5000,
    duration: 1,
    description: "Discover the underwater world with certified scuba diving experiences in crystal clear waters.",
    inclusions: ["Diving equipment", "Certified instructor", "Underwater photography", "Marine life guide", "Certificate"],
    category: "adventure"
  },
  { 
    id: 210, 
    title: "Zip Lining", 
    subtitle: "High-speed canopy adventures", 
    image: "https://images.unsplash.com/photo-1675259113512-db50297ce326?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8emlwJTIwbGluaW5nfGVufDB8fDB8fHww",
    price: 1800,
    duration: 1,
    description: "Zip through forest canopies at high speeds for an exhilarating adventure experience.",
    inclusions: ["Zip line equipment", "Safety gear", "Professional guide", "Multiple zip lines", "Refreshments"],
    category: "adventure"
  }
];

export default function AdventureSection() {
  const bookPackage = (activityId: number) => {
    const activity = adventureActivities.find(a => a.id === activityId);
    if (!activity) return;
    
    const whatsappMessage = encodeURIComponent(
      `Hi! I'm interested in booking the following activity:\n\n` +
      `Activity: ${activity.title}\n` +
      `Duration: ${activity.duration} day\n` +
      `Price: ₹${activity.price.toLocaleString()}\n\n` +
      `Please provide me with more details and booking information.`
    );
    
    const whatsappUrl = `https://wa.me/917709823098?text=${whatsappMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id="adventure" className="py-4 relative z-10">
      <div className="max-w-full mx-auto px-5">
        <h2 className="text-xl font-bold text-center text-black mb-4">Adventure Activities</h2>
        <p className="text-center text-black/90 mb-2 text-base">Exciting adventures for thrill seekers</p>
        
        <div className="relative overflow-hidden py-1">
          <div className="flex space-x-4 overflow-x-auto hide-scrollbar py-4">
            {adventureActivities.map((activity) => (
              <div 
                key={activity.id}
                className="min-w-[180px] h-[200px] bg-white/95 rounded-2xl overflow-hidden shadow-lg transition-all duration-400 cursor-pointer relative flex-shrink-0 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="h-[120px] overflow-hidden relative">
                  <img 
                    src={activity.image} 
                    alt={activity.title}
                    className="w-full h-full object-cover transition-transform duration-400 hover:scale-110"
                  />
                  {/* <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-2xl font-semibold text-xs">
                    ₹{activity.price.toLocaleString()}
                  </div> */}
                </div>
                
                <div className="px-3 py-3 bg-white h-20 flex flex-col justify-center">
                  <h3 className="text-xs font-semibold mb-1 text-black text-center">
                    {activity.title}
                  </h3>
                  <p className="text-black/90 text-[10px] leading-tight text-center mb-2">
                    {activity.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}