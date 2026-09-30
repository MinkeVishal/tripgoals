import { NextResponse, type NextRequest } from 'next/server';
import { getPackageSlugById } from '@/lib/data/catalog';

/** Legacy /package/:id links (shared on WhatsApp, indexed by Google) → 308 to /packages/:slug. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const slug = await getPackageSlugById(id);
  return slug
    ? NextResponse.redirect(new URL(`/packages/${slug}`, request.url), 308)
    : NextResponse.redirect(new URL('/packages', request.url), 307);
}
