import { getCatalog } from '@/lib/data/catalog';
import { formatPrice } from '@/lib/parsers/price';
import { cleanText, truncate } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import type { TravelPackage } from '@/types';

/**
 * /llms.txt — a plain-Markdown summary of the site for AI assistants and answer engines
 * (see llmstxt.org). Generated from the live catalogue.
 */
export async function GET() {
  const { packages, categories } = await getCatalog();
  const url = (path: string) => `${siteConfig.url}${path}`;
  const line = (p: TravelPackage) => {
    const facts = [p.durationLabel, p.price > 0 ? `from ${formatPrice(p.price)} per person` : '', p.categoryName].filter(Boolean).join(', ');
    const summary = truncate(p.subtitle || p.description, 120);
    return `- [${cleanText(p.title)}](${url(`/packages/${p.slug}`)}): ${facts}${summary ? `. ${summary}` : ''}`;
  };
  const tours = packages.filter((p) => p.section !== 'adventure');
  const adventures = packages.filter((p) => p.section === 'adventure');

  const body = `# ${siteConfig.name}

> ${siteConfig.name} is a travel agency based in ${siteConfig.address} that plans tour packages, weekend treks, pilgrimages and adventure activities across India. Trips are booked by WhatsApp or phone; prices are in Indian rupees (INR), per person, subject to availability.

- Phone / WhatsApp: ${siteConfig.phone}
- Email: ${siteConfig.email}
- Hours: Monday to Saturday, 9:00 AM – 8:00 PM IST
- How to book: open a package, press "Book Now" to send the trip details on WhatsApp, and the team replies with dates and a quote. Itineraries can be customised.

## Main pages

- [Home](${url('/')}): featured, popular and special packages
- [All tour packages](${url('/packages')}): every tour, filterable by category, price and duration
- [Travel styles](${url('/categories')}): trips grouped by category
- [Adventure activities](${url('/adventure')}): one-day activities such as paragliding, rafting and scuba diving
- [About](${url('/about')}): who we are
- [Contact](${url('/contact')}): phone, WhatsApp, email, callback requests and FAQs

## Travel styles

${categories.map((c) => `- [${cleanText(c.name)}](${url(`/categories/${c.slug}`)}): ${c.stats.count} ${c.stats.count === 1 ? 'trip' : 'trips'}${c.stats.minPrice ? ` from ${formatPrice(c.stats.minPrice)}` : ''}${c.subtitle ? `. ${cleanText(c.subtitle)}` : ''}`).join('\n')}

## Tour packages

${tours.map(line).join('\n')}

## Adventure activities

${adventures.map(line).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
