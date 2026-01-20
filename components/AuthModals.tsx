'use client';

import { useState, useEffect } from 'react';

import { saveUser, verifyUser } from '@/lib/appwrite';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthModals() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const resetModals = () => {
    setErrors({});
    setShowPassword(false);
  };

  useEffect(() => {
    const handleShowLogin = () => setShowLoginModal(true);
    const handleShowSignup = () => setShowSignupModal(true);

    window.addEventListener('showLoginModal', handleShowLogin);
    window.addEventListener('showSignupModal', handleShowSignup);

    return () => {
      window.removeEventListener('showLoginModal', handleShowLogin);
      window.removeEventListener('showSignupModal', handleShowSignup);
    };
  }, []);

  const closeModal = (modalType: 'login' | 'signup') => {
    if (modalType === 'login') setShowLoginModal(false);
    if (modalType === 'signup') setShowSignupModal(false);
    resetModals();
  };

  const openLogin = () => {
    closeModal('signup');
    setShowLoginModal(true);
  };

  const openSignup = () => {
    closeModal('login');
    setShowSignupModal(true);
  };

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Default to user type unless admin check passes
    const userType = 'user';

    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // Admin check
    if (email === 'admin@tripgoals.com' && password === 'admin123') {
      const currentUser = {
        isLoggedIn: true,
        isAdmin: true,
        name: 'Admin',
        email: email
      };

      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      closeModal('login');
      window.dispatchEvent(new Event('userLoggedIn'));
      alert('Admin login successful!');
      return;
    }

    // User check - Verify against Appwrite
    try {
      const user = await verifyUser(email, password);

      if (user) {
        const currentUser = {
          isLoggedIn: true,
          isAdmin: false,
          name: user.FullName,
          email: user.email || email
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeModal('login');
        window.dispatchEvent(new Event('userLoggedIn'));
        alert('Login successful!');
      } else {
        setErrors({ general: 'Invalid email or password' });
        // Optionally keep the alert as a fallback or remove it if inline error is enough
        // alert('Invalid email or password. Please try again.'); 
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const signup = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const number = formData.get('number') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    const newErrors: { [key: string]: string } = {};

    // Validation Logic
    if (!name) newErrors.name = 'Full Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (number && !/^\d{10,}$/.test(number.replace(/\D/g, ''))) {
      newErrors.number = 'Phone number must be at least 10 digits';
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors if valid
    setErrors({});

    // Signup only allows user, admin removed
    const currentUser = {
      isLoggedIn: true,
      isAdmin: false,
      name: name,
      email: email
    };

    localStorage.setItem('currentUser', JSON.stringify(currentUser));

    // Save user in Appwrite
    try {
      await saveUser({
        FullName: name,
        number: number,
        password: password,
        email: email,
      });
    } catch (error) {
      console.error('Failed to save user signup:', error);
    }

    closeModal('signup');
    window.dispatchEvent(new Event('userLoggedIn'));
    alert('Account created successfully!');
  };

  return (
    <>
      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white/95 backdrop-blur-md mx-auto p-8 rounded-3xl w-full max-w-md relative animate-modal-slide-in border border-white/30">
            <button onClick={() => closeModal('login')} className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold cursor-pointer transition-colors">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>
            <form onSubmit={login} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full px-4 py-3 border rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`w-full px-4 py-3 border rounded-xl pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
              </div>

              {errors.general && (
                <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center">
                  {errors.general}
                </div>
              )}

              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Login
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={openSignup}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white/95 backdrop-blur-md mx-auto p-8 rounded-3xl w-full max-w-md relative animate-modal-slide-in border border-white/30">
            <button onClick={() => closeModal('signup')} className="absolute top-4 right-4 text-gray-600 hover:text-black text-2xl font-bold cursor-pointer transition-colors">&times;</button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Sign Up</h2>
            <form onSubmit={signup} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  className={`w-full px-4 py-3 border rounded-xl ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`w-full px-4 py-3 border rounded-xl ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              <div>
                <input
                  type="tel"
                  name="number"
                  placeholder="Phone Number"
                  className={`w-full px-4 py-3 border rounded-xl ${errors.number ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.number && <p className="text-red-500 text-xs mt-1 ml-1">{errors.number}</p>}
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`w-full px-4 py-3 border rounded-xl pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
              </div>

              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className={`w-full px-4 py-3 border rounded-xl ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                Sign Up
              </button>

              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={openLogin}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Login
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
