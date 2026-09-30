'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { InstagramIcon, WhatsAppIcon } from '@/components/icons/brand';
import { siteConfig } from '@/lib/site-config';
import { whatsappLink } from '@/lib/whatsapp';

/** One pair of floating contact buttons for the whole site. Appears once the page hero is scrolled past. */
export function FloatingContact() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setVisible(y > window.innerHeight * 0.6));

  const base =
    'flex size-12 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 ring-1 ring-white/30 transition-transform duration-300 hover:-translate-y-0.5 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6"
        >
          <a
            href={whatsappLink('Hi! I found you on the TripGoals website.')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            className={`${base} bg-[#25d366]`}
          >
            <WhatsAppIcon className="size-6" />
          </a>
          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow us on Instagram"
            className={`${base} bg-linear-to-tr from-[#f9a03f] via-[#e1306c] to-[#833ab4]`}
          >
            <InstagramIcon className="size-6" />
          </a>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
