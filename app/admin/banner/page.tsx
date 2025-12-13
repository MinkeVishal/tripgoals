"use client";

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, UploadCloud, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminAuth from '@/components/admin/AdminAuth';
import { getBanner, getImageUrl } from '@/lib/appwrite';
import { uploadImage, upsertBanner } from '@/lib/admin';
import { AdminAuthState, Banner } from '@/types';

export default function BannerManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [ctaLabel, setCtaLabel] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authState = localStorage.getItem('adminAuth');
      if (authState) {
        const parsed: AdminAuthState = JSON.parse(authState);
        const isValid = parsed.isAuthenticated && Date.now() - parsed.timestamp < 3600000;
        setIsAuthenticated(isValid);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchBanner = async () => {
      try {
        const data = await getBanner();
        setBanner(data);
        setTitle(data.title || '');
        setSubtitle(data.subtitle || '');
        setCtaLabel(data.ctaLabel || '');
        if (data.backgroundImageId) {
          setImagePreview(getImageUrl(data.backgroundImageId));
        }
      } catch (error) {
        console.error('Error fetching banner:', error);
        toast.error('Failed to load banner');
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [isAuthenticated]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let backgroundImageId = banner?.backgroundImageId || '';
      if (imageFile) {
        const upload = await uploadImage(imageFile);
        backgroundImageId = upload.$id;
      }

      await upsertBanner({
        title,
        subtitle,
        ctaLabel: ctaLabel || 'Explore All Packages',
        backgroundImageId,
      });

      toast.success('Banner saved');
      router.refresh();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast.error('Failed to save banner');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
            <p className="text-gray-600">Update the home banner heading, copy, and background</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Back to Dashboard
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Discover Incredible India"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Experience the magic of India with our travel packages"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Label</label>
                <input
                  type="text"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explore All Packages"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Background Image</label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center px-4 py-3 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors w-full justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <UploadCloud className="h-5 w-5" />
                      <span className="text-sm">Upload image</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <span className="text-xs text-gray-400">Recommended 1600x900</span>
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-3">
                    <div className="relative h-44 rounded-xl overflow-hidden border border-gray-200">
                      {/* Brief preview of banner image */}
                      <img src={imagePreview} alt="Banner preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-sm">
                        <ImageIcon className="h-6 w-6 mb-1" />
                        <span>Preview</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                <span>{saving ? 'Saving...' : 'Save Banner'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
