/**
 * Browser-side image compression. Server actions on Vercel accept ~4.5 MB bodies, and phone
 * photos are often 8–15 MB, so we downscale and re-encode before uploading.
 */
const MAX_SIDE = 2400;
const TARGET_BYTES = 3 * 1024 * 1024;

function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') return createImageBitmap(file);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not read this image'));
    img.src = URL.createObjectURL(file);
  });
}

const toBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));

export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) throw new Error(`${file.name} is not an image`);

  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  // Already small and within limits: keep the original bytes untouched.
  if (scale === 1 && file.size <= TARGET_BYTES && file.type !== 'image/png') return file;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser cannot process images');
  ctx.drawImage(bitmap, 0, 0, width, height);

  for (const quality of [0.86, 0.78, 0.7, 0.6, 0.5]) {
    const blob = await toBlob(canvas, 'image/webp', quality);
    if (blob && blob.size <= TARGET_BYTES) {
      const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
      return new File([blob], name, { type: 'image/webp' });
    }
  }
  throw new Error(`${file.name} is too large even after compression`);
}
