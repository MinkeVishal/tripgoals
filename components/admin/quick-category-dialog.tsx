'use client';

import { useState } from 'react';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { saveCategoryAction } from '@/lib/actions/categories';
import { ImageUploader } from './image-uploader';

/** Create a category without leaving the package form (replaces the old free-text "custom category"). */
export function QuickCategoryDialog({ onCreated }: { onCreated: (category: { id: string; name: string }) => void }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function save() {
    setSaving(true);
    setErrors({});
    const result = await saveCategoryAction(null, { name, subtitle: '', description, imageId: image[0] ?? '', order: 0 });
    setSaving(false);
    if (!result.ok) {
      setErrors(result.fieldErrors ?? { _: result.error });
      return void toast.error(result.error);
    }
    toast.success(`Category “${name.trim()}” created`);
    onCreated({ id: result.data.id, name: name.trim() });
    setOpen(false);
    setName('');
    setDescription('');
    setImage([]);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon-lg" aria-label="Create a new category" className="size-11 shrink-0">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New category</DialogTitle>
          <DialogDescription>It becomes available immediately and appears on the Categories page.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field label="Name" htmlFor="qc-name" error={errors.name}>
            <Input id="qc-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Description" htmlFor="qc-desc" error={errors.description}>
            <Textarea id="qc-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <div className="grid gap-1.5">
            <span className="text-sm font-medium">Cover image</span>
            <ImageUploader value={image} onChange={setImage} max={1} showCover={false} error={errors.imageId} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" /> : null} Create category
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
