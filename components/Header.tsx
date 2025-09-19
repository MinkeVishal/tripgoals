'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem('currentUser');
      if (user) {
        setCurrentUser(JSON.parse(user));
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    checkAuthStatus();
    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showLoginModal = () => {
    const event = new CustomEvent('showLoginModal');
    window.dispatchEvent(event);
  };

  const showSignupModal = () => {
    const event = new CustomEvent('showSignupModal');
    window.dispatchEvent(event);
  };
  console.log('pathname',pathname);
  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    if (pathname.includes('/admin')) {
      window.location.href = '/';
    }
  };
  if (pathname.split('/').includes('admin')) return null;
  
  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-grey/90 backdrop-blur-md shadow-lg' 
          : 'bg-white/10 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <h2 className="text-4xl font-bold font-dancing-script bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                TripGoals
              </h2>
            </Link>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex items-center space-x-9">
              <li>
                <Link 
                  href="/" 
                  className={`text-black font-medium text-sm transition-all duration-300 hover:text-yellow-400 hover:-translate-y-0.5 relative ${
                    pathname === '/' ? 'text-yellow-400' : ''
                  }`}
                >
                  Home
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    pathname === '/' ? 'w-full' : 'w-0 hover:w-full'
                  }`}></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/packages" 
                  className={`text-black font-medium text-sm transition-all duration-300 hover:text-yellow-400 hover:-translate-y-0.5 relative ${
                    pathname === '/packages' ? 'text-yellow-400' : ''
                  }`}
                >
                  All Packages
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    pathname === '/packages' ? 'w-full' : 'w-0 hover:w-full'
                  }`}></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className={`text-black font-medium text-sm transition-all duration-300 hover:text-yellow-400 hover:-translate-y-0.5 relative ${
                    pathname === '/about' ? 'text-yellow-400' : ''
                  }`}
                >
                  About Us
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    pathname === '/about' ? 'w-full' : 'w-0 hover:w-full'
                  }`}></span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className={`text-black font-medium text-sm transition-all duration-300 hover:text-yellow-400 hover:-translate-y-0.5 relative ${
                    pathname === '/contact' ? 'text-yellow-400' : ''
                  }`}
                >
                  Contact Us
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-yellow-400 transition-all duration-300 ${
                    pathname === '/contact' ? 'w-full' : 'w-0 hover:w-full'
                  }`}></span>
                </Link>
              </li>
            </ul>

            {/* Auth Section */}
            <div className="flex items-center space-x-2">
              {currentUser ? (
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                  <img 
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop" 
                    alt="Profile" 
                    className="w-5 h- rounded-full object-cover"
                  />
                  <span className="text-white text-sm font-medium">{currentUser.name}</span>
                  <button 
                    onClick={logout}
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <button 
                    onClick={showLoginModal}
                    className="bg-white/20 border border-white/30 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-all duration-300 backdrop-blur-md"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </button>
                  <button 
                    onClick={showSignupModal}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-5 py-2 rounded-full text-sm font-semibold hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-yellow-400/30"
                  >
                    Sign Up
                  </button>
                </div>
              )}
    
    {currentUser && (
    <button
    onClick={logout}
    className="relative overflow-hidden px-2 py-1 md:px-3 md:py-1
               text-[7px] md:text-xs font-medium text-black
               rounded-full shadow-md backdrop-blur-md
               bg-gradient-to-r from-yellow-400/90 to-orange-400/90
               border border-white/20
               hover:scale-105 hover:from-orange-400 hover:to-yellow-400 
               hover:shadow-lg transition-all duration-300"
  >
    <span className="relative z-10">Logout</span>
    <span className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 to-orange-500/30 blur-lg"></span>
  </button>
)}



              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex flex-col space-y-1 p-2"
              >
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10 py-4">
              <div className="flex flex-col space-y-4 px-4">
                <Link 
                  href="/" 
                  className="text-white font-medium py-2 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/packages" 
                  className="text-white font-medium py-2 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Packages
                </Link>
                <Link 
                  href="/about" 
                  className="text-white font-medium py-2 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link 
                  href="/contact" 
                  className="text-white font-medium py-2 hover:text-yellow-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact Us
                </Link>
                {!currentUser && (
                  <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                    <button 
                      onClick={() => {
                        showLoginModal();
                        setIsMenuOpen(false);
                      }}
                      className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => {
                        showSignupModal();
                        setIsMenuOpen(false);
                      }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Admin Panel Button */}
      {currentUser?.isAdmin && (
        <div className="fixed top-20 right-5 z-20">
          <Link 
            href="/admin"
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded-full text-sm font-semibold hover:from-indigo-600 hover:to-purple-500 transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-purple-500/30 flex items-center space-x-2"
          >
            <i className="fas fa-cog"></i>
            <span>Admin Panel</span>
          </Link>
        </div>
      )}
    </>

  );
}
