/**
 * TripGoals v2 — cutover. Run this when the v2 site is deployed, NOT before.
 *
 *   npx tsx --env-file=.env scripts/cutover-v2.ts              # dry run (default)
 *   npx tsx --env-file=.env scripts/cutover-v2.ts --apply      # performs everything
 *   npx tsx --env-file=.env scripts/cutover-v2.ts --apply --only=lockdown
 *
 * Stages (all run unless --only is given):
 *   seed      Insert the 10 adventure activities that used to be hardcoded (photos are downloaded
 *             and stored in your bucket) and create the hero/promo banner rows.
 *   lockdown  Remove public create/update/delete on every table and on the images bucket.
 *             Reads stay public; ALL writes then go through the API key on the server.
 *   users     Delete the legacy `users` table (it stored plaintext passwords). Refuses to run if it
 *             still contains rows, unless --force is passed.
 *
 * WARNING: `lockdown` stops the OLD site's browser-side admin from writing, by design.
 */
import { Client, ID, Permission, Query, Role, Storage, TablesDB, type Models } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { normaliseName } from '../lib/data/mappers';
import { formatDuration } from '../lib/parsers/duration';
import { encodeAmenity } from '../lib/parsers/amenities';
import { slugify, uniqueSlug } from '../lib/parsers/slug';

const APPLY = process.argv.includes('--apply');
const FORCE = process.argv.includes('--force');
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.split('=')[1];
const wants = (stage: string) => !ONLY || ONLY === stage;

const DATABASE_ID = '68cbec5d002f450d2c36';
const BUCKET_ID = '68cbee510018bf68f24c';
const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);
const db = new TablesDB(client);
const storage = new Storage(client);
const log = (msg: string) => console.log(`${APPLY ? '' : '[dry] '}${msg}`);

interface SeedAdventure {
  title: string;
  subtitle: string;
  price: number;
  description: string;
  inclusions: string[];
  image: string;
}

// Content of the activities that were hardcoded in the old AdventureSection / adventure page.
const ADVENTURES: SeedAdventure[] = [
  { title: 'Malvan Water Sports', subtitle: 'Exciting water activities at Malvan beach', price: 3500, image: 'https://cdn.thegoavilla.com/static/img/articles/goa-water-sports.jpg', description: 'Experience thrilling water sports at Malvan beach including jet skiing, parasailing, and scuba diving.', inclusions: ['Water sports equipment', 'Safety gear', 'Professional instructors', 'Beach lunch', 'Transportation'] },
  { title: 'Goa Water Activities', subtitle: 'Beach fun and water sports in Goa', price: 4000, image: 'https://goabeachwatersports.com/wp-content/uploads/2018/11/parasailing-in-goa-1532506746-e1576503895532.jpg', description: "Enjoy various water activities on Goa's beautiful beaches. Perfect for adventure enthusiasts.", inclusions: ['Water sports', 'Beach activities', 'Safety equipment', 'Refreshments', 'Beach access'] },
  { title: 'Paragliding', subtitle: 'Soar through the skies', price: 2500, image: 'https://cdn.pixabay.com/photo/2015/03/31/18/47/paraglider-701440_1280.jpg', description: 'Experience the thrill of paragliding with certified instructors. Soar above beautiful landscapes.', inclusions: ['Paragliding equipment', 'Certified instructor', 'Safety briefing', 'Video recording', 'Certificate'] },
  { title: 'Bungee Jumping', subtitle: 'Ultimate adrenaline rush', price: 4000, image: 'https://miro.medium.com/v2/resize:fit:669/1*tmHq_5mEp_OrXjJ0BuoI8w.jpeg', description: "Take the ultimate leap of faith with India's highest bungee jump. Feel the adrenaline rush like never before.", inclusions: ['Safety equipment', 'Professional supervision', 'Medical support', 'Jump video', 'Certificate'] },
  { title: 'Rappelling', subtitle: 'Descend cliff faces', price: 2000, image: 'https://images.unsplash.com/photo-1557685888-2d3621ddf615?q=80&w=685&auto=format&fit=crop', description: 'Learn the art of rappelling and descend cliff faces safely with professional guidance.', inclusions: ['Rappelling gear', 'Safety equipment', 'Professional guide', 'Training session', 'Certificate'] },
  { title: 'Kashmir Gondola Ride', subtitle: 'Scenic cable car rides', price: 1500, image: 'https://charzanholidays.com/wp-content/uploads/2024/07/Gulmarg.jpg', description: 'Enjoy breathtaking views of Kashmir from the famous Gulmarg Gondola, one of the highest cable cars in the world.', inclusions: ['Gondola tickets', 'Scenic views', 'Photography opportunities', 'Local guide', 'Refreshments'] },
  { title: 'River Rafting', subtitle: 'Navigate thrilling rapids', price: 3000, image: 'https://images.unsplash.com/photo-1629248457649-b082812aea6c?w=1200&auto=format&fit=crop&q=70', description: 'Experience the thrill of white water rafting through exciting rapids with professional guides.', inclusions: ['Rafting equipment', 'Safety gear', 'Professional guide', 'Lunch', 'Transportation'] },
  { title: 'Rock Climbing', subtitle: 'Scale challenging rock faces', price: 2500, image: 'https://27crags.s3.amazonaws.com/photos/000/384/384110/size_m-60cb2f6afd63676c62143b6984f08253.jpg', description: 'Challenge yourself with rock climbing on natural rock formations with expert instruction.', inclusions: ['Climbing gear', 'Safety equipment', 'Expert instructor', 'Training', 'Certificate'] },
  { title: 'Scuba Diving', subtitle: 'Explore underwater marine life', price: 5000, image: 'https://plus.unsplash.com/premium_photo-1661894232140-73d96a67731b?w=1200&auto=format&fit=crop&q=70', description: 'Discover the underwater world with certified scuba diving experiences in crystal clear waters.', inclusions: ['Diving equipment', 'Certified instructor', 'Underwater photography', 'Marine life guide', 'Certificate'] },
  { title: 'Zip Lining', subtitle: 'High-speed canopy adventures', price: 1800, image: 'https://images.unsplash.com/photo-1675259113512-db50297ce326?w=1200&auto=format&fit=crop&q=70', description: 'Zip through forest canopies at high speeds for an exhilarating adventure experience.', inclusions: ['Zip line equipment', 'Safety gear', 'Professional guide', 'Multiple zip lines', 'Refreshments'] },
];

