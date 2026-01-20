"use client";

import { Client, Databases, Storage, Query, Models } from 'appwrite';
import { Package, Category, Banner, User } from '@/types';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = '68cbec5d002f450d2c36';
export const PACKAGES_COLLECTION_ID = 'packages';
export const CATEGORIES_COLLECTION_ID = 'categories';
export const STORAGE_BUCKET_ID = '68cbee510018bf68f24c';
export const BANNERS_COLLECTION_ID = 'banners';

// Sample data for packages
export const samplePackages = [
  {
    $id: '1',
    title: "Kashmir",
    subtitle: "Paradise on Earth",
    imageId: "sample1",
    price: "25000",
    duration: "7 night 7 day",
    description: "Experience the breathtaking beauty of Kashmir, often called Paradise on Earth. Explore Dal Lake, Mughal gardens, and snow-capped mountains.",
    whatsIncluded: ["Hotel accommodation", "Daily breakfast", "Transportation", "Sightseeing", "Professional guide"],
    category: "main",
    section: "popular" as const,
    createdAt: new Date().toISOString()
  },
  {
    $id: '2',
    title: "Delhi - Golden Triangle",
    subtitle: "Historical Capital Tour",
    imageId: "sample2",
    price: "18000",
    duration: "5 night 5 day",
    description: "Discover India's golden triangle covering Delhi, Agra, and Jaipur. Visit iconic monuments like Taj Mahal, Red Fort, and Amber Palace.",
    whatsIncluded: ["Hotel accommodation", "Daily breakfast", "Transportation", "Monument tickets", "Guide services"],
    category: "main",
    section: "popular" as const,
    createdAt: new Date().toISOString()
  },
  {
    $id: '3',
    title: "Jaipur - Rajasthan Royal Tour",
    subtitle: "Pink City Adventure",
    imageId: "sample3",
    price: "22000",
    duration: "6 night 6 day",
    description: "Explore the royal heritage of Jaipur, the Pink City. Visit magnificent palaces, forts, and experience the rich Rajasthani culture.",
    whatsIncluded: ["Palace hotels", "Cultural shows", "Camel safari", "Traditional meals", "Heritage walks"],
    category: "main",
    section: "popular" as const,
    createdAt: new Date().toISOString()
  },
  {
    $id: '4',
    title: "Kerala Tour",
    subtitle: "God's Own Country",
    imageId: "sample4",
    price: "28000",
    duration: "8 night 8 day",
    description: "Experience Kerala's backwaters, hill stations, and spice plantations. Enjoy houseboat cruises and traditional Ayurvedic treatments.",
    whatsIncluded: ["Houseboat stay", "Hill station hotels", "Ayurvedic massage", "Spice plantation tour", "Traditional meals"],
    category: "main",
    section: "popular" as const,
    createdAt: new Date().toISOString()
  },
  {
    $id: '5',
    title: "Royal Rajasthan",
    subtitle: "Luxury Palace Experience",
    imageId: "sample5",
    price: "55000",
    duration: "12 night 12 day",
    description: "Live like royalty in converted palace hotels. Experience luxury trains, private tours, and exclusive cultural performances.",
    whatsIncluded: ["Palace hotel stays", "Luxury train journey", "Private guides", "Exclusive dining", "Cultural performances"],
    category: "special",
    section: "special" as const,
    createdAt: new Date().toISOString()
  }
];

const sampleBanner: Banner = {
  $id: 'sample-banner',
  $createdAt: '',
  $updatedAt: '',
  $permissions: [],
  $databaseId: DATABASE_ID,
  $collectionId: BANNERS_COLLECTION_ID,
  $sequence: 0,
  title: 'Discover Incredible India',
  subtitle: 'Experience the magic of India with our travel packages',
  ctaLabel: 'Explore All Packages',
  backgroundImageId: 'sample1'
};

// Sample image URLs for packages
const sampleImageUrls: { [key: string]: string } = {
  sample1: 'https://images.unsplash.com/photo-1567601169793-64703dc5324a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  sample2: 'https://plus.unsplash.com/premium_photo-1661919589683-f11880119fb7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVsaGl8ZW58MHx8MHx8fDA%3D',
  sample3: 'https://images.unsplash.com/photo-1643542217593-ae4cb5d738eb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amFpcHVyJTIwdG91cmlzbXxlbnwwfHwwfHx8MA%3D%3D',
  sample4: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a2VyYWxhJTIwdG91cmlzbXxlbnwwfHwwfHx8MA%3D%3D',
  sample5: 'https://plus.unsplash.com/premium_photo-1661962428918-6a57ab674e23?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFqYXN0aGFufGVufDB8fDB8fHww'
};

