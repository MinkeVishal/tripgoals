'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getMyWishlistAction, toggleWishlistAction } from '@/lib/actions/wishlist';

interface WishlistContextValue {
  ids: ReadonlySet<string>;
  signedIn: boolean;
  /** Customer's name once known, used to personalise WhatsApp messages. */
  name: string;
  toggle: (packageId: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue>({
  ids: new Set(),
  signedIn: false,
  name: '',
  toggle: async () => {},
});

export const useWishlist = () => useContext(WishlistContext);

/** Fire after login/logout so the provider re-reads who is signed in. */
export const AUTH_CHANGED_EVENT = 'tg:auth-changed';
export const notifyAuthChanged = () => window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));

interface Snapshot {
  signedIn: boolean;
  name: string;
  ids: ReadonlySet<string>;
}

/**
 * Package cards are server-rendered and cached, so the per-user "saved" state is loaded here,
 * client-side (on load, on auth changes, on tab focus), and toggled optimistically.
 */
export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<Snapshot>({ signedIn: false, name: '', ids: new Set() });

  // Latest state for event handlers, plus the in-flight load so an early click can wait for it
  // instead of mistaking a signed-in customer for a guest.
  const latest = useRef(state);
  const loading = useRef<Promise<void>>(Promise.resolve());

  const commit = useCallback((next: Snapshot) => {
    latest.current = next;
    setState(next);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      loading.current = getMyWishlistAction()
        .then((res) => {
          if (!cancelled) commit({ signedIn: res.signedIn, name: res.name, ids: new Set(res.ids) });
        })
        .catch(() => undefined); // keep the previous state if the network hiccups
      return loading.current;
    };
    void load();
    const onChange = () => void load();
    window.addEventListener(AUTH_CHANGED_EVENT, onChange);
    window.addEventListener('focus', onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGED_EVENT, onChange);
      window.removeEventListener('focus', onChange);
    };
  }, [commit]);

  const toggle = useCallback(
    async (packageId: string) => {
      await loading.current; // make sure we know whether the visitor is signed in
      const before = latest.current;

      if (!before.signedIn) {
        toast('Sign in to save trips to your wishlist');
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }

      const setSaved = (saved: boolean) => {
        const ids = new Set(latest.current.ids);
        if (saved) ids.add(packageId);
        else ids.delete(packageId);
        commit({ ...latest.current, ids });
      };

      const wasSaved = before.ids.has(packageId);
      setSaved(!wasSaved); // optimistic
      const result = await toggleWishlistAction(packageId);
      if (!result.ok) {
        setSaved(wasSaved); // roll back
        toast.error(result.error);
        return;
      }
      setSaved(result.data.wishlisted);
      if (window.location.pathname === '/wishlist') router.refresh(); // drop the removed card from the server-rendered grid
      toast.success(result.data.wishlisted ? 'Saved to your wishlist' : 'Removed from your wishlist');
    },
    [commit, router],
  );

  const value = useMemo(
    () => ({ ids: state.ids, signedIn: state.signedIn, name: state.name, toggle }),
    [state, toggle],
  );
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
