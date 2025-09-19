import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Calendar, MapPin, MessageCircle, Users, CheckCircle } from 'lucide-react';
import { Package } from '@/types';
import { getPackages, getPackageById, getImageUrl } from '@/lib/appwrite';
import toast from 'react-hot-toast';
import PackageDetails from './PackageDetails';

// export async function generateStaticParams() {
//   try {
//     const response = await getPackages();
//     const packages = response.documents as unknown as Package[];

//     return packages.map((pkg) => ({
//       id: pkg.$id,
//     }));
//   } catch (error) {
//     console.error('Error generating static params:', error);
//     return [];
//   }
// }


export default function PackagePage() {


  return (
    <PackageDetails />
  );
}