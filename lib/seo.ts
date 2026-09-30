import type { Metadata } from 'next';
import { imageUrl } from '@/lib/appwrite/image-url';
import { formatPrice } from '@/lib/parsers/price';
import { siteConfig } from '@/lib/site-config';
import type { Category, TravelPackage } from '@/types';

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

/** Collapses whitespace/newlines and stray spaces before punctuation (common in admin-entered copy). */
export const cleanText = (text: string) =>
  text
    .replace(/\s+/g, ' ')
    .replace(/\s+([.,!?;:])/g, '$1')
    .trim();

/** Cuts at a word boundary so it fits `max` characters, adding an ellipsis when shortened. */
export function truncate(text: string, max: number) {
  const clean = cleanText(text);
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), max * 0.6)).replace(/[\s,.;:–-]+$/, '')}…`;
}

const sentence = (text: string) => {
  const t = cleanText(text);
  return t && !/[.!?…]$/.test(t) ? `${t}.` : t;
};

/** "5N/6D", "1 Day" or "" — compact enough for titles. */
export function shortDuration(pkg: Pick<TravelPackage, 'nights' | 'days'>) {
  if (pkg.nights && pkg.days) return `${pkg.nights}N/${pkg.days}D`;
  if (pkg.days) return pkg.days === 1 ? '1 Day' : `${pkg.days} Days`;
  if (pkg.nights) return `${pkg.nights} Nights`;
  return '';
}

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();

/** Share image for pages without a photo of their own (an existing bundled landscape). */
export const DEFAULT_SHARE_IMAGE = {
  url: '/hero/kashmir-meadow.jpg',
  width: 1400,
  height: 933,
  alt: 'Meadows and snow-capped peaks in Kashmir — TripGoals India tour packages',
};

/* ------------------------------------------------------------------ */
/* Metadata                                                            */
/* ------------------------------------------------------------------ */

interface PageMetaInput {
  /** Page title without the " | TripGoals" suffix (added by the root template). */
  title: string;
  description: string;
  /** Canonical path, e.g. "/packages/goa". */
  path: string;
  image?: { url: string; alt: string };
  /** Use the title as-is, without the site suffix. */
  absoluteTitle?: boolean;
}

/** Complete, page-specific metadata: title, description, canonical, Open Graph and Twitter. */
export function pageMetadata({ title, description, path, image, absoluteTitle }: PageMetaInput): Metadata {
  const desc = truncate(description, 160);
  const shareTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: siteConfig.name,
      locale: 'en_IN',
      url: path,
      title: shareTitle,
      description: desc,
      images: [image ? { url: image.url, alt: image.alt } : DEFAULT_SHARE_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description: desc,
      images: [image?.url ?? DEFAULT_SHARE_IMAGE.url],
    },
  };
}

/** Title for a package page, packed with the terms people search for, kept under ~48 chars + suffix. */
export function packageTitle(pkg: TravelPackage) {
  const base = cleanText(pkg.title).replace(/\s*-\s*/g, ' – ');
  const kind = pkg.section === 'adventure' ? 'Adventure' : /\b(tour|package|trip|trek|yatra|ride)\b/i.test(base) ? '' : 'Tour Package';
  const parts = [kind ? `${base} ${kind}` : base];
  const extras = [shortDuration(pkg), pkg.price > 0 ? `from ${formatPrice(pkg.price)}` : ''].filter(Boolean);
  let title = parts[0]!;
  for (const extra of extras) {
    const next = title.includes('·') ? `${title} ${extra}` : `${title} · ${extra}`;
    if (next.length <= 48) title = next;
  }
  return title;
}

/** Whole sentences from the start of `text` that fit in `room` characters ('' if none fit). */
function leadingSentences(text: string, room: number) {
  let out = '';
  for (const part of cleanText(text).match(/[^.!?]+[.!?]+/g) ?? []) {
    const next = `${out} ${part.trim()}`.trim();
    if (next.length > room) break;
    out = next;
  }
  return out;
}

/** Admin descriptions sometimes start with a raw itinerary ("AURANGABAD – DELHI …"); that makes a poor snippet. */
const looksLikeItinerary = (text: string) => {
  const head = cleanText(text).slice(0, 40);
  const letters = head.replace(/[^a-z]/gi, '');
  return /^day\s*\d/i.test(head) || (letters.length > 8 && letters.replace(/[^A-Z]/g, '').length / letters.length > 0.6);
};

export function packageDescription(pkg: TravelPackage) {
  const lead = [shortDuration(pkg) && pkg.durationLabel, `${cleanText(pkg.title)} ${pkg.section === 'adventure' ? 'experience' : 'trip'}`]
    .filter(Boolean)
    .join(' ');
  const price = pkg.price > 0 ? ` from ${formatPrice(pkg.price)} per person` : '';
  const intro = sentence(`${pkg.subtitle ? `${cleanText(pkg.subtitle)}: ` : ''}${lead}${price}`);
  const cta = ' Book on WhatsApp with TripGoals.';
  let room = 158 - intro.length - cta.length - 1;
  const parts: string[] = [];
  const add = (text: string) => {
    if (text && text.length <= room) {
      parts.push(text);
      room -= text.length + 1;
    }
  };
  // Prefer the admin's own opening sentences; otherwise fall back to facts shown on the page.
  add(pkg.description && !looksLikeItinerary(pkg.description) ? leadingSentences(pkg.description, room) : '');
  if (!parts.length) {
    const labels = pkg.amenities.map((a) => cleanText(a.label).toLowerCase()).filter(Boolean);
    for (let n = labels.length; n > 0 && !parts.length; n--) add(`Includes ${labels.slice(0, n).join(', ')}.`);
    if (pkg.itinerary.length) add(`${pkg.itinerary.length}-day itinerary.`);
    if (!parts.length && pkg.description && !looksLikeItinerary(pkg.description)) add(truncate(pkg.description, room));
  }
  return truncate(`${intro}${parts.length ? ` ${parts.join(' ')}` : ''}${cta}`, 160);
}

export function categoryTitle(category: Category) {
  const name = cleanText(category.name);
  return /packages?$/i.test(name) ? name : `${name} Tour Packages`;
}

export function categoryDescription(category: Category) {
  const { count, minPrice } = category.stats;
  const stats = `${count} ${count === 1 ? 'trip' : 'trips'}${minPrice ? ` from ${formatPrice(minPrice)}` : ''}`;
  const about = category.description || category.subtitle;
  return truncate(
    `${categoryTitle(category)} by TripGoals: ${stats}.${about ? ` ${sentence(about)}` : ''} Compare itineraries, inclusions and prices, then book on WhatsApp.`,
    160,
  );
}

/* ------------------------------------------------------------------ */
/* JSON-LD                                                             */
/* ------------------------------------------------------------------ */

export const ORG_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;

type Json = Record<string, unknown>;

/** Serialises JSON-LD safely for inline <script> tags. */
export const jsonLdString = (data: Json | Json[]) => JSON.stringify(data).replace(/</g, '\\u003c');

export function organizationLd(): Json {
  return {
    '@type': 'TravelAgency',
    '@id': ORG_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: { '@type': 'ImageObject', url: absoluteUrl('/Tripgoal_logo.png'), width: 500, height: 500 },
    image: absoluteUrl(DEFAULT_SHARE_IMAGE.url),
    description: siteConfig.description,
    slogan: siteConfig.tagline,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    areaServed: { '@type': 'Country', name: 'India' },
    knowsLanguage: ['en', 'hi', 'mr'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Chhatrapati Sambhajinagar',
      addressRegion: 'Maharashtra',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        telephone: siteConfig.phone,
        email: siteConfig.email,
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Marathi'],
      },
    ],
    sameAs: [siteConfig.instagramUrl.split('?')[0], ...Object.values(siteConfig.socials)].filter(Boolean),
  };
}

export function websiteLd(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: 'en-IN',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${siteConfig.url}/packages?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', path: '/' }, ...items].map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function packageListLd(name: string, packages: TravelPackage[]): Json {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: packages.length,
    itemListElement: packages.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/packages/${p.slug}`),
      name: cleanText(p.title),
    })),
  };
}

