import { appwriteConfig } from './config';

/**
 * Public URL of a file in the images bucket.
 * Appwrite's /preview transformations are blocked on the free plan, so we serve the
 * original via /view and let next/image resize, convert and cache it.
 */
export function imageUrl(fileId: string) {
  const { endpoint, bucketId, projectId } = appwriteConfig;
  return `${endpoint}/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
