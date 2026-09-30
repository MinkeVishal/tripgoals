'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { set, useFieldArray, useForm, useWatch, type Control, type Resolver } from 'react-hook-form';
import { ArrowDown, ArrowUp, ExternalLink, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { AmenityIcon } from '@/components/site/amenity-icon';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Textarea } from '@/components/ui/textarea';
import { savePackageAction } from '@/lib/actions/packages';
import { AMENITY_ICON_KEYS, AMENITY_ICON_LABELS } from '@/lib/parsers/amenities';
import { packageSchema, type PackageInput } from '@/lib/validation/content';
import { SECTIONS, type TravelPackage } from '@/types';
import { ImageUploader } from './image-uploader';
import { QuickCategoryDialog } from './quick-category-dialog';

/** Form-friendly shape: field arrays need objects, and itinerary points are edited as one line each. */
interface EditorValues {
  title: string;
  subtitle: string;
  categoryId: string;
  section: PackageInput['section'];
  price: number;
  nights: number | null;
  days: number | null;
  destination: string;
  description: string;
  order: number;
  images: string[];
  inclusions: { text: string }[];
  amenities: { icon: string; label: string }[];
  itinerary: { title: string; points: string }[];
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

function toInput(v: EditorValues): unknown {
  return {
    title: v.title,
    subtitle: v.subtitle,
    categoryId: v.categoryId,
    section: v.section,
    price: num(v.price) ?? Number.NaN,
    nights: num(v.nights),
    days: num(v.days),
    destination: v.destination,
    description: v.description,
    order: num(v.order) ?? 0,
    images: v.images,
    inclusions: v.inclusions.map((i) => i.text.trim()).filter(Boolean),
    amenities: v.amenities.filter((a) => a.label.trim()),
    itinerary: v.itinerary
      .filter((d) => d.title.trim() || d.points.trim())
      .map((d) => ({
        title: d.title,
        points: d.points
          .split('\n')
          .map((p) => p.trim())
          .filter(Boolean),
      })),
  };
}

function fromPackage(pkg: TravelPackage | null, defaults: Partial<EditorValues>): EditorValues {
  return {
    title: pkg?.title ?? '',
    subtitle: pkg?.subtitle ?? '',
    categoryId: pkg?.categoryId ?? '',
    section: pkg?.section ?? 'other',
    price: pkg?.price ?? Number.NaN,
    nights: pkg?.nights ?? null,
    days: pkg?.days ?? null,
    destination: pkg && pkg.destination !== pkg.title ? pkg.destination : '',
    description: pkg?.description ?? '',
    order: pkg?.order ?? 0,
    images: pkg?.images ?? [],
    inclusions: pkg?.inclusions.map((text) => ({ text })) ?? [],
    amenities: pkg?.amenities.map((a) => ({ ...a })) ?? [],
    itinerary: pkg?.itinerary.map((d) => ({ title: d.title, points: d.points.join('\n') })) ?? [],
    ...defaults,
  };
}

/** Validates with the same zod schema the server uses, mapping issues onto react-hook-form paths. */
const resolver: Resolver<EditorValues> = async (values) => {
  const parsed = packageSchema.safeParse(toInput(values));
  if (parsed.success) return { values, errors: {} };
  const errors = {};
  for (const issue of parsed.error.issues) {
    const path = issue.path.map(String);
    if (path[0] === 'inclusions' && path.length === 1) path.push('root');
    if (path[0] === 'inclusions' && path.length === 2 && /^\d+$/.test(path[1]!)) path.push('text');
    set(errors, path.join('.'), { type: 'validate', message: issue.message });
  }
  return { values: {}, errors };
};

function AmenityPreview({ control, index }: { control: Control<EditorValues>; index: number }) {
  const icon = useWatch({ control, name: `amenities.${index}.icon` });
  return <AmenityIcon name={icon} className="size-4" />;
}

const card = 'border-border bg-card rounded-2xl border p-6';

interface PackageEditorProps {
  pkg: TravelPackage | null;
  categories: { id: string; name: string }[];
  defaultSection?: PackageInput['section'];
}

export function PackageEditor({ pkg, categories: initialCategories, defaultSection }: PackageEditorProps) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [formError, setFormError] = useState('');

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EditorValues>({
    resolver,
    defaultValues: fromPackage(pkg, defaultSection ? { section: defaultSection } : {}),
  });

  const inclusions = useFieldArray({ control, name: 'inclusions' });
  const amenities = useFieldArray({ control, name: 'amenities' });
  const itinerary = useFieldArray({ control, name: 'itinerary' });
  const images = useWatch({ control, name: 'images' });