export function collectionPageLd({ name, description, path, items }: { name: string; description: string; path: string; items: Json }): Json {
  return {
    '@type': 'CollectionPage',
    '@id': `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name,
    description: truncate(description, 300),
    inLanguage: 'en-IN',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: items,
  };
}

export function touristTripLd(pkg: TravelPackage): Json {
  const url = absoluteUrl(`/packages/${pkg.slug}`);
  return {
    '@type': 'TouristTrip',
    '@id': `${url}#trip`,
    url,
    name: cleanText(pkg.title),
    description: truncate(pkg.description || pkg.subtitle || pkg.title, 500),
    image: pkg.images.map(imageUrl),
    touristType: pkg.categoryName || undefined,
    provider: { '@id': ORG_ID },
    offers:
      pkg.price > 0
        ? {
            '@type': 'Offer',
            url,
            price: pkg.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: { '@id': ORG_ID },
          }
        : undefined,
    ...(pkg.itinerary.length
      ? {
          itinerary: {
            '@type': 'ItemList',
            numberOfItems: pkg.itinerary.length,
            itemListElement: pkg.itinerary.map((day, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: `Day ${i + 1}: ${cleanText(day.title)}`,
              ...(day.points.length ? { description: truncate(day.points.join('. '), 300) } : {}),
            })),
          },
        }
      : {}),
  };
}

export function faqLd(faqs: { question: string; answer: string }[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Wraps nodes in a single @graph document. */
export const graph = (...nodes: Json[]): Json => ({ '@context': 'https://schema.org', '@graph': nodes });
