'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Ban, Loader2, Search, ShieldCheck, Trash2 } from 'lucide-react';
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
import { deleteUserAction, setUserBlockedAction, setUserRoleAction } from '@/lib/actions/users';
import type { ManagedUser } from '@/lib/data/users';
import { ROLES, type Role } from '@/types';

const ROLE_LABEL: Record<Role, string> = { customer: 'Customer', editor: 'Editor', admin: 'Admin' };

export function UsersTable({ users, currentUserId }: { users: ManagedUser[]; currentUserId: string }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [pending, start] = useTransition();
  const [toDelete, setToDelete] = useState<ManagedUser | null>(null);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return users.filter(
      (u) => (!needle || `${u.name} ${u.email} ${u.phone}`.toLowerCase().includes(needle)) && (!roleFilter || u.role === roleFilter),
    );
  }, [users, q, roleFilter]);

  const run = (task: () => Promise<{ ok: boolean; error?: string }>, success: string) =>
    start(async () => {
      const result = await task();
      if (!result.ok) return void toast.error(result.error ?? 'Something went wrong');
      toast.success(success);
      router.refresh();
    });

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input id="user-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, email or phone" className="pl-9" />
        </div>
        <NativeSelect aria-label="Filter by role" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="sm:w-44">
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
            </option>
          ))}
        </NativeSelect>
      </div>

      <div className="border-border bg-card overflow-hidden rounded-2xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-32 text-center">
                  {users.length === 0 ? 'No accounts yet.' : 'No users match your filters.'}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((user) => {
                const isSelf = user.id === currentUserId;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <p className="font-medium">
                        {user.name || '—'} {isSelf ? <span className="text-muted-foreground text-xs">(you)</span> : null}
                      </p>
                      <p className="text-muted-foreground text-xs">{user.email}</p>
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell">{user.phone || '—'}</TableCell>
                    <TableCell>
                      <NativeSelect
                        aria-label={`Role for ${user.name || user.email}`}
                        value={user.role}
                        disabled={isSelf || pending}
                        className="h-8 w-32 text-xs"
                        onChange={(e) => run(() => setUserRoleAction(user.id, e.target.value as Role), `${user.name || user.email} is now ${ROLE_LABEL[e.target.value as Role]}`)}
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </NativeSelect>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {user.blocked ? <Badge variant="destructive">Blocked</Badge> : <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-500">Active</Badge>}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden text-xs lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isSelf || pending}
                          aria-label={user.blocked ? `Unblock ${user.name || user.email}` : `Block ${user.name || user.email}`}
                          title={user.blocked ? 'Unblock' : 'Block'}
                          onClick={() => run(() => setUserBlockedAction(user.id, !user.blocked), user.blocked ? 'User unblocked' : 'User blocked')}
                        >
                          {user.blocked ? <ShieldCheck /> : <Ban />}
                        </Button>
                        <Button variant="ghost" size="icon" disabled={isSelf || pending} aria-label={`Delete ${user.name || user.email}`} className="text-destructive hover:text-destructive" onClick={() => setToDelete(user)}>
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {toDelete?.name || toDelete?.email}?</AlertDialogTitle>
            <AlertDialogDescription>Their account is removed permanently and they lose access immediately. Consider blocking instead if you may need them back.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                const user = toDelete;
                setToDelete(null);
                if (user) run(() => deleteUserAction(user.id), 'User deleted');
              }}
            >
              {pending ? <Loader2 className="animate-spin" /> : null} Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
