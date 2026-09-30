'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Package,
  Shapes,
  Sun,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useSignOut } from '@/components/site/user-menu';
import { cn } from '@/lib/utils';
import type { Role, SessionUser } from '@/types';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  minRole: Role;
}

const NAV: NavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true, minRole: 'editor' },
  { href: '/admin/packages', label: 'Packages', icon: Package, minRole: 'editor' },
  { href: '/admin/adventures', label: 'Adventures', icon: Compass, minRole: 'editor' },
  { href: '/admin/categories', label: 'Categories', icon: Shapes, minRole: 'editor' },
  { href: '/admin/banners', label: 'Banners', icon: ImageIcon, minRole: 'admin' },
  { href: '/admin/users', label: 'Users', icon: Users, minRole: 'admin' },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('') || 'U';

function NavLinks({ user, onNavigate }: { user: SessionUser; onNavigate?: () => void }) {
  const pathname = usePathname();
  const items = NAV.filter((item) => user.role === 'admin' || item.minRole === 'editor');
  return (
    <nav aria-label="Admin" className="grid gap-1">
      {items.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              active
                ? 'bg-primary/15 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
            )}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex items-center gap-2.5 px-2">
      <Image src="/Tripgoal_logo.png" alt="" width={34} height={34} className="rounded-full" />
      <span className="leading-tight">
        <span className="block text-sm leading-none font-semibold tracking-[0.18em] uppercase">TripGoals</span>
        <span className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase">Dashboard</span>
      </span>
    </Link>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="hidden size-[18px] dark:block" />
      <Moon className="size-[18px] dark:hidden" />
    </Button>
  );
}

export function AdminShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { signOut, pending } = useSignOut();

  return (
    <div className="bg-background min-h-svh lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="border-border bg-card/50 sticky top-0 hidden h-svh flex-col gap-6 border-r p-4 lg:flex">
        <Brand />
        <NavLinks user={user} />
        <div className="mt-auto grid gap-1">
          <Link
            href="/"
            target="_blank"
            className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
          >
            <ExternalLink className="size-[18px]" /> View site
          </Link>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="border-border bg-background/80 sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-xl sm:px-6">
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="lg:hidden">
            <Brand />
          </div>
          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:bg-accent focus-visible:ring-ring flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm outline-none focus-visible:ring-2">
                <Avatar className="size-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-32 truncate sm:inline">{user.name}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {user.email} · <span className="capitalize">{user.role}</span>
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account">Account settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem disabled={pending} onSelect={signOut}>
                  <LogOut /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main id="main" className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Brand />
          </SheetHeader>
          <div className="px-4">
            <NavLinks user={user} onNavigate={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
