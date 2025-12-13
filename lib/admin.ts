import { Client, Databases, Storage, ID, Query } from 'appwrite';
import { Package, Category, Banner } from '@/types';

const adminClient = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  // .setKey(process.env.APPWRITE_API_KEY!);

const adminDatabases = new Databases(adminClient);
const adminStorage = new Storage(adminClient);

export const DATABASE_ID = '68cbec5d002f450d2c36';
export const PACKAGES_COLLECTION_ID = 'packages';
export const CATEGORIES_COLLECTION_ID = 'categories';
export const STORAGE_BUCKET_ID = '68cbee510018bf68f24c';
export const BANNERS_COLLECTION_ID = 'banners';

// Type for creating packages (excluding Appwrite document properties)
type CreatePackageData = Pick<Package, 'title' | 'subtitle' | 'days' | 'category' | 'imageId' | 'description' | 'whatsIncluded' | 'section'>;

// Type for creating categories (excluding Appwrite document properties)
type CreateCategoryData = Pick<Category, 'name' | 'description' | 'imageId'>;

type BannerData = Pick<Banner, 'title' | 'subtitle' | 'ctaLabel' | 'backgroundImageId'>;

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

export const upsertBanner = async (bannerData: BannerData) => {
  try {
    // Attempt to update first existing document
    const list = await adminDatabases.listDocuments(DATABASE_ID, BANNERS_COLLECTION_ID, [Query.limit(1)]);
    const existing = list.documents?.[0];
    if (existing) {
      return await adminDatabases.updateDocument(DATABASE_ID, BANNERS_COLLECTION_ID, existing.$id, bannerData);
    }
  } catch (error) {
    // ignore and create new below
  }

  return await adminDatabases.createDocument(DATABASE_ID, BANNERS_COLLECTION_ID, ID.unique(), bannerData);
};

// File operations
export const uploadImage = async (file: File) => {
  return await adminStorage.createFile(STORAGE_BUCKET_ID, ID.unique(), file);
};

export const deleteImage = async (imageId: string) => {
  return await adminStorage.deleteFile(STORAGE_BUCKET_ID, imageId);
};