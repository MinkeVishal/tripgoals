'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, type FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [loadingAdminAuth, setLoadingAdminAuth] = useState(false);

  useEffect(() => {
    const checkAuthStatus = () => {
      const user = localStorage.getItem('currentUser');
      if (user) setCurrentUser(JSON.parse(user));
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const initialSearch = searchParams.get('search') || '';
    setSearchTerm(initialSearch);
  }, [searchParams]);

  const showLoginModal = () => {
    window.dispatchEvent(new CustomEvent('showLoginModal'));
  };

  const showSignupModal = () => {
    window.dispatchEvent(new CustomEvent('showSignupModal'));
  };

  const handleSearch = (e?: FormEvent) => {
    e?.preventDefault();
    const query = searchTerm.trim();
    const target = query ? `/packages?search=${encodeURIComponent(query)}` : '/packages';
    router.push(target);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAdminAuth(true);

    setTimeout(() => {
      if (adminPassword === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || adminPassword === 'admin123') {
        const authState = {
          isAuthenticated: true,
          timestamp: Date.now()
        };
        localStorage.setItem('adminAuth', JSON.stringify(authState));
        toast.success('Authentication successful');
        setShowAdminAuth(false);
        setAdminPassword('');
        router.push('/admin');
      } else {
        toast.error('Invalid password');
      }
      setLoadingAdminAuth(false);
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    if (pathname.includes('/admin')) {
      window.location.href = '/';
    }
  };

  if (pathname.split('/').includes('admin')) return null;

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image 
              src="/logo.jpeg"
              alt="TripGoals Logo"
              width={40}
              height={40}
              style={{ height: '48px', width: 'auto' }}
              priority
              className="hover:scale-110 transition-transform duration-300"
            />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className={`text-sm font-medium ${pathname === '/' ? 'text-gray-900 underline' : 'text-gray-700 hover:text-gray-900'}`}>
              Home
            </Link>
            <Link href="/packages" className={`text-sm font-medium ${pathname?.startsWith('/packages') ? 'text-gray-900 underline' : 'text-gray-700 hover:text-gray-900'}`}>
              Packages
            </Link>
            <Link href="/categories" className={`text-sm font-medium ${pathname?.startsWith('/categories') ? 'text-gray-900 underline' : 'text-gray-700 hover:text-gray-900'}`}>
              Categories
            </Link>
            <Link href="/contact" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Contact
            </Link>
            {currentUser?.role === 'admin' && (
              <Link href="/admin" className={`text-sm font-medium ${pathname?.startsWith('/admin') ? 'text-blue-600 underline' : 'text-blue-600 hover:text-blue-700'}`}>
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center bg-white border border-gray-200 rounded-md overflow-hidden">
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search packages" className="px-3 py-2 text-sm outline-none w-48" />
              <button type="submit" className="px-3 py-2 bg-gray-100 text-sm font-medium">Go</button>
            </form>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                {currentUser.role === 'admin' && (
                  <div className="flex gap-2">
                    <button onClick={() => router.push('/admin/packages')} className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors">
                      Add Package
                    </button>
                    <button onClick={() => router.push('/admin')} className="text-sm font-medium text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md transition-colors">
                      Admin Panel
                    </button>
                  </div>
                )}
                <span className="text-sm text-gray-700">{currentUser.name || currentUser.email}</span>
                <button onClick={logout} className="text-sm font-medium text-red-500 hover:text-red-600">Logout</button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button onClick={showLoginModal} className="text-sm font-medium text-gray-700 hover:text-gray-900">Log in</button>
                  <button onClick={showSignupModal} className="text-sm font-semibold text-white bg-yellow-400 px-3 py-1 rounded-md hover:bg-yellow-500">Sign up</button>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <button onClick={() => setShowAdminAuth(true)} className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md transition-colors">
                  Admin
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Auth Modal */}
      {showAdminAuth && (
        <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowAdminAuth(false)}>
          <div className="flex items-center justify-center min-h-screen px-4" onClick={(e) => e.stopPropagation()}>
            <div className="w-full max-w-sm bg-white rounded-xl shadow-xl p-6 animate-fadeInUp">
              <div className="text-center mb-6">
                <h1 className="text-xl font-bold text-gray-900">Admin Access</h1>
                <p className="text-gray-600 text-sm mt-1">Enter password to continue</p>
              </div>

              <form onSubmit={handleAdminAuth} className="space-y-4">
                <div>
                  <input
                    type="password"
                    id="admin-password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={loadingAdminAuth}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    {loadingAdminAuth ? 'Verifying...' : 'Access'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminAuth(false);
                      setAdminPassword('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}