// Snapshot every row of every table to appwrite/backup/*.json.
// Usage: node --env-file=.env scripts/backup-appwrite.mjs
import { mkdir, writeFile } from 'node:fs/promises';

const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const project = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const key = process.env.APPWRITE_API_KEY;
const DATABASE_ID = '68cbec5d002f450d2c36';
const TABLES = ['packages', 'categories', 'users'];

if (!endpoint || !project || !key) {
  console.error('Missing NEXT_PUBLIC_APPWRITE_ENDPOINT / NEXT_PUBLIC_APPWRITE_PROJECT_ID / APPWRITE_API_KEY');
  process.exit(1);
}

const headers = { 'X-Appwrite-Project': project, 'X-Appwrite-Key': key };

async function listAll(table) {
  const rows = [];
  let cursor = null;
  for (;;) {
    const queries = [JSON.stringify({ method: 'limit', values: [100] })];
    if (cursor) queries.push(JSON.stringify({ method: 'cursorAfter', values: [cursor] }));
    const params = new URLSearchParams();
    queries.forEach((q) => params.append('queries[]', q));
    const res = await fetch(`${endpoint}/tablesdb/${DATABASE_ID}/tables/${table}/rows?${params}`, { headers });
    if (!res.ok) throw new Error(`${table}: ${res.status} ${await res.text()}`);
    const body = await res.json();
    rows.push(...body.rows);
    if (body.rows.length < 100) break;
    cursor = body.rows[body.rows.length - 1].$id;
  }
  return rows;
}

await mkdir('appwrite/backup', { recursive: true });
for (const table of TABLES) {
  const rows = await listAll(table);
  await writeFile(`appwrite/backup/${table}.json`, JSON.stringify(rows, null, 2));
  console.log(`${table}: ${rows.length} rows`);
}
