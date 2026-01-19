'use client';

import { useState } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as z from 'zod';
import { Category } from '@/types';
import { createCategory, updateCategory, uploadImage } from '@/lib/admin';
import toast from 'react-hot-toast';

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  subtitle: z.string().optional(),
  price: z.string().optional(),
  duration: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
});

interface CategoryFormProps {
  category?: Category | null;
  onClose: () => void;
}

export default function CategoryForm({ category: editCategory, onClose }: CategoryFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    editCategory ? `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/68cbee510018bf68f24c/files/${editCategory.imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}` : null
  );
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(editCategory?.whatsIncluded || ['']);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {editCategory ? 'Edit Category' : 'Create New Category'}
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
            name: editCategory?.name || '',
            subtitle: editCategory?.subtitle || '',
            price: editCategory?.price || '',
            duration: editCategory?.duration || '',
            description: editCategory?.description || '',
          }}
          validate={(values) => {
            try {
              categorySchema.parse(values);
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
              let imageId = editCategory?.imageId;

              if (imageFile) {
                const uploadResponse = await uploadImage(imageFile);
                imageId = uploadResponse.$id;
              }

              if (!imageId) {
                toast.error('Please select an image');
                return;
              }

              const categoryData = {
                ...values,
                imageId,
                whatsIncluded: whatsIncluded.filter(item => item.trim() !== ''),
              };

              if (editCategory) {
                await updateCategory(editCategory.$id, categoryData);
                toast.success('Category updated successfully');
              } else {
                await createCategory(categoryData);
                toast.success('Category created successfully');
              }

              onClose();
            } catch (error) {
              console.error('Error saving category:', error);
              toast.error('Failed to save category');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
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
                    id="category-image-upload"
                  />
                  <label
                    htmlFor="category-image-upload"
                    className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
                  >
                    {imagePreview ? 'Change Image' : 'Upload Image'}
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <Field
                  name="name"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Category name"
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <Field
                  name="subtitle"
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Category subtitle (e.g. 'Popular Destinations')"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Optional)</label>
                  <Field
                    name="price"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Optional)</label>
                  <Field
                    name="duration"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g. 2 Days 1 Night"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Category description"
                />
                {errors.description && touched.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What's Included</label>
                <div className="space-y-3">
                  {whatsIncluded.map((item, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateIncludedItem(index, e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g. Hotel Stay"
                      />
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(index)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addIncludedItem}
                    className="flex items-center text-green-600 font-medium hover:text-green-700"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Item
                  </button>
                </div>
              </div>

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
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    editCategory ? 'Update Category' : 'Create Category'
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