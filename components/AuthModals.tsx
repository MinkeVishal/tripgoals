'use client';

import { useState, useEffect } from 'react';

export default function AuthModals() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

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
  };

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const userType = formData.get('userType') as string;
    
    const isAdmin = userType === 'admin' && email === 'admin@tripgoals.com' && password === 'admin123';
    const isUser = userType === 'user';
    
    if (isAdmin || isUser) {
      const currentUser = {
        isLoggedIn: true,
        isAdmin: isAdmin,
        name: isAdmin ? 'Admin' : email.split('@')[0],
        email: email
      };
      
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      closeModal('login');
      window.location.reload();
      alert(isAdmin ? 'Admin login successful!' : 'Login successful!');
    } else {
      alert('Invalid credentials');
    }
  };

  const signup = (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    
    if (!name || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // Signup only allows user, admin removed
    const currentUser = {
      isLoggedIn: true,
      isAdmin: false,
      name: name,
      email: email
    };
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    closeModal('signup');
    window.location.reload();
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
              <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-xl"/>
              <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-xl"/>
              <div className="flex space-x-4">
                <label><input type="radio" name="userType" value="user" defaultChecked className="mr-2"/>User</label>
                <label><input type="radio" name="userType" value="admin" className="mr-2"/>Admin</label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl">Login</button>
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
              <input type="text" name="name" placeholder="Full Name" required className="w-full px-4 py-3 border rounded-xl"/>
              <input type="email" name="email" placeholder="Email" required className="w-full px-4 py-3 border rounded-xl"/>
              <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-3 border rounded-xl"/>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required className="w-full px-4 py-3 border rounded-xl"/>
              <div className="flex space-x-4">
                <label><input type="radio" name="userType" value="user" defaultChecked className="mr-2"/>User</label>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl">Sign Up</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
