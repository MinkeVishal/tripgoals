/**
 * TripGoals v2 — additive migration (safe while the old site is live).
 *
 *   npx tsx --env-file=.env scripts/migrate-v2.ts            # dry run, prints the plan
 *   npx tsx --env-file=.env scripts/migrate-v2.ts --apply    # performs it
 *
 * Adds NEW columns/tables only and backfills them from the legacy columns using the same
 * mappers the app uses at runtime. Nothing the old site reads is modified, so it keeps working.
 * Destructive steps (locking permissions, seeding adventures, dropping the users table) live in
 * scripts/cutover-v2.ts and run only when v2 is deployed.
 */
import { Client, Permission, Role, TablesDB, TablesDBIndexType, Query, type Models } from 'node-appwrite';
import { normaliseName, toCategoryBase, toPackage } from '../lib/data/mappers';
import { encodeAmenity } from '../lib/parsers/amenities';
import { encodeItineraryDay } from '../lib/parsers/itinerary';
import { uniqueSlug } from '../lib/parsers/slug';

const APPLY = process.argv.includes('--apply');
const DATABASE_ID = '68cbec5d002f450d2c36';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);
const db = new TablesDB(client);

const log = (msg: string) => console.log(`${APPLY ? '' : '[dry] '}${msg}`);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type ColumnSpec =
  | { key: string; type: 'string'; size: number; array?: boolean; required?: boolean }
  | { key: string; type: 'integer'; array?: never; required?: boolean; default?: number }
  | { key: string; type: 'boolean'; default?: boolean };

async function existingColumns(tableId: string): Promise<Set<string>> {
  const res = await db.listColumns({ databaseId: DATABASE_ID, tableId });
  return new Set(res.columns.map((c) => c.key));
}

async function waitForColumns(tableId: string, keys: string[]) {
  for (let i = 0; i < 60; i++) {
    const res = await db.listColumns({ databaseId: DATABASE_ID, tableId });
    const pending = res.columns.filter((c) => keys.includes(c.key) && c.status !== 'available');
    if (pending.length === 0) return;
    await sleep(1000);
  }
  throw new Error(`Timed out waiting for columns on ${tableId}`);
}

async function ensureColumns(tableId: string, specs: ColumnSpec[]) {
  const have = await existingColumns(tableId).catch(() => new Set<string>());
  const missing = specs.filter((s) => !have.has(s.key));
  for (const s of missing) {
    log(`+ column ${tableId}.${s.key} (${s.type})`);
    if (!APPLY) continue;
    if (s.type === 'string') {
      await db.createStringColumn({
        databaseId: DATABASE_ID,
        tableId,
        key: s.key,
        size: s.size,
        required: s.required ?? false,
        array: s.array ?? false,
      });
    } else if (s.type === 'integer') {
      await db.createIntegerColumn({
        databaseId: DATABASE_ID,
        tableId,
        key: s.key,
        required: s.required ?? false,
        ...(s.default !== undefined ? { xdefault: s.default } : {}),
      });
    } else {
      await db.createBooleanColumn({
        databaseId: DATABASE_ID,
        tableId,
        key: s.key,
        required: false,
        ...(s.default !== undefined ? { xdefault: s.default } : {}),
      });
    }
  }
  if (APPLY && missing.length) await waitForColumns(tableId, missing.map((s) => s.key));
}

async function ensureIndex(tableId: string, key: string, type: TablesDBIndexType, columns: string[]) {
  const res = await db.listIndexes({ databaseId: DATABASE_ID, tableId }).catch(() => ({ indexes: [] }));
  if (res.indexes.some((i) => i.key === key)) return;
  log(`+ index ${tableId}.${key} (${type}: ${columns.join(', ')})`);
  if (!APPLY) return;
  await db.createIndex({ databaseId: DATABASE_ID, tableId, key, type, columns });
  for (let i = 0; i < 60; i++) {
    const cur = await db.listIndexes({ databaseId: DATABASE_ID, tableId });
    if (cur.indexes.find((x) => x.key === key)?.status === 'available') return;
    await sleep(1000);
  }
}

async function ensureTable(tableId: string, name: string, permissions: string[], rowSecurity: boolean) {
  const tables = await db.listTables({ databaseId: DATABASE_ID });
  if (tables.tables.some((t) => t.$id === tableId)) return;
  log(`+ table ${tableId}`);
  if (APPLY) await db.createTable({ databaseId: DATABASE_ID, tableId, name, permissions, rowSecurity });
}

