'use server';

import { ID } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';
import { appwriteConfig } from '@/lib/appwrite/config';
import { createAdminClient } from '@/lib/appwrite/server';
import { authorise } from '@/lib/auth';
import { IMAGE_MAX_BYTES, IMAGE_TYPES } from '@/lib/validation/content';
import type { ActionResult } from '@/types';
import { fail, messageFrom, succeed } from './helpers';

/** Uploads one image (already compressed in the browser) and returns its file id. */
export async function uploadImageAction(formData: FormData): Promise<ActionResult<{ fileId: string }>> {
  const auth = await authorise('editor');
  if (!auth.ok) return fail(auth.error);

  const file = formData.get('file');
  if (!(file instanceof File)) return fail('No file received.');
  if (!IMAGE_TYPES.includes(file.type)) return fail('Use a JPG, PNG, WebP or AVIF image.');
  if (file.size > IMAGE_MAX_BYTES) return fail('Image is too large after compression (max 3.5 MB).');

  try {
    const { storage } = createAdminClient();
    const created = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: InputFile.fromBuffer(new Uint8Array(await file.arrayBuffer()), file.name || 'image'),
    });
    return succeed({ fileId: created.$id });
  } catch (error) {
    return fail(messageFrom(error, 'Upload failed. Please try again.'));
  }
}
