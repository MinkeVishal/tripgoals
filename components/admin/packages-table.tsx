'use client';

import { useMemo, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowUp, Copy, ExternalLink, Loader2, Pencil, Search, Trash2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deletePackageAction, duplicatePackageAction } from '@/lib/actions/packages';
import { imageUrl } from '@/lib/appwrite/image-url';
import { formatPrice } from '@/lib/parsers/price';
import type { Role, TravelPackage } from '@/types';

type SortKey = 'title' | 'price' | 'updatedAt';

interface PackagesTableProps {
  packages: TravelPackage[];
  categories: { id: string; name: string }[];
  role: Role;
  /** Hide the section column/filter on pages that are already scoped to one section. */
  scopedSection?: boolean;
  emptyLabel: string;
}

const SECTION_TONE: Record<string, string> = {
  popular: 'bg-sky-500/15 text-sky-500',
  special: 'bg-amber-500/15 text-amber-500',
  adventure: 'bg-rose-500/15 text-rose-500',
  other: 'bg-muted text-muted-foreground',
};

function SortHead({
  id,
  sort,
  onSort,
  children,
  className,
}: {
  id: SortKey;
  sort: { key: SortKey; dir: 'asc' | 'desc' };
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const active = sort.key === id;
  return (
    <TableHead className={className} aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onSort(id)} className="hover:text-foreground inline-flex items-center gap-1 font-medium">
        {children}
        {active ? sort.dir === 'asc' ? <ArrowUp className="size-3.5" /> : <ArrowDown className="size-3.5" /> : null}
      </button>
    </TableHead>
  );
}

export function PackagesTable({ packages, categories, role, scopedSection = false, emptyLabel }: PackagesTableProps) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [section, setSection] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'updatedAt', dir: 'desc' });
  const [toDelete, setToDelete] = useState<TravelPackage | null>(null);
  const [busy, startBusy] = useTransition();

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = packages.filter(
      (p) =>
        (!needle || `${p.title} ${p.subtitle} ${p.categoryName}`.toLowerCase().includes(needle)) &&
        (!section || p.section === section) &&
        (!category || p.categoryId === category),
    );
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => {
      if (sort.key === 'price') return (a.price - b.price) * dir;
      if (sort.key === 'title') return a.title.localeCompare(b.title) * dir;
      return a.updatedAt.localeCompare(b.updatedAt) * dir;
    });
  }, [packages, q, section, category, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'title' ? 'asc' : 'desc' }));

  function duplicate(pkg: TravelPackage) {
    startBusy(async () => {
      const result = await duplicatePackageAction(pkg.id);
      if (!result.ok) return void toast.error(result.error);
      toast.success('Duplicated — opening the copy');
      router.push(`/admin/packages/${result.data.id}`);
    });
  }

  function confirmDelete() {
    const pkg = toDelete;
    if (!pkg) return;
    startBusy(async () => {
      const result = await deletePackageAction(pkg.id);
      setToDelete(null);
      if (!result.ok) return void toast.error(result.error);
      toast.success(`Deleted “${pkg.title}”`);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="pkg-search" className="sr-only">
            Search packages
          </label>
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input id="pkg-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, subtitle or category" className="pl-9" />
        </div>
        {!scopedSection ? (
          <NativeSelect aria-label="Filter by section" value={section} onChange={(e) => setSection(e.target.value)} className="sm:w-44">
            <option value="">All sections</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
            <option value="other">Other</option>
          </NativeSelect>
        ) : null}
        <NativeSelect aria-label="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} className="sm:w-52">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Cover</TableHead>
              <SortHead id="title" sort={sort} onSort={toggleSort}>Package</SortHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              {!scopedSection ? <TableHead className="hidden lg:table-cell">Section</TableHead> : null}
              <SortHead id="price" sort={sort} onSort={toggleSort} className="hidden sm:table-cell">
                Price
              </SortHead>
              <TableHead className="hidden xl:table-cell">Duration</TableHead>
              <SortHead id="updatedAt" sort={sort} onSort={toggleSort} className="hidden xl:table-cell">
                Updated
              </SortHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground h-32 text-center">
                  {packages.length === 0 ? emptyLabel : 'No packages match your filters.'}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div className="bg-muted relative size-14 overflow-hidden rounded-lg">
                      {pkg.images[0] ? <Image src={imageUrl(pkg.images[0])} alt="" fill sizes="56px" className="object-cover" /> : null}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-64">
                    <Link href={`/admin/packages/${pkg.id}`} className="block truncate font-medium hover:underline">
                      {pkg.title}
                    </Link>
                    <span className="text-muted-foreground block truncate text-xs">{pkg.subtitle || '—'}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{pkg.categoryName || '—'}</TableCell>
                  {!scopedSection ? (
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="secondary" className={`capitalize ${SECTION_TONE[pkg.section]}`}>
                        {pkg.section}
                      </Badge>
                    </TableCell>
                  ) : null}
                  <TableCell className="hidden tabular-nums sm:table-cell">{formatPrice(pkg.price)}</TableCell>
                  <TableCell className="text-muted-foreground hidden xl:table-cell">{pkg.durationLabel || '—'}</TableCell>
                  <TableCell className="text-muted-foreground hidden text-xs xl:table-cell">
                    {new Date(pkg.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button asChild variant="ghost" size="icon" aria-label={`View ${pkg.title} on the site`}>
                        <Link href={`/packages/${pkg.slug}`} target="_blank">
                          <ExternalLink />
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" size="icon" aria-label={`Edit ${pkg.title}`}>
                        <Link href={`/admin/packages/${pkg.id}`}>
                          <Pencil />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" aria-label={`Duplicate ${pkg.title}`} disabled={busy} onClick={() => duplicate(pkg)}>
                        <Copy />
                      </Button>
                      {role === 'admin' ? (
                        <Button variant="ghost" size="icon" aria-label={`Delete ${pkg.title}`} className="text-destructive hover:text-destructive" disabled={busy} onClick={() => setToDelete(pkg)}>
                          <Trash2 />
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <p className="text-muted-foreground text-xs">
        {rows.length} of {packages.length} shown
      </p>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{toDelete?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the package, its photos (if nothing else uses them) and any wishlist entries. It can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-white hover:bg-destructive/90">
              {busy ? <Loader2 className="animate-spin" /> : null} Delete package
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