async function main() {
  console.log(APPLY ? 'Applying v2 additive migration…' : 'DRY RUN — pass --apply to write.');

  // ---- schema -------------------------------------------------------------------------
  await ensureColumns('packages', [
    { key: 'slug', type: 'string', size: 128 },
    { key: 'categoryId', type: 'string', size: 36 },
    { key: 'nights', type: 'integer' },
    { key: 'days', type: 'integer' },
    { key: 'destination', type: 'string', size: 128 },
    { key: 'order', type: 'integer', default: 0 },
    { key: 'amenities', type: 'string', size: 255, array: true },
    { key: 'itineraryDays', type: 'string', size: 5000, array: true },
  ]);
  await ensureColumns('categories', [
    { key: 'slug', type: 'string', size: 128 },
    { key: 'order', type: 'integer', default: 0 },
  ]);

  await ensureTable('banners', 'banners', [Permission.read(Role.any())], false);
  if (APPLY) {
    await ensureColumns('banners', [
      { key: 'key', type: 'string', size: 16, required: true },
      { key: 'title', type: 'string', size: 200 },
      { key: 'subtitle', type: 'string', size: 500 },
      { key: 'ctaLabel', type: 'string', size: 60 },
      { key: 'ctaUrl', type: 'string', size: 500 },
      { key: 'imageIds', type: 'string', size: 64, array: true },
      { key: 'active', type: 'boolean', default: true },
    ]);
  } else {
    log('+ columns banners.{key,title,subtitle,ctaLabel,ctaUrl,imageIds,active}');
  }

  await ensureTable('wishlists', 'wishlists', [], true);
  if (APPLY) {
    await ensureColumns('wishlists', [
      { key: 'userId', type: 'string', size: 36, required: true },
      { key: 'packageId', type: 'string', size: 36, required: true },
    ]);
    await ensureIndex('wishlists', 'user_package', TablesDBIndexType.Unique, ['userId', 'packageId']);
    await ensureIndex('wishlists', 'by_package', TablesDBIndexType.Key, ['packageId']);
  } else {
    log('+ columns wishlists.{userId,packageId} + indexes user_package (unique), by_package');
  }

  // ---- backfill -----------------------------------------------------------------------
  const listAll = async (tableId: string) => {
    const rows: Array<Models.Row & Record<string, unknown>> = [];
    let cursor: string | undefined;
    for (;;) {
      const q = [Query.limit(100), Query.orderAsc('$createdAt')];
      if (cursor) q.push(Query.cursorAfter(cursor));
      const page = await db.listRows<Models.Row & Record<string, unknown>>({ databaseId: DATABASE_ID, tableId, queries: q, total: false });
      rows.push(...page.rows);
      if (page.rows.length < 100) return rows;
      cursor = page.rows[page.rows.length - 1]!.$id;
    }
  };

  const categoryRows = await listAll('categories');
  const packageRows = await listAll('packages');

  const catSlugs: string[] = [];
  const categories = categoryRows.map((row, i) => {
    const base = toCategoryBase(row as never);
    base.slug = uniqueSlug(base.slug, catSlugs);
    catSlugs.push(base.slug);
    return { row, base, order: i };
  });
  const lookup = {
    byId: new Map(categories.map((c) => [c.base.id, c.base])),
    byName: new Map(categories.map((c) => [normaliseName(c.base.name), c.base])),
  };

  for (const { row, base, order } of categories) {
    if (row.slug === base.slug && row.order === order) continue;
    log(`~ category "${base.name}" → slug=${base.slug} order=${order}`);
    if (APPLY) {
      await db.updateRow({
        databaseId: DATABASE_ID,
        tableId: 'categories',
        rowId: row.$id,
        data: { slug: base.slug, order },
      });
    }
  }

  const pkgSlugs: string[] = [];
  let updated = 0;
  let unmatched = 0;
  for (const row of packageRows) {
    const pkg = toPackage(row as never, lookup);
    pkg.slug = uniqueSlug(pkg.slug, pkgSlugs);
    pkgSlugs.push(pkg.slug);
    if (!pkg.categoryId) unmatched++;

    const wanted: Record<string, unknown> = {
      slug: pkg.slug,
      categoryId: pkg.categoryId,
      nights: pkg.nights,
      days: pkg.days,
      destination: pkg.destination,
      amenities: pkg.amenities.map(encodeAmenity),
      itineraryDays: pkg.itinerary.map(encodeItineraryDay),
      imageIds: pkg.images,
    };
    const changed = Object.entries(wanted).filter(
      ([k, v]) => JSON.stringify(row[k] ?? null) !== JSON.stringify(v ?? null),
    );
    if (changed.length === 0) continue;
    updated++;
    log(`~ package "${pkg.title}" → ${changed.map(([k]) => k).join(', ')}`);
    if (APPLY) {
      await db.updateRow({
        databaseId: DATABASE_ID,
        tableId: 'packages',
        rowId: row.$id,
        data: Object.fromEntries(changed),
      });
    }
  }

  // Indexes need populated, unique slugs.
  if (APPLY) {
    await ensureIndex('packages', 'slug_unique', TablesDBIndexType.Unique, ['slug']);
    await ensureIndex('packages', 'by_section', TablesDBIndexType.Key, ['section']);
    await ensureIndex('packages', 'by_category', TablesDBIndexType.Key, ['categoryId']);
    await ensureIndex('categories', 'slug_unique', TablesDBIndexType.Unique, ['slug']);
  } else {
    log('+ indexes packages.{slug_unique,by_section,by_category}, categories.slug_unique');
  }

  console.log(
    `\n${categories.length} categories, ${packageRows.length} packages checked; ${updated} package rows ${APPLY ? 'updated' : 'would change'}.`,
  );
  if (unmatched) console.warn(`WARNING: ${unmatched} package(s) could not be matched to a category.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