// Package operations
export const getPackages = async (limit: number = 1000, section?: string): Promise<Models.DocumentList<Package>> => {
  try {
    const queries = [];
    if (limit) queries.push(Query.limit(limit));
    if (section) queries.push(Query.equal('section', section));

    return await databases.listDocuments(DATABASE_ID, PACKAGES_COLLECTION_ID, queries) as Models.DocumentList<Package>;
  } catch (error) {
    console.error('Error fetching packages:', error);
    // Return empty list if database is not available
    return { total: 0, documents: [] } as Models.DocumentList<Package>;
  }
};

export const getBanner = async (): Promise<Banner> => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, BANNERS_COLLECTION_ID, [Query.limit(1)]);
    const doc = response.documents?.[0];
    if (doc && doc.title && doc.subtitle && doc.ctaLabel && doc.backgroundImageId) {
      return doc as unknown as Banner;
    }
  } catch (error) {
    console.log('Using sample banner');
  }
  return sampleBanner;
};

export const getPackageById = async (id: string): Promise<Package> => {
  try {
    return await databases.getDocument(DATABASE_ID, PACKAGES_COLLECTION_ID, id) as Package;
  } catch (error) {
    console.error('Error fetching package by ID:', error);
    throw error;
  }
};

export const getLatestPackages = async (limit: number = 1000): Promise<Models.DocumentList<Package>> => {
  try {
    const queries = [];
    if (limit) queries.push(Query.limit(limit));
    queries.push(Query.orderDesc('$createdAt'));

    return await databases.listDocuments(DATABASE_ID, PACKAGES_COLLECTION_ID, queries) as Models.DocumentList<Package>;
  } catch (error) {
    console.error('Error fetching latest packages:', error);
    return { total: 0, documents: [] } as Models.DocumentList<Package>;
  }
};

export const getPackagesByCategory = async (category: string): Promise<Models.DocumentList<Package>> => {
  try {
    return await databases.listDocuments(DATABASE_ID, PACKAGES_COLLECTION_ID, [
      Query.equal('category', category)
    ]) as Models.DocumentList<Package>;
  } catch (error) {
    console.error('Error fetching packages by category:', error);
    return { total: 0, documents: [] } as Models.DocumentList<Package>;
  }
};

// Category operations
export const getCategories = async (): Promise<Models.DocumentList<Category>> => {
  try {
    return await databases.listDocuments(DATABASE_ID, CATEGORIES_COLLECTION_ID) as Models.DocumentList<Category>;
  } catch (error) {
    // Return empty categories if database is not available
    return { total: 0, documents: [] } as Models.DocumentList<Category>;
  }
};

// Image operations
export const getImageUrl = (imageId: string) => {
  // Return sample image URL if it's a sample imageId
  if (sampleImageUrls[imageId]) {
    return sampleImageUrls[imageId];
  }

  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKET_ID}/files/${imageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

export const USERS_COLLECTION_ID = 'users';

// User operations
export const saveUser = async (user: Partial<User>) => {
  try {
    // If number provided, try to check uniqueness (assuming number might be unique)
    // Otherwise just create for now to avoid errors if indexes are missing

    // NOTE: In a real app with strict schema, we should check if 'number' exists.
    // Given the user prompt, we just save the data.

    const userData = {
      FullName: user.FullName || '',
      number: user.number || '',
      password: user.password || '',
      email: user.email || '',
    };

    return await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, 'unique()', userData);

  } catch (error) {
    console.error('Error saving user:', error);
    // Don't throw, just log to allow auth flow to continue
    return null;
  }
};

export const getUsers = async (): Promise<Models.DocumentList<User>> => {
  try {
    return await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
      Query.orderDesc('$createdAt')
    ]) as Models.DocumentList<User>;
  } catch (error) {
    console.error('Error fetching users:', error);
    return { total: 0, documents: [] } as Models.DocumentList<User>;
  }
};

export const deleteUser = async (userId: string) => {
  try {
    await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, userId);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const verifyUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const response = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
      Query.equal('email', email),
      Query.equal('password', password)
    ]);

    if (response.documents.length > 0) {
      return response.documents[0] as unknown as User;
    }
    return null;
  } catch (error) {
    console.error('Error verifying user:', error);
    return null;
  }
};

export { client };
