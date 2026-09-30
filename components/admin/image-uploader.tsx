'use client';

import { useId, useRef, useState } from 'react';
import Image from 'next/image';
import { Reorder } from 'motion/react';
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { uploadImageAction } from '@/lib/actions/media';
import { imageUrl } from '@/lib/appwrite/image-url';
import { compressImage } from '@/lib/image-compress';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  /** Appwrite file ids. The first one is the cover. */
  value: string[];
  onChange: (ids: string[]) => void;
  max?: number;
  /** Show the "cover" badge and reorder controls (multi-image lists). */
  showCover?: boolean;
  hint?: string;
  error?: string;
}

export function ImageUploader({ value, onChange, max = 12, showCover = true, hint, error }: ImageUploaderProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const remaining = max - value.length;

  async function handleFiles(fileList: FileList | File[]) {
    const files = [...fileList].slice(0, Math.max(remaining, 0));
    if (files.length === 0) return void toast.error(`You can add up to ${max} images.`);

    setUploading((n) => n + files.length);
    const added: string[] = [];
    await Promise.all(
      files.map(async (file) => {
        try {
          const compressed = await compressImage(file);
          const body = new FormData();
          body.set('file', compressed);
          const result = await uploadImageAction(body);
          if (!result.ok) throw new Error(result.error);
          added.push(result.data.fileId);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : `Could not upload ${file.name}`);
        } finally {
          setUploading((n) => n - 1);
        }
      }),
    );
    if (added.length) onChange([...value, ...added]);
    if (inputRef.current) inputRef.current.value = '';
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return;
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item!);
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      {value.length > 0 ? (
        <Reorder.Group axis="x" values={value} onReorder={onChange} className="flex flex-wrap gap-3" aria-label="Uploaded images">
          {value.map((id, index) => (
            <Reorder.Item key={id} value={id} className="group relative cursor-grab active:cursor-grabbing">
              <div className="bg-muted relative size-28 overflow-hidden rounded-xl sm:size-32">
                <Image src={imageUrl(id)} alt={`Image ${index + 1}`} fill sizes="128px" className="pointer-events-none object-cover" draggable={false} />
                {showCover && index === 0 ? (
                  <span className="bg-primary text-primary-foreground absolute top-1.5 left-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold">
                    <Star className="size-3 fill-current" /> Cover
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => onChange(value.filter((v) => v !== id))}
                  aria-label={`Remove image ${index + 1}`}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100 hover:bg-red-600 focus-visible:opacity-100"
                >
                  <X className="size-3.5" />
                </button>
                {showCover && value.length > 1 ? (
                  <div className="absolute inset-x-0 bottom-0 flex justify-between p-1 opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
                    <button type="button" aria-label="Move earlier" onClick={() => move(index, index - 1)} disabled={index === 0} className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30">
                      <ChevronLeft className="size-4" />
                    </button>
                    <button type="button" aria-label="Move later" onClick={() => move(index, index + 1)} disabled={index === value.length - 1} className="flex size-6 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30">
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : null}

      {remaining > 0 ? (
        <label
          htmlFor={inputId}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            'border-input hover:border-primary/60 hover:bg-accent/40 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors',
            dragOver && 'border-primary bg-accent/60',
            error && 'border-destructive',
          )}
        >
          {uploading > 0 ? <Loader2 className="text-primary size-7 animate-spin" /> : <ImagePlus className="text-muted-foreground size-7" />}
          <span className="text-sm font-medium">{uploading > 0 ? `Uploading ${uploading} image${uploading === 1 ? '' : 's'}…` : 'Click to upload or drag images here'}</span>
          <span className="text-muted-foreground text-xs">{hint ?? `JPG, PNG or WebP · up to ${max} images · optimised automatically`}</span>
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple={max > 1}
            className="sr-only"
            onChange={(e) => e.target.files && void handleFiles(e.target.files)}
          />
        </label>
      ) : (
        <Button type="button" variant="outline" size="sm" className="w-fit" onClick={() => onChange([])}>
          Replace image
        </Button>
      )}
      {error ? (
        <p role="alert" className="text-destructive text-xs">
          {error}
        </p>
      ) : null}
    </div>
  );
}
