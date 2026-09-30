'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { saveBannerAction } from '@/lib/actions/banners';
import { imageUrl } from '@/lib/appwrite/image-url';
import type { Banner } from '@/types';
import { ImageUploader } from './image-uploader';

interface BannerEditorProps {
  banner: Banner;
  heading: string;
  description: string;
  maxImages: number;
  imageHint: string;
}

export function BannerEditor({ banner, heading, description, maxImages, imageHint }: BannerEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState(banner);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const patch = (changes: Partial<Banner>) => setValues((v) => ({ ...v, ...changes }));

  async function save() {
    setSaving(true);
    setErrors({});
    const result = await saveBannerAction(values);
    setSaving(false);
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {});
      return void toast.error(result.error);
    }
    toast.success(`${heading} saved — live on the site`);
    router.refresh();
  }

  const preview = values.imageIds[0];
  const idPrefix = `banner-${banner.key}`;

  return (
    <section className="border-border bg-card grid gap-8 rounded-2xl border p-6 lg:grid-cols-2">
      <div className="grid content-start gap-5">
        <div>
          <h2 className="font-display text-xl font-semibold">{heading}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
        <Field label="Title" htmlFor={`${idPrefix}-title`} error={errors.title}>
          <Input id={`${idPrefix}-title`} value={values.title} onChange={(e) => patch({ title: e.target.value })} />
        </Field>
        <Field label="Subtitle" htmlFor={`${idPrefix}-sub`} error={errors.subtitle}>
          <Textarea id={`${idPrefix}-sub`} rows={2} value={values.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Button label" htmlFor={`${idPrefix}-cta`} error={errors.ctaLabel}>
            <Input id={`${idPrefix}-cta`} value={values.ctaLabel} onChange={(e) => patch({ ctaLabel: e.target.value })} />
          </Field>
          <Field label="Button link" htmlFor={`${idPrefix}-url`} error={errors.ctaUrl} hint="/packages or https://…">
            <Input id={`${idPrefix}-url`} value={values.ctaUrl} onChange={(e) => patch({ ctaUrl: e.target.value })} />
          </Field>
        </div>
        <label className="flex items-center gap-3 text-sm font-medium">
          <Switch checked={values.active} onCheckedChange={(active) => patch({ active })} />
          Show on the site
        </label>
        <Button onClick={save} disabled={saving} className="w-fit">
          {saving ? <Loader2 className="animate-spin" /> : <Save />} Save {heading.toLowerCase()}
        </Button>
      </div>

      <div className="grid content-start gap-6">
        <div>
          <p className="mb-2 text-sm font-medium">Live preview</p>
          <div className="bg-forest-950 relative isolate aspect-[16/9] overflow-hidden rounded-xl">
            {preview ? <Image src={imageUrl(preview)} alt="" fill sizes="480px" className="-z-10 object-cover" /> : <div className="from-forest-800 to-forest-950 absolute inset-0 -z-10 bg-linear-to-b" />}
            <div className="bg-black/45 absolute inset-0 -z-10" />
            <div className="flex h-full flex-col justify-center p-6 text-white">
              <p className="font-display text-2xl leading-tight font-semibold">{values.title || 'Title'}</p>
              <p className="mt-1 line-clamp-2 text-sm text-white/75">{values.subtitle || 'Subtitle'}</p>
              {values.ctaLabel ? <span className="text-foreground mt-3 w-fit rounded-full bg-white px-4 py-1.5 text-xs font-medium">{values.ctaLabel}</span> : null}
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <p className="text-sm font-medium">Images</p>
          <ImageUploader value={values.imageIds} onChange={(imageIds) => patch({ imageIds })} max={maxImages} hint={imageHint} error={errors.imageIds} />
        </div>
      </div>
    </section>
  );
}
