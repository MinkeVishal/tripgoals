'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { deleteCategoryAction, saveCategoryAction } from '@/lib/actions/categories';
import { imageUrl } from '@/lib/appwrite/image-url';
import type { Category, Role } from '@/types';
import { ImageUploader } from './image-uploader';

interface FormState {
  id: string | null;
  name: string;
  subtitle: string;
  description: string;
  image: string[];
  order: number;
}

const blank = (order: number): FormState => ({ id: null, name: '', subtitle: '', description: '', image: [], order });

export function CategoriesManager({ categories, role }: { categories: Category[]; role: Role }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const patch = (changes: Partial<FormState>) => setForm((f) => (f ? { ...f, ...changes } : f));

  async function save() {
    if (!form) return;
    setSaving(true);
    setErrors({});
    const result = await saveCategoryAction(form.id, {
      name: form.name,
      subtitle: form.subtitle,
      description: form.description,
      imageId: form.image[0] ?? '',
      order: Number.isFinite(form.order) ? form.order : 0,
    });
    setSaving(false);
    if (!result.ok) {
      setErrors(result.fieldErrors ?? {});
      return void toast.error(result.error);
    }
    toast.success(form.id ? 'Category saved' : 'Category created');
    setForm(null);
    router.refresh();
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const result = await deleteCategoryAction(toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (!result.ok) return void toast.error(result.error);
    toast.success('Category deleted');
    router.refresh();
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button onClick={() => setForm(blank(categories.length))}>
          <Plus /> New category
        </Button>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground border-border rounded-2xl border border-dashed p-12 text-center">No categories yet — create the first one.</p>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id} className="border-border bg-card overflow-hidden rounded-2xl border">
              <div className="bg-muted relative aspect-[16/9]">
                {category.imageId ? <Image src={imageUrl(category.imageId)} alt="" fill sizes="(min-width: 1280px) 30vw, 50vw" className="object-cover" /> : null}
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold">{category.name}</h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{category.subtitle || category.description}</p>
                <p className="text-muted-foreground mt-3 text-xs">
                  {category.stats.count} package{category.stats.count === 1 ? '' : 's'} · order {category.order}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setForm({
                        id: category.id,
                        name: category.name,
                        subtitle: category.subtitle,
                        description: category.description,
                        image: category.imageId ? [category.imageId] : [],
                        order: category.order,
                      })
                    }
                  >
                    <Pencil /> Edit
                  </Button>
                  {role === 'admin' ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      disabled={category.stats.count > 0}
                      title={category.stats.count > 0 ? 'Move or delete its packages first' : undefined}
                      onClick={() => setToDelete(category)}
                    >
                      <Trash2 /> Delete
                    </Button>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={!!form} onOpenChange={(open) => !open && setForm(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{form?.id ? 'Edit category' : 'New category'}</SheetTitle>
            <SheetDescription>Shown on the home page and the Categories page.</SheetDescription>
          </SheetHeader>
          {form ? (
            <div className="grid gap-5 px-4">
              <Field label="Name" htmlFor="cat-name" error={errors.name}>
                <Input id="cat-name" value={form.name} onChange={(e) => patch({ name: e.target.value })} />
              </Field>
              <Field label="Subtitle" htmlFor="cat-sub" error={errors.subtitle} hint="Optional short tagline.">
                <Input id="cat-sub" value={form.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
              </Field>
              <Field label="Description" htmlFor="cat-desc" error={errors.description}>
                <Textarea id="cat-desc" rows={3} value={form.description} onChange={(e) => patch({ description: e.target.value })} />
              </Field>
              <Field label="Display order" htmlFor="cat-order" error={errors.order} hint="Lower numbers appear first.">
                <Input id="cat-order" type="number" min={0} value={Number.isFinite(form.order) ? form.order : ''} onChange={(e) => patch({ order: e.target.value === '' ? Number.NaN : Number(e.target.value) })} />
              </Field>
              <div className="grid gap-1.5">
                <span className="text-sm font-medium">Cover image</span>
                <ImageUploader value={form.image} onChange={(image) => patch({ image })} max={1} showCover={false} error={errors.imageId} />
              </div>
            </div>
          ) : null}
          <SheetFooter>
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : null} {form?.id ? 'Save changes' : 'Create category'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{toDelete?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>This category has no packages. Deleting it can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              {deleting ? <Loader2 className="animate-spin" /> : null} Delete category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
