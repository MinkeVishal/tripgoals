'use client';

import { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as z from 'zod';
import { Package, Category } from '@/types';
import { createPackage, updatePackage, uploadImage } from '@/lib/admin';
import toast from 'react-hot-toast';

const packageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  days: z.number().min(1, 'Duration must be at least 1 day'),
  price: z.number().min(0, 'Price must be at least 0'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  section: z.enum(['popular', 'special', 'other']),
});

interface PackageFormProps {
  package?: Package | null;
  categories: Category[];
  onClose: () => void;
}

export default function PackageForm({ package: editPackage, categories, onClose }: PackageFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editPackage ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/images/files/${editPackage.imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}` : null
  );
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(editPackage?.whatsIncluded || ['']);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addIncludedItem = () => {
    setWhatsIncluded([...whatsIncluded, '']);
  };

  const updateIncludedItem = (index: number, value: string) => {
    const updated = [...whatsIncluded];
    updated[index] = value;
    setWhatsIncluded(updated);
  };

  const removeIncludedItem = (index: number) => {
    setWhatsIncluded(whatsIncluded.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {editPackage ? 'Edit Package' : 'Create New Package'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <Formik
          initialValues={{
            title: editPackage?.title || '',
            subtitle: editPackage?.subtitle || '',
            days: editPackage?.days || 1,
            price: editPackage?.price || 0,
            category: editPackage?.category || '',
            description: editPackage?.description || '',
            section: editPackage?.section || 'other' as const,
          }}
          validate={(values) => {
            try {
              packageSchema.parse(values);
              return {};
            } catch (error) {
              if (error instanceof z.ZodError) {
                return error.issues.reduce((acc, curr) => {
                  acc[curr.path[0]] = curr.message;
                  return acc;
                }, {} as any);
              }
              return {};
            }
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              let imageId = editPackage?.imageId;

              // Upload new image if provided
              if (imageFile) {
                const uploadResponse = await uploadImage(imageFile);
                imageId = uploadResponse.$id;
              }

              if (!imageId) {
                toast.error('Please select an image');
                return;
              }

              const packageData = {
                ...values,
                imageId,
                whatsIncluded: whatsIncluded.filter(item => item.trim() !== ''),
              };

              if (editPackage) {
                await updatePackage(editPackage.$id, packageData);
                toast.success('Package updated successfully');
              } else {
                await createPackage(packageData as any);
                toast.success('Package created successfully');
              }

              onClose();
            } catch (error) {
              console.error('Error saving package:', error);
              toast.error('Failed to save package');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Package Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload an image</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Field
                    name="title"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Package title"
                  />
                  {errors.title && touched.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days</label>
                  <Field
                    name="days"
                    type="number"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Number of days"
                  />
                  {errors.days && touched.days && (
                    <p className="text-red-500 text-sm mt-1">{errors.days}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <Field
                    name="price"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Package price"
                  />
                  {errors.price && touched.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <Field
                  name="subtitle"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Package subtitle"
                />
                {errors.subtitle && touched.subtitle && (
                  <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <Field
                    as="select"
                    name="category"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.$id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </Field>
                  {errors.category && touched.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  <Field
                    as="select"
                    name="section"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="other">Other</option>
                    <option value="popular">Popular</option>
                    <option value="special">Special</option>
                  </Field>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Detailed package description"
                />
                {errors.description && touched.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* What's Included */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                <div className="space-y-2">
                  {whatsIncluded.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateIncludedItem(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="What's included in this package"
                      />
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIncludedItem}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add item</span>
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    editPackage ? 'Update Package' : 'Create Package'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
