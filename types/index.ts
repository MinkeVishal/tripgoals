import { Models } from 'appwrite';

export interface Package extends Models.Document {
  title: string;
  subtitle: string;
  days: number;
  category: string;
  imageId: string;
  description: string;
  whatsIncluded: string[];
  section: 'popular' | 'special' | 'other';
  price: string;
  createdAt: string;
}

export interface Category extends Models.Document {
  name: string;
  description: string;
  imageId: string;
}

export interface AdminAuthState {
  isAuthenticated: boolean;
  timestamp: number;
}