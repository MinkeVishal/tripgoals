'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
export default function FloatingButtons() {
  const handleWhatsAppClick = () => {
    const whatsappUrl = 'https://wa.me/917709823098';
    window.open(whatsappUrl, '_blank');
  };
  const handleInstagramClick = () => {
    const instagramUrl = 'https://www.instagram.com/trip_goals._?igsh=aWFwZ2oxMG02eHZn';
    window.open(instagramUrl, '_blank');
  };
  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col space-y-4">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg hover:-translate-y-1 hover:scale-110 hover:shadow-xl bg-green-500/90"
        aria-label="Contact us on WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
                <FontAwesomeIcon icon={faWhatsapp} />

      </button>

      {/* Instagram Button */}
      <button
        onClick={handleInstagramClick}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 backdrop-blur-md border border-white/20 shadow-lg hover:-translate-y-1 hover:scale-110 hover:shadow-xl bg-gradient-to-r from-purple-500/90 via-pink-500/90 to-orange-400/90"
        aria-label="Follow us on Instagram"
      >
        <i className="fab fa-instagram"></i>
                <FontAwesomeIcon icon={faInstagram} />
      </button>
    </div>
  );
}