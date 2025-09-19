import { Client, Databases, Storage, ID } from 'appwrite';
import { Package, Category } from '@/types';

const adminClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  // .setKey(process.env.APPWRITE_API_KEY!);

const adminDatabases = new Databases(adminClient);
const adminStorage = new Storage(adminClient);

export const DATABASE_ID = '68b33bf10034e18837cc';
export const PACKAGES_COLLECTION_ID = 'packages';
export const CATEGORIES_COLLECTION_ID = 'categories';
export const STORAGE_BUCKET_ID = 'images';

// Type for creating packages (excluding Appwrite document properties)
type CreatePackageData = Pick<Package, 'title' | 'subtitle' | 'days' | 'category' | 'imageId' | 'description' | 'whatsIncluded' | 'section'>;

// Type for creating categories (excluding Appwrite document properties)
type CreateCategoryData = Pick<Category, 'name' | 'description' | 'imageId'>;

// Package CRUD operations
export const createPackage = async (packageData: CreatePackageData) => {
  return await adminDatabases.createDocument(
    DATABASE_ID,
    PACKAGES_COLLECTION_ID,
    ID.unique(),
    {
      ...packageData,
    }
  );
};

export const updatePackage = async (id: string, packageData: Partial<CreatePackageData>) => {
  return await adminDatabases.updateDocument(DATABASE_ID, PACKAGES_COLLECTION_ID, id, packageData);
};

export const deletePackage = async (id: string) => {
  return await adminDatabases.deleteDocument(DATABASE_ID, PACKAGES_COLLECTION_ID, id);
};

// Category CRUD operations
export const createCategory = async (categoryData: CreateCategoryData) => {
  return await adminDatabases.createDocument(
    DATABASE_ID,
    CATEGORIES_COLLECTION_ID,
    ID.unique(),
    categoryData
  );
};

export const updateCategory = async (id: string, categoryData: Partial<CreateCategoryData>) => {
  return await adminDatabases.updateDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, id, categoryData);
};

export const deleteCategory = async (id: string) => {
  return await adminDatabases.deleteDocument(DATABASE_ID, CATEGORIES_COLLECTION_ID, id);
};

// File operations
export const uploadImage = async (file: File) => {
  return await adminStorage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
};

export const deleteImage = async (imageId: string) => {
  return await adminStorage.deleteFile(STORAGE_BUCKET_ID, imageId);
};