import { NextResponse, type NextRequest } from 'next/server';
import { getCategorySlugByName } from '@/lib/data/catalog';

/** Legacy /category/:name links → 308 to /categories/:slug. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const slug = await getCategorySlugByName(decodeURIComponent(name));
  return slug
    ? NextResponse.redirect(new URL(`/categories/${slug}`, request.url), 308)
    : NextResponse.redirect(new URL('/categories', request.url), 307);
}