type AnyRow = Models.Row & Record<string, unknown>;

const ALL_ROWS = async (tableId: string) => {
  const rows: AnyRow[] = [];
  let cursor: string | undefined;
  for (;;) {
    const q = [Query.limit(100)];
    if (cursor) q.push(Query.cursorAfter(cursor));
    const page = await db.listRows<AnyRow>({ databaseId: DATABASE_ID, tableId, queries: q, total: false });
    rows.push(...page.rows);
    if (page.rows.length < 100) return rows;
    cursor = page.rows[page.rows.length - 1]!.$id;
  }
};

async function uploadFromUrl(url: string, name: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 TripGoals-migration' } });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || !type.startsWith('image/')) throw new Error(`HTTP ${res.status} ${type}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    if (bytes.byteLength > 9 * 1024 * 1024) throw new Error('image larger than 9 MB');
    const created = await storage.createFile({ bucketId: BUCKET_ID, fileId: ID.unique(), file: InputFile.fromBuffer(bytes, name) });
    return created.$id;
  } catch (error) {
    console.warn(`  ! could not import photo for "${name}" (${(error as Error).message}) — add one in the dashboard`);
    return null;
  }
}

async function seed() {
  console.log('\n== seed ==');
  const categories = await ALL_ROWS('categories');
  const packages = await ALL_ROWS('packages');
  const category = categories.find((c) => normaliseName(String(c.name)) === 'nature & adventure');
  if (!category) console.warn('  ! category "Nature & Adventure" not found; adventures will have no category');

  const slugs = packages.map((p) => String(p.slug ?? ''));
  const existingTitles = new Set(packages.map((p) => normaliseName(String(p.title ?? ''))));

  for (const a of ADVENTURES) {
    if (existingTitles.has(normaliseName(a.title))) {
      log(`= adventure "${a.title}" already exists — skipped`);
      continue;
    }
    log(`+ adventure "${a.title}" (₹${a.price})`);
    if (!APPLY) continue;
    const slug = uniqueSlug(slugify(a.title), slugs);
    slugs.push(slug);
    const imageId = await uploadFromUrl(a.image, a.title);
    await db.createRow({
      databaseId: DATABASE_ID,
      tableId: 'packages',
      rowId: ID.unique(),
      data: {
        title: a.title,
        subtitle: a.subtitle,
        category: category ? String(category.name).trim() : 'Nature & Adventure',
        categoryId: category?.$id ?? null,
        section: 'adventure',
        price: a.price,
        nights: null,
        days: 1,
        duration: formatDuration({ nights: null, days: 1 }),
        destination: a.title,
        description: a.description,
        order: 0,
        slug,
        imageIds: imageId ? [imageId] : [],
        imageId: imageId ?? '',
        whatsIncluded: a.inclusions,
        amenities: [encodeAmenity({ icon: 'guide', label: 'Expert guide' }), encodeAmenity({ icon: 'check', label: 'Safety gear' })],
        itineraryDays: [],
      },
    });
  }

  for (const key of ['hero', 'promo'] as const) {
    const existing = await db.getRow({ databaseId: DATABASE_ID, tableId: 'banners', rowId: key }).catch(() => null);
    if (existing) {
      log(`= banner "${key}" already exists — skipped`);
      continue;
    }
    log(`+ banner "${key}"`);
    if (!APPLY) continue;
    await db.createRow({
      databaseId: DATABASE_ID,
      tableId: 'banners',
      rowId: key,
      data:
        key === 'hero'
          ? { key, title: 'Discover Incredible India', subtitle: 'Experience the magic of India with our travel packages', ctaLabel: 'Explore All Packages', ctaUrl: '/packages', imageIds: [], active: true }
          : { key, title: 'Experience Fun', subtitle: 'Check our stunning tour experiences', ctaLabel: 'See More', ctaUrl: 'https://www.instagram.com/reel/DC22Ob6ICGn/', imageIds: [], active: true },
    });
  }
}

