'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Package, Category, AdminAuthState, User } from '@/types';
import { getPackages, getCategories, getUsers } from '@/lib/appwrite';
import { BarChart3, Package as PackageIcon, Tag, Users, Compass, Shield } from 'lucide-react';
import AdminAuth from '@/components/admin/AdminAuth';
import toast from 'react-hot-toast';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role') as 'admin' | 'miniadmin' | null;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminRole, setAdminRole] = useState<'admin' | 'miniadmin'>('admin');
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [miniadminEnabled, setMiniadminEnabled] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem('adminAuth');
      if (authState) {
        const parsed: AdminAuthState & { role?: 'admin' | 'miniadmin' } = JSON.parse(authState);
        const isValid = parsed.isAuthenticated && (Date.now() - parsed.timestamp < 3600000); // 1 hour
        setIsAuthenticated(isValid);
        if (parsed.role) {
          setAdminRole(parsed.role);
        }
      }
    };

    // Load mini admin access state
    const accessState = localStorage.getItem('miniadminAccess');
    if (accessState) {
      setMiniadminEnabled(JSON.parse(accessState).enabled);
    }

    checkAuth();
  }, []);

  const toggleMiniadminAccess = () => {
    const newState = !miniadminEnabled;
    setMiniadminEnabled(newState);
    localStorage.setItem('miniadminAccess', JSON.stringify({ enabled: newState }));
    toast.success(newState ? 'Mini admin access enabled' : 'Mini admin access disabled');
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const [packagesResponse, categoriesResponse, usersResponse] = await Promise.all([
            getPackages(),
            getCategories(),
            getUsers()
          ]);

          setPackages(packagesResponse.documents as Package[]);
          setCategories(categoriesResponse.documents as Category[]);
          setUsers(usersResponse.documents as User[]);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <AdminAuth 
        role={roleParam || 'admin'} 
        onAuthenticated={(role) => {
          setAdminRole(role);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  const isMiniadmin = adminRole === 'miniadmin';

  const stats = {
    totalPackages: packages.length,
    popularPackages: packages.filter(p => p.section === 'popular').length,
    specialPackages: packages.filter(p => p.section === 'special').length,
    adventurePackages: packages.filter(p => p.section === 'adventure').length,
    totalCategories: categories.length,
    totalUsers: users.length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">
                {isMiniadmin ? 'Mini Admin Dashboard' : 'Admin Dashboard'}
              </h1>
            </div>
            <p className="text-gray-600 mt-2">
              {isMiniadmin 
                ? 'Manage packages, adventures and categories' 
                : 'Manage your travel packages and categories'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>Logout
          </button>
        </div>

        {/* Mini Admin Access Control - Only visible to full admin */}
        {!isMiniadmin && (
          <div className="mb-8 bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Mini Admin Access</h3>
                  <p className="text-gray-600 text-sm">Enable or disable mini admin login access</p>
                </div>
              </div>
              <button
                onClick={toggleMiniadminAccess}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  miniadminEnabled ? 'bg-orange-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    miniadminEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <PackageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Popular Packages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.popularPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Tag className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Special Offers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.specialPackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <Compass className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Adventure</p>
                <p className="text-2xl font-bold text-gray-900">{stats.adventurePackages}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <Tag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCategories}</p>
              </div>
            </div>
          </div>

          {!isMiniadmin && (
            <div className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push('/admin/users')}>
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-full">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Package Management</h2>
            <p className="text-gray-600 mb-4 flex-1">
              {isMiniadmin ? 'Add and edit packages' : 'Create, edit, and manage your travel packages'}
            </p>
            <button
              onClick={() => router.push('/admin/packages')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full mt-auto"
            >
              Manage Packages
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Adventure Management</h2>
            <p className="text-gray-600 mb-4 flex-1">
              {isMiniadmin ? 'Add and edit adventures' : 'Create and manage adventure activities'}
            </p>
            <button
              onClick={() => router.push('/admin/adventure')}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full mt-auto"
            >
              Manage Adventures
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Category Management</h2>
            <p className="text-gray-600 mb-4 flex-1">
              {isMiniadmin ? 'Add and edit categories' : 'Organize packages into categories'}
            </p>
            <button
              onClick={() => router.push('/admin/categories')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full mt-auto"
            >
              Manage Categories
            </button>
          </div>

          {!isMiniadmin && (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Banner Management</h2>
              <p className="text-gray-600 mb-4 flex-1">Edit home banner title, subtitle, and background</p>
              <button
                onClick={() => router.push('/admin/banner')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full mt-auto"
              >
                Manage Banner
              </button>
            </div>
          )}

          {!isMiniadmin && (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
              <p className="text-gray-600 mb-4 flex-1">View and manage registered users</p>
              <button
                onClick={() => router.push('/admin/users')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full mt-auto"
              >
                Manage Users
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}