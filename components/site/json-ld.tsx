import { jsonLdString } from '@/lib/seo';

/** Inline structured data (schema.org JSON-LD). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />;
}