async function lockdown() {
  console.log('\n== lockdown ==');
  const readOnly = [Permission.read(Role.any())];
  for (const tableId of ['packages', 'categories', 'banners']) {
    log(`~ table ${tableId}: public read only, rowSecurity off`);
    if (APPLY) {
      const t = await db.getTable({ databaseId: DATABASE_ID, tableId });
      await db.updateTable({ databaseId: DATABASE_ID, tableId, name: t.name, permissions: readOnly, rowSecurity: false });
    }
  }
  log('~ table wishlists: no public access, rowSecurity on');
  if (APPLY) {
    const t = await db.getTable({ databaseId: DATABASE_ID, tableId: 'wishlists' });
    await db.updateTable({ databaseId: DATABASE_ID, tableId: 'wishlists', name: t.name, permissions: [], rowSecurity: true });
  }
  log('~ bucket images: public read only, images only, max 10 MB');
  if (APPLY) {
    const b = await storage.getBucket({ bucketId: BUCKET_ID });
    await storage.updateBucket({
      bucketId: BUCKET_ID,
      name: b.name,
      permissions: readOnly,
      fileSecurity: false,
      enabled: true,
      maximumFileSize: 10 * 1024 * 1024,
      allowedFileExtensions: ['jpg', 'jpeg', 'png', 'webp', 'avif'],
    });
  }
}

async function dropUsersTable() {
  console.log('\n== users ==');
  const tables = await db.listTables({ databaseId: DATABASE_ID });
  if (!tables.tables.some((t) => t.$id === 'users')) return log('= legacy users table already gone');
  const rows = await db.listRows({ databaseId: DATABASE_ID, tableId: 'users', queries: [Query.limit(1)] });
  if (rows.total > 0 && !FORCE) {
    console.warn(`  ! legacy users table has ${rows.total} row(s) (contains plaintext passwords). Export what you need, then re-run with --force.`);
    return;
  }
  log(`- delete legacy users table (${rows.total} rows)`);
  if (APPLY) await db.deleteTable({ databaseId: DATABASE_ID, tableId: 'users' });
}

console.log(APPLY ? 'APPLYING v2 cutover…' : 'DRY RUN — pass --apply to write.');
if (wants('seed')) await seed();
if (wants('lockdown')) await lockdown();
if (wants('users')) await dropUsersTable();
console.log('\nDone.');
