'use client';

import { MessageCircle, PhoneCall } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/brand';
import { Button } from '@/components/ui/button';
import { bookingMessage, enquiryMessage, whatsappLink } from '@/lib/whatsapp';
import type { TravelPackage } from '@/types';
import { WishlistButton } from './wishlist-button';
import { useWishlist } from './wishlist-provider';

type PackageSummary = Pick<TravelPackage, 'id' | 'title' | 'durationLabel' | 'price'>;

/** Book Now / Quick Contact hand off to WhatsApp with a prefilled message (personalised when signed in). */
export function PackageActions({ pkg }: { pkg: PackageSummary }) {
  const { name } = useWishlist();
  return (
    <div className="grid gap-2.5">
      <Button asChild size="xl" className="w-full">
        <a href={whatsappLink(bookingMessage(pkg, name || undefined))} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon className="size-5" /> Book Now
        </a>
      </Button>
      <div className="grid grid-cols-[1fr_auto] gap-2.5">
        <Button asChild size="xl" variant="outline" className="w-full">
          <a href={whatsappLink(enquiryMessage(pkg, name || undefined))} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-5" /> Quick Contact
          </a>
        </Button>
        <WishlistButton packageId={pkg.id} packageTitle={pkg.title} variant="pill" />
      </div>
    </div>
  );
}

export function CallLink({ phone }: { phone: string }) {
  return (
    <a
      href={`tel:${phone.replace(/\s/g, '')}`}
      className="text-muted-foreground hover:text-foreground inline-flex items-center justify-center gap-2 text-sm transition-colors"
    >
      <PhoneCall className="size-4" /> Prefer to talk? Call {phone}
    </a>
  );
}
