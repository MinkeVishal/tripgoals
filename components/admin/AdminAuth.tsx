'use client';

import { useState, useEffect } from 'react';
import { Lock, Shield, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminAuthProps {
  onAuthenticated: (role: 'admin' | 'miniadmin') => void;
  role?: 'admin' | 'miniadmin';
}

export default function AdminAuth({ onAuthenticated, role = 'admin' }: AdminAuthProps) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [miniadminEnabled, setMiniadminEnabled] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const isMiniadmin = role === 'miniadmin';
  const MINIADMIN_PASSWORD = process.env.NEXT_PUBLIC_MINIADMIN_PASSWORD || 'miniadmin123';

  useEffect(() => {
    // Check if mini admin access is enabled by admin
    const checkMiniadminAccess = () => {
      const accessState = localStorage.getItem('miniadminAccess');
      if (accessState) {
        setMiniadminEnabled(JSON.parse(accessState).enabled);
      }
      setCheckingAccess(false);
    };
    checkMiniadminAccess();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      if (isMiniadmin) {
        // Check if mini admin access is enabled
        if (!miniadminEnabled) {
          toast.error('Mini admin access is not enabled by admin');
          setLoading(false);
          return;
        }
        // Mini Admin authentication
        if (password === MINIADMIN_PASSWORD) {
          const authState = {
            isAuthenticated: true,
            role: 'miniadmin',
            timestamp: Date.now()
          };
          localStorage.setItem('adminAuth', JSON.stringify(authState));
          toast.success('Mini Admin authentication successful');
          onAuthenticated('miniadmin');
        } else {
          toast.error('Invalid mini admin password');
        }
      } else {
        // Full Admin authentication
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
          const authState = {
            isAuthenticated: true,
            role: 'admin',
            timestamp: Date.now()
          };
          localStorage.setItem('adminAuth', JSON.stringify(authState));
          toast.success('Authentication successful');
          onAuthenticated('admin');
        } else {
          toast.error('Invalid password');
        }
      }
      setLoading(false);
    }, 1000);
  };

  if (checkingAccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Show access denied screen for mini admin if not enabled
  if (isMiniadmin && !miniadminEnabled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
            <p className="text-gray-600 mt-2">
              Mini admin access is currently disabled. Please contact the administrator to enable access.
            </p>
            <a
              href="/"
              className="mt-6 inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Go Back Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className={`mx-auto w-16 h-16 ${isMiniadmin ? 'bg-orange-100' : 'bg-blue-100'} rounded-full flex items-center justify-center mb-4`}>
            {isMiniadmin ? (
              <Shield className="h-8 w-8 text-orange-600" />
            ) : (
              <Lock className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isMiniadmin ? 'Mini Admin Access' : 'Admin Access'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isMiniadmin 
              ? 'Enter mini admin password to continue' 
              : 'Enter your password to continue'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 ${isMiniadmin ? 'focus:ring-orange-500' : 'focus:ring-blue-500'} focus:border-transparent`}
              placeholder={isMiniadmin ? 'Enter mini admin password' : 'Enter admin password'}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${isMiniadmin 
              ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' 
              : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'
            } text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center`}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              isMiniadmin ? 'Access Mini Admin Panel' : 'Access Admin Panel'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}