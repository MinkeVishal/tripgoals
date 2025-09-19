'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, PackageIcon } from 'lucide-react';
import { Package, Category, AdminAuthState } from '@/types';
import { getPackages, getCategories } from '@/lib/appwrite';
import { deletePackage, deleteImage } from '@/lib/admin';
import AdminAuth from '@/components/admin/AdminAuth';
import PackageForm from '@/components/admin/PackageForm';
import toast from 'react-hot-toast';

export default function PackagesManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem('adminAuth');
      if (authState) {
        const parsed: AdminAuthState = JSON.parse(authState);
        const isValid = parsed.isAuthenticated && (Date.now() - parsed.timestamp < 3600000);
        setIsAuthenticated(isValid);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    try {
      const [packagesResponse, categoriesResponse] = await Promise.all([
        getPackages(),
        getCategories()
      ]);
      
      setPackages(packagesResponse.documents as Package[]);
      setCategories(categoriesResponse.documents as Category[]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (packageToDelete: Package) => {
    if (!confirm('Are you sure you want to delete this package?')) return;

    try {
      await deletePackage(packageToDelete.$id);
      if (packageToDelete.imageId) {
        await deleteImage(packageToDelete.imageId);
      }
      setPackages(packages.filter(p => p.$id !== packageToDelete.$id));
      toast.success('Package deleted successfully');
    } catch (error) {
      console.error('Error deleting package:', error);
      toast.error('Failed to delete package');
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPackage(null);
    fetchData(); // Refresh data
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Package Management</h1>
            <p className="text-gray-600 mt-2">Create and manage your travel packages</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Package</span>
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div key={pkg.$id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/images/files/${pkg.imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {pkg.section}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{pkg.subtitle}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span>{pkg.days} days</span>
                    <span>{pkg.category}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(`/package/${pkg.$id}`, '_blank')}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(pkg)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {packages.length === 0 && !loading && (
          <div className="text-center py-12">
            <PackageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No packages yet</h3>
            <p className="text-gray-600">Get started by creating your first travel package</p>
          </div>
        )}

        {/* Package Form Modal */}
        {showForm && (
          <PackageForm
            package={editingPackage}
            categories={categories}
            onClose={handleFormClose}
          />
        )}
      </div>
    </div>
  );
}