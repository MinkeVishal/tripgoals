'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { getPackages, getImageUrl } from '@/lib/appwrite';
import { Package } from '@/types';

// Hardcoded adventure activities (original ones)
const hardcodedAdventures = [
  {
    id: '201',
    title: "Malvan Water Sports",
    subtitle: "Exciting water activities at Malvan beach",
    image: "https://cdn.thegoavilla.com/static/img/articles/goa-water-sports.jpg",
    price: "3500",
    duration: "1 day",
  },
  {
    id: '202',
    title: "Goa Water Activities",
    subtitle: "Beach fun and water sports in Goa",
    image: "https://goabeachwatersports.com/wp-content/uploads/2018/11/parasailing-in-goa-1532506746-e1576503895532.jpg",
    price: "4000",
    duration: "1 day",
  },
  {
    id: '203',
    title: "Paragliding",
    subtitle: "Soar through the skies",
    image: "https://cdn.pixabay.com/photo/2015/03/31/18/47/paraglider-701440_1280.jpg",
    price: "2500",
    duration: "1 day",
  },
  {
    id: '204',
    title: "Bungee Jumping",
    subtitle: "Ultimate adrenaline rush",
    image: "https://miro.medium.com/v2/resize:fit:669/1*tmHq_5mEp_OrXjJ0BuoI8w.jpeg",
    price: "4000",
    duration: "1 day",
  },
  {
    id: '205',
    title: "Rappelling",
    subtitle: "Descend cliff faces",
    image: "https://images.unsplash.com/photo-1557685888-2d3621ddf615?q=80&w=685&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "2000",
    duration: "1 day",
  },
  {
    id: '206',
    title: "Kashmir Gondola Ride",
    subtitle: "Scenic cable car rides",
    image: "https://charzanholidays.com/wp-content/uploads/2024/07/Gulmarg.jpg",
    price: "1500",
    duration: "1 day",
  },
  {
    id: '207',
    title: "River Rafting",
    subtitle: "Navigate thrilling rapids",
    image: "https://images.unsplash.com/photo-1629248457649-b082812aea6c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cml2ZXIlMjByYWZ0aW5nfGVufDB8fDB8fHww",
    price: "3000",
    duration: "1 day",
  },
  {
    id: '208',
    title: "Rock Climbing",
    subtitle: "Scale challenging rock faces",
    image: "https://27crags.s3.amazonaws.com/photos/000/384/384110/size_m-60cb2f6afd63676c62143b6984f08253.jpg",
    price: "2500",
    duration: "1 day",
  },
  {
    id: '209',
    title: "Scuba Diving",
    subtitle: "Explore underwater marine life",
    image: "https://plus.unsplash.com/premium_photo-1661894232140-73d96a67731b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2N1YmElMjBkaXZpbmd8ZW58MHx8MHx8fDA%3D",
    price: "5000",
    duration: "1 day",
  },
  {
    id: '210',
    title: "Zip Lining",
    subtitle: "High-speed canopy adventures",
    image: "https://images.unsplash.com/photo-1675259113512-db50297ce326?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8emlwJTIwbGluaW5nfGVufDB8fDB8fHww",
    price: "1800",
    duration: "1 day",
  }
];

export default function AdventureSection() {
  const [dbAdventures, setDbAdventures] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAdventures = async () => {
      try {
        const response = await getPackages(10, 'adventure');
        setDbAdventures(response.documents as Package[]);
      } catch (error) {
        console.error('Error fetching adventures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdventures();
  }, []);

  // Auto-scroll slideshow
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 280;

    const interval = setInterval(() => {
      if (container) {
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const bookActivity = (title: string, duration: string, price: string) => {
    const whatsappMessage = encodeURIComponent(
      `Hi! I'm interested in booking the following activity:\n\n` +
      `Activity: ${title}\n` +
      `Duration: ${duration}\n` +
      `Price: ₹${parseInt(price).toLocaleString()}\n\n` +
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
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 overflow-x-auto hide-scrollbar py-4 scroll-smooth"
            style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
          >
            {/* Hardcoded adventures first */}
            {hardcodedAdventures.map((activity) => (
              <div
                key={activity.id}
                className="
                  min-w-[180px] h-[200px] 
                  sm:min-w-[220px] sm:h-[240px] 
                  md:min-w-[260px] md:h-[280px]
                  bg-white/95 rounded-2xl overflow-hidden shadow-lg transition-all duration-400 cursor-pointer relative flex-shrink-0 hover:shadow-xl"
                onClick={() => bookActivity(activity.title, activity.duration, activity.price)}
              >
                <div className="h-[120px] sm:h-[140px] md:h-[160px] overflow-hidden relative bg-gray-100">
                  <img
                    src={activity.image}
                    alt={activity.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="px-3 py-3 bg-white h-20 flex flex-col justify-center">
                  <h3 className="text-sm sm:text-base font-bold mb-1 text-black text-center">
                    {activity.title}
                  </h3>
                  <p className="text-black/90 text-xs sm:text-sm leading-tight text-center mb-1 line-clamp-2">
                    {activity.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Database adventures */}
            {dbAdventures.map((pkg) => (
              <Link href={`/package/${pkg.$id}`} key={pkg.$id}>
                <div
                  className="
                    min-w-[180px] h-[200px] 
                    sm:min-w-[220px] sm:h-[240px] 
                    md:min-w-[260px] md:h-[280px]
                    bg-white/95 rounded-2xl overflow-hidden shadow-lg transition-all duration-400 cursor-pointer relative flex-shrink-0 hover:shadow-xl"
                >
                  <div className="h-[120px] sm:h-[140px] md:h-[160px] overflow-hidden relative bg-gray-100">
                    <img
                      src={getImageUrl(pkg.imageIds?.[0] || pkg.imageId)}
                      alt={pkg.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="px-3 py-3 bg-white h-20 flex flex-col justify-center">
                    <h3 className="text-sm sm:text-base font-bold mb-1 text-black text-center">
                      {pkg.title}
                    </h3>
                    <p className="text-black/90 text-xs sm:text-sm leading-tight text-center mb-1 line-clamp-2">
                      {pkg.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}