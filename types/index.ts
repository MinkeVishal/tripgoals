import { Models } from 'appwrite';

export interface Package extends Models.Document {
  title: string;
  subtitle: string;
  duration: string;
  category: string;
  imageId: string;
  imageIds?: string[]; // Multiple images support
  description: string;
  whatsIncluded: string[];
  itinerary?: string[];
  section: string;
  price: string;
  createdAt: string;
  amenityIds?: string[]; // Amenity icons associated with this package
}

export interface Amenity extends Models.Document {
  name: string;
  icon: string; // FontAwesome icon class (e.g., 'fas fa-utensils')
}

export interface Category extends Models.Document {
  name: string;
  subtitle?: string;
  description: string;
  imageId: string;
  image?: string; // For hardcoded / external images
  price?: string;
  duration?: string;
  whatsIncluded?: string[];
}

export interface User extends Models.Document {
  FullName: string;
  number?: string;
  password?: string;
  email: string;
  role?: 'admin' | 'user';
  lastLogin?: string;
}

// Make document meta optional to avoid compile issues for local samples
export type Banner = Partial<Models.Document> & {
  title: string;
  subtitle: string;
  ctaLabel: string;
  backgroundImageId: string;
};

export interface AdminAuthState {
  isAuthenticated: boolean;
  timestamp: number;
}