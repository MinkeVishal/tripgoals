import 'server-only';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient, listAllRows } from '@/lib/appwrite/server';

/** Every file id currently referenced by packages, categories or banners. */
export async function referencedFileIds(): Promise<Set<string>> {
  const { tables } = appwriteConfig;
  const [packages, categories, banners] = await Promise.all([
    listAllRows(tables.packages),
    listAllRows(tables.categories),
    listAllRows(tables.banners).catch(() => []),
  ]);
  const ids = new Set<string>();
  const add = (v: unknown) => {
    if (typeof v === 'string' && v) ids.add(v);
    else if (Array.isArray(v)) v.forEach(add);
  };
  for (const row of [...packages, ...categories, ...banners]) {
    add(row.imageId);
    add(row.imageIds);
  }
  return ids;
}

/** Deletes files nothing references any more. Best effort: failures never fail the caller. */
export async function deleteUnreferencedFiles(candidates: Iterable<string>) {
  const wanted = [...new Set(candidates)];
  if (wanted.length === 0) return;
  try {
    const still = await referencedFileIds();
    const { storage } = createAdminClient();
    await Promise.all(
      wanted
        .filter((id) => !still.has(id))
        .map((fileId) =>
          storage.deleteFile({ bucketId: appwriteConfig.bucketId, fileId }).catch(() => undefined),
        ),
    );
  } catch (error) {
    console.error('Could not clean up files', error);
  }
}
