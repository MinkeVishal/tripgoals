export const appwriteConfig = {
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? 'https://cloud.appwrite.io/v1',
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID ?? '',
  databaseId: '68cbec5d002f450d2c36',
  bucketId: '68cbee510018bf68f24c',
  tables: {
    packages: 'packages',
    categories: 'categories',
    banners: 'banners',
    wishlists: 'wishlists',
  },
} as const;

export const SESSION_COOKIE = `a_session_${appwriteConfig.projectId}`;
