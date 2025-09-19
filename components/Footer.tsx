"use client";

import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
export default function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-md text-white py-16 relative z-10 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              TripGoals
            </h3>
            <p className="text-white/80 leading-relaxed text-sm">
              Your trusted partner for incredible travel experiences across
              India. We create memories that last a lifetime.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all duration-300 text-lg hover:bg-yellow-400 hover:text-black hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all duration-300 text-lg hover:bg-yellow-400 hover:text-black hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all duration-300 text-lg hover:bg-yellow-400 hover:text-black hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faTwitter} />
              </a>
              <a
                href="#"
                className="flex items-center justify-center w-11 h-11 bg-white/10 rounded-full transition-all duration-300 text-lg hover:bg-yellow-400 hover:text-black hover:-translate-y-1"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/packages"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  All Packages
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">
              Destinations
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Kashmir
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Kerala
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Rajasthan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Goa
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-400 transition-colors text-sm"
                >
                  Himachal Pradesh
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-200">
              Contact Info
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-white/80 text-sm">
                <i className="fas fa-phone w-5 text-yellow-400"></i>
                <span>+91 77098 23098</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80 text-sm">
                <i className="fas fa-envelope w-5 text-yellow-400"></i>
                <span>tripgoals20@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-white/80 text-sm">
                <i className="fas fa-map-marker-alt w-5 text-yellow-400"></i>
                <span>Chh.Sambhajinagar, Maharashtra, India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/70 text-sm">
            &copy; 2025 TripGoals. All rights reserved.
          </p>
          <div className="flex space-x-8">
            <a
              href="#"
              className="text-white/70 hover:text-yellow-400 transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-yellow-400 transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-yellow-400 transition-colors text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}