'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/actions/auth';
import { cn } from '@/lib/utils';
import type { SessionUser } from '@/types';
import { onHero } from './nav';
import { notifyAuthChanged } from './wishlist-provider';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('') || 'U';

const isStaff = (user: SessionUser) => user.role === 'admin' || user.role === 'editor';

export function useSignOut() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const signOut = () =>
    start(async () => {
      await logoutAction();
      toast.success('Signed out');
      notifyAuthChanged();
      router.push('/');
      router.refresh();
    });
  return { signOut, pending };
}

export function UserMenu({ user }: { user: SessionUser }) {
  const { signOut, pending } = useSignOut();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'bg-foreground/5 hover:bg-foreground/10 focus-visible:ring-ring flex h-10 items-center gap-2 rounded-full py-1 pr-4 pl-1 text-sm font-medium ring-1 ring-transparent outline-none focus-visible:ring-2',
          onHero.glass,
        )}
        aria-label="Account menu"
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-24 truncate">{user.name.split(' ')[0]}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={10} className="w-60 rounded-2xl p-1.5">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-muted-foreground truncate text-xs">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/wishlist">
            <Heart /> Wishlist
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">
            <UserIcon /> Account
          </Link>
        </DropdownMenuItem>
        {isStaff(user) ? (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <LayoutDashboard /> Dashboard
            </Link>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={pending} onSelect={signOut}>
          <LogOut /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MobileUserLinks({ user }: { user: SessionUser }) {
  const { signOut, pending } = useSignOut();
  const link = 'rounded-2xl px-4 py-3 text-base font-medium hover:bg-muted';
  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground px-4 pb-2 text-sm">Signed in as {user.name}</p>
      <Link href="/wishlist" className={link}>
        Wishlist
      </Link>
      <Link href="/account" className={link}>
        Account
      </Link>
      {isStaff(user) ? (
        <Link href="/admin" className={link}>
          Dashboard
        </Link>
      ) : null}
      <button onClick={signOut} disabled={pending} className={`${link} text-left`}>
        Sign out
      </button>
    </div>
  );
}
