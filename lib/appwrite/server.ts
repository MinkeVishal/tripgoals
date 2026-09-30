import 'server-only';
import { cookies } from 'next/headers';
import { Account, Client, Query, Storage, TablesDB, Users, type Models } from 'node-appwrite';
import { appwriteConfig, SESSION_COOKIE } from './config';

function baseClient() {
  return new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);
}

/**
 * Privileged client authenticated with the server-only API key.
 * Only call this after the caller's role has been checked (see lib/auth.ts).
 */
export function createAdminClient() {
  const apiKey = process.env.APPWRITE_API_KEY;
  if (!apiKey) throw new Error('APPWRITE_API_KEY is not set');
  const client = baseClient().setKey(apiKey);
  return {
    account: new Account(client),
    tablesDB: new TablesDB(client),
    storage: new Storage(client),
    users: new Users(client),
  };
}

/** Client acting as the signed-in user, from the httpOnly session cookie. Null when signed out. */
export async function createSessionClient() {
  const secret = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!secret) return null;
  return { account: new Account(baseClient().setSession(secret)) };
}

export type RowOf<T extends object = Record<string, unknown>> = Models.Row & T;
export type RawRow = RowOf;

/** Reads every row of a table, following cursors past Appwrite's page limit. */
export async function listAllRows(table: string, extraQueries: string[] = []): Promise<RawRow[]> {
  const { tablesDB } = createAdminClient();
  const rows: RawRow[] = [];
  let cursor: string | undefined;
  for (;;) {
    const queries = [Query.limit(100), ...extraQueries];
    if (cursor) queries.push(Query.cursorAfter(cursor));
    const page = await tablesDB.listRows<RawRow>({
      databaseId: appwriteConfig.databaseId,
      tableId: table,
      queries,
      total: false,
    });
    rows.push(...page.rows);
    if (page.rows.length < 100) return rows;
    cursor = page.rows[page.rows.length - 1]!.$id;
  }
}