  async function onSubmit(values: EditorValues) {
    setFormError('');
    const result = await savePackageAction(pkg?.id ?? null, toInput(values) as PackageInput);
    if (!result.ok) {
      setFormError(result.error);
      for (const [name, message] of Object.entries(result.fieldErrors ?? {})) {
        setError(name as never, { message });
      }
      return;
    }
    toast.success(pkg ? 'Package saved' : 'Package created');
    if (pkg) {
      reset(values); // clear the dirty state
      router.refresh();
    } else {
      router.replace(`/admin/packages/${result.data.id}`);
    }
  }

  const invalidProps = (name: keyof EditorValues) => ({
    'aria-invalid': !!errors[name],
    'aria-describedby': errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-6 pb-24">
      <section className={card} aria-labelledby="basics-h">
        <h2 id="basics-h" className="mb-5 text-lg font-semibold">
          Basics
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" htmlFor="title" error={errors.title?.message} className="sm:col-span-2">
            <Input id="title" placeholder="e.g. Kashmir private package" {...invalidProps('title')} {...register('title')} />
          </Field>
          <Field label="Subtitle" htmlFor="subtitle" error={errors.subtitle?.message} hint="Shown under the title on cards." className="sm:col-span-2">
            <Input id="subtitle" placeholder="e.g. Paradise on Earth" {...invalidProps('subtitle')} {...register('subtitle')} />
          </Field>

          <Field label="Category" htmlFor="categoryId" error={errors.categoryId?.message}>
            <div className="flex gap-2">
              <NativeSelect id="categoryId" {...invalidProps('categoryId')} {...register('categoryId')}>
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </NativeSelect>
              <QuickCategoryDialog
                onCreated={(category) => {
                  setCategories((prev) => [...prev, category]);
                  setValue('categoryId', category.id, { shouldDirty: true, shouldValidate: true });
                }}
              />
            </div>
          </Field>

          <Field label="Section" htmlFor="section" error={errors.section?.message} hint="Where it appears on the home page.">
            <NativeSelect id="section" className="capitalize" {...register('section')}>
              {SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s === 'adventure' ? 'Adventure activity' : s}
                </option>
              ))}
            </NativeSelect>
          </Field>

          <Field label="Price (₹)" htmlFor="price" error={errors.price?.message}>
            <Input id="price" type="number" inputMode="numeric" min={0} step={100} placeholder="14500" {...invalidProps('price')} {...register('price', { valueAsNumber: true })} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Nights" htmlFor="nights" error={errors.nights?.message}>
              <Input id="nights" type="number" inputMode="numeric" min={0} placeholder="5" {...register('nights', { setValueAs: (v) => (v === '' || v == null ? null : Number(v)) })} />
            </Field>
            <Field label="Days" htmlFor="days" error={errors.days?.message}>
              <Input id="days" type="number" inputMode="numeric" min={0} placeholder="6" {...register('days', { setValueAs: (v) => (v === '' || v == null ? null : Number(v)) })} />
            </Field>
          </div>

          <Field label="Map destination" htmlFor="destination" error={errors.destination?.message} hint="What the map searches for. Defaults to the title.">
            <Input id="destination" placeholder="e.g. Srinagar, Kashmir" {...register('destination')} />
          </Field>

          <Field label="Display order" htmlFor="order" error={errors.order?.message} hint="Lower numbers appear first within a section.">
            <Input id="order" type="number" inputMode="numeric" min={0} {...register('order', { valueAsNumber: true })} />
          </Field>

          <Field label="Description" htmlFor="description" error={errors.description?.message} className="sm:col-span-2">
            <Textarea id="description" rows={6} placeholder="A short overview of the trip…" {...register('description')} />
          </Field>
        </div>
      </section>

      <section className={card} aria-labelledby="media-h">
        <h2 id="media-h" className="mb-1 text-lg font-semibold">
          Photos
        </h2>
        <p className="text-muted-foreground mb-5 text-sm">The first photo is the cover. Drag to reorder.</p>
        <ImageUploader value={images} onChange={(ids) => setValue('images', ids, { shouldDirty: true, shouldValidate: true })} error={errors.images?.message ?? errors.images?.root?.message} />
      </section>

      <section className={card} aria-labelledby="itinerary-h">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h2 id="itinerary-h" className="text-lg font-semibold">
              Itinerary
            </h2>
            <p className="text-muted-foreground text-sm">Day by day. Put each highlight on its own line.</p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => itinerary.append({ title: '', points: '' })}>
            <Plus /> Add day
          </Button>
        </div>
        <div className="grid gap-4">
          {itinerary.fields.length === 0 ? <p className="text-muted-foreground text-sm">No days yet.</p> : null}
          {itinerary.fields.map((field, index) => (
            <div key={field.id} className="border-border rounded-xl border p-4">
              <div className="mb-3 flex items-center gap-2">
                <span className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">{index + 1}</span>
                <Input aria-label={`Day ${index + 1} title`} placeholder="Day title, e.g. Arrival in Srinagar" {...register(`itinerary.${index}.title`)} aria-invalid={!!errors.itinerary?.[index]?.title} />
                <Button type="button" variant="ghost" size="icon" aria-label="Move day up" disabled={index === 0} onClick={() => itinerary.move(index, index - 1)}>
                  <ArrowUp />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label="Move day down" disabled={index === itinerary.fields.length - 1} onClick={() => itinerary.move(index, index + 1)}>
                  <ArrowDown />
                </Button>
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove day ${index + 1}`} className="text-destructive hover:text-destructive" onClick={() => itinerary.remove(index)}>
                  <Trash2 />
                </Button>
              </div>
              {errors.itinerary?.[index]?.title?.message ? (
                <p role="alert" className="text-destructive mb-2 text-xs">{errors.itinerary[index]!.title!.message}</p>
              ) : null}
              <Textarea aria-label={`Day ${index + 1} details`} rows={4} placeholder={'Visit Shankaracharya Temple\nDal Lake sightseeing\nCheck in to hotel'} {...register(`itinerary.${index}.points`)} />
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className={card} aria-labelledby="inclusions-h">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="inclusions-h" className="text-lg font-semibold">
              What&apos;s included
            </h2>
            <Button type="button" variant="outline" size="sm" onClick={() => inclusions.append({ text: '' })}>
              <Plus /> Add
            </Button>
          </div>
          <div className="grid gap-2">
            {inclusions.fields.length === 0 ? <p className="text-muted-foreground text-sm">Nothing listed yet.</p> : null}
            {inclusions.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <Input aria-label={`Inclusion ${index + 1}`} placeholder="e.g. Hotel accommodation" {...register(`inclusions.${index}.text`)} />
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove inclusion ${index + 1}`} onClick={() => inclusions.remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className={card} aria-labelledby="amenities-h">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 id="amenities-h" className="text-lg font-semibold">
                Highlights
              </h2>
              <p className="text-muted-foreground text-sm">Small badges with an icon (max 12).</p>
            </div>
            <Button type="button" variant="outline" size="sm" disabled={amenities.fields.length >= 12} onClick={() => amenities.append({ icon: 'check', label: '' })}>
              <Plus /> Add
            </Button>
          </div>
          <div className="grid gap-2">
            {amenities.fields.length === 0 ? <p className="text-muted-foreground text-sm">No highlights yet.</p> : null}
            {amenities.fields.map((field, index) => (
              <div key={field.id} className="flex gap-2">
                <span className="bg-muted text-primary flex size-9 shrink-0 items-center justify-center rounded-md">
                  <AmenityPreview control={control} index={index} />
                </span>
                <NativeSelect aria-label={`Highlight ${index + 1} icon`} containerClassName="w-40 shrink-0" {...register(`amenities.${index}.icon`)}>
                  {AMENITY_ICON_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {AMENITY_ICON_LABELS[key]}
                    </option>
                  ))}
                </NativeSelect>
                <Input aria-label={`Highlight ${index + 1} label`} placeholder="e.g. 3 star hotel" maxLength={40} {...register(`amenities.${index}.label`)} />
                <Button type="button" variant="ghost" size="icon" aria-label={`Remove highlight ${index + 1}`} onClick={() => amenities.remove(index)}>
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {formError ? (
        <p role="alert" className="bg-destructive/10 text-destructive rounded-xl px-4 py-3 text-sm">
          {formError}
        </p>
      ) : null}

      <div className="border-border bg-background/90 fixed inset-x-0 bottom-0 z-20 border-t backdrop-blur-xl lg:left-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-muted-foreground hidden text-sm sm:block">{isDirty ? 'You have unsaved changes' : pkg ? 'All changes saved' : 'Fill in the basics and save'}</p>
          <div className="ml-auto flex items-center gap-2">
            {pkg ? (
              <Button asChild variant="outline">
                <Link href={`/packages/${pkg.slug}`} target="_blank">
                  <ExternalLink /> View on site
                </Link>
              </Button>
            ) : null}
            <Button asChild variant="ghost">
              <Link href={pkg?.section === 'adventure' ? '/admin/adventures' : '/admin/packages'}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || (!!pkg && !isDirty)}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
              {pkg ? 'Save changes' : 'Create package'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
