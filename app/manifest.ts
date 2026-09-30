import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — India Tour Packages`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fbfcfa',
    theme_color: '#2f4a22',
    lang: 'en-IN',
    categories: ['travel'],
    icons: [
      { src: '/Tripgoal_logo.png', sizes: '192x192', type: 'image/png' },
      { src: '/Tripgoal_logo.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
