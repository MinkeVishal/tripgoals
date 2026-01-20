'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Formik, Form, Field } from 'formik';
import * as z from 'zod';
import { Package, Category } from '@/types';
import { createPackage, updatePackage, uploadImage } from '@/lib/admin';
import toast from 'react-hot-toast';

const packageSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  duration: z.string().min(1, 'Duration is required'),
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    editPackage?.imageIds?.map(id =>
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/68cbee510018bf68f24c/files/${id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    ) || (editPackage?.imageId ? [
      `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/68cbee510018bf68f24c/files/${editPackage.imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    ] : [])
  );
  const [existingImageIds, setExistingImageIds] = useState<string[]>(
    editPackage?.imageIds || (editPackage?.imageId ? [editPackage.imageId] : [])
  );
  const [whatsIncluded, setWhatsIncluded] = useState<string[]>(editPackage?.whatsIncluded || ['']);
  const [itinerary, setItinerary] = useState<string[]>(editPackage?.itinerary || ['']);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => setImagePreviews(prev => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const isExistingImage = index < existingImageIds.length;
    if (isExistingImage) {
      setExistingImageIds(prev => prev.filter((_, i) => i !== index));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      const newFileIndex = index - existingImageIds.length;
      setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
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

  const addItineraryItem = () => {
    setItinerary([...itinerary, '']);
  };

  const updateItineraryItem = (index: number, value: string) => {
    const updated = [...itinerary];
    updated[index] = value;
    setItinerary(updated);
  };

  const removeItineraryItem = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomSection, setIsCustomSection] = useState(false);

  // Initialize custom state based on whether the current values are in the standard lists
  useEffect(() => {
    if (editPackage) {
      if (editPackage.category && !categories.some(c => c.name === editPackage.category)) {
        setIsCustomCategory(true);
      }
      if (editPackage.section && !['popular', 'special', 'other'].includes(editPackage.section)) {
        setIsCustomSection(true);
      }
    }
  }, [editPackage, categories]);

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
            duration: editPackage?.duration || '',
            price: editPackage?.price || '',
            category: editPackage?.category || '',
            description: editPackage?.description || '',
            section: editPackage?.section || 'other',
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
              // Upload all new images
              const newImageIds: string[] = [];
              for (const file of imageFiles) {
                const uploadResponse = await uploadImage(file);
                newImageIds.push(uploadResponse.$id);
              }

              // Combine existing and new image IDs
              const allImageIds = [...existingImageIds, ...newImageIds];

              if (allImageIds.length === 0) {
                toast.error('Please select at least one image');
                return;
              }

              if (!values.duration) {
                toast.error('Please enter duration (e.g., 1 night 1 day)');
                return;
              }

              const packageData: Record<string, any> = {
                title: values.title,
                subtitle: values.subtitle,
                duration: values.duration,
                category: values.category,
                description: values.description,
                section: values.section,
                price: Number(values.price) || 0,
                imageId: allImageIds[0], // Primary image
                imageIds: allImageIds, // All images for carousel
                whatsIncluded: whatsIncluded.filter(item => item.trim() !== ''),
                itinerary: itinerary.filter(item => item.trim() !== ''),
              };

              const dataToSend = packageData;

              if (editPackage) {
                await updatePackage(editPackage.$id, dataToSend);
                toast.success('Package updated successfully');
                window.dispatchEvent(new Event('packageUpdated'));
              } else {
                await createPackage(dataToSend as any);
                toast.success('Package created successfully');
                window.dispatchEvent(new Event('packageAdded'));
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
                  Package Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  {imagePreviews.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={200}
                            height={128}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-0.5 rounded">Primary</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Click to upload images</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <div className="text-center">
                    <label
                      htmlFor="image-upload"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      {imagePreviews.length > 0 ? 'Add More Images' : 'Upload Images'}
                    </label>
                  </div>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <Field
                    name="duration"
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 1 night 1 day"
                  />
                  {errors.duration && touched.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <Field
                    name="price"
                    type="number"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 25000"
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
                  {!isCustomCategory ? (
                    <div className="flex gap-2">
                      <Field
                        as="select"
                        name="category"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const value = e.target.value;
                          if (value === '__other__') {
                            setIsCustomCategory(true);
                            setFieldValue('category', '');
                          } else {
                            setFieldValue('category', value);
                          }
                        }}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.$id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                        <option value="__other__">Other (Add New)</option>
                      </Field>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Field
                        name="category"
                        type="text"
                        placeholder="Enter custom category"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomCategory(false)}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        title="Back to list"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                  {errors.category && touched.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
                  {!isCustomSection ? (
                    <div className="flex gap-2">
                      <Field
                        as="select"
                        name="section"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const value = e.target.value;
                          if (value === '__other__') {
                            setIsCustomSection(true);
                            setFieldValue('section', '');
                          } else {
                            setFieldValue('section', value);
                          }
                        }}
                      >
                        <option value="other">Other</option>
                        <option value="popular">Popular</option>
                        <option value="special">Special</option>
                        <option value="__other__">Add Custom Section...</option>
                      </Field>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Field
                        name="section"
                        type="text"
                        placeholder="Enter custom section"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomSection(false)}
                        className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                        title="Back to list"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  )}
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

              {/* Itinerary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Itinerary (Day by Day)</label>
                <div className="space-y-2">
                  {itinerary.map((item, index) => (
                    <div key={index} className="flex space-x-2">
                      <div className="flex items-center bg-blue-100 px-3 rounded-lg">
                        <span className="text-sm font-medium text-blue-600">Day {index + 1}</span>
                      </div>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => updateItineraryItem(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Enter Day ${index + 1} itinerary details`}
                      />
                      <button
                        type="button"
                        onClick={() => removeItineraryItem(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addItineraryItem}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Day</span>
                  </button>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">What&apos;s Included</label>
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
