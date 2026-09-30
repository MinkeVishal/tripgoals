import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarClock, Mail, Map, MapPin, MessageCircle, Phone, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { RevealText } from '@/components/motion/reveal-text';
import { CallbackButton, ContactForm } from '@/components/site/contact-forms';
import { JsonLd } from '@/components/site/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { absoluteUrl, breadcrumbLd, faqLd, graph, ORG_ID, pageMetadata, WEBSITE_ID } from '@/lib/seo';
import { siteConfig } from '@/lib/site-config';
import { whatsappLink } from '@/lib/whatsapp';

export const metadata: Metadata = pageMetadata({
  title: 'Contact TripGoals: Call, WhatsApp or Email',
  description: `Plan your India trip with TripGoals. Call or WhatsApp ${siteConfig.phone}, email ${siteConfig.email}, or request a callback. Mon – Sat, 9 AM – 8 PM.`,
  path: '/contact',
  image: { url: '/hero/mountain-lake.jpg', alt: 'A glacial lake below Himalayan peaks' },
});

const FAQS = [
  {
    question: 'How do I book a package?',
    answer: `You can book a package by calling us at ${siteConfig.phone}, messaging us on WhatsApp, or filling out the contact form. Our team will guide you through the entire booking process.`,
  },
  {
    question: 'What is included in the package prices?',
    answer:
      'Our packages typically include accommodation, transportation, meals, guided tours, and entry tickets to attractions. Specific inclusions vary by package and will be clearly mentioned.',
  },
  {
    question: 'Can I customize my itinerary?',
    answer:
      'Absolutely. We specialise in customised itineraries based on your preferences, budget and travel dates. Contact us to discuss your requirements.',
  },
  {
    question: 'What is your cancellation policy?',
    answer:
      'Cancellation charges vary depending on the package and timing of cancellation. Generally, cancellations made 30 days in advance incur minimal charges. Please contact us for specific details.',
  },
];

const tel = `tel:${siteConfig.phone.replace(/\s/g, '')}`;

const METHODS = [
  { icon: Phone, title: 'Call us', info: siteConfig.phone, subtitle: 'Mon – Sat: 9:00 AM – 8:00 PM', href: tel },
  { icon: Mail, title: 'Email us', info: siteConfig.email, subtitle: "We'll respond within 24 hours", href: `mailto:${siteConfig.email}` },
  { icon: MessageCircle, title: 'WhatsApp', info: siteConfig.phone, subtitle: 'Quick support and bookings', href: whatsappLink() },
  { icon: MapPin, title: 'Visit us', info: siteConfig.address, subtitle: 'By appointment only', href: undefined },
];

const TILE =
  'group bg-background ring-border flex h-full w-full flex-col gap-10 rounded-[1.5rem] p-6 text-left ring-1 transition-[transform,box-shadow] duration-500 ease-soft hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_oklch(0.3_0.06_132/0.35)]';

const TITLE = 'text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-medium tracking-[-0.035em]';

function QuickTile({ icon: Icon, title, body }: { icon: LucideIcon; title: string; body: string }) {
  return (
    <>
      <span className="flex items-center justify-between">
        <span className="bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground flex size-11 items-center justify-center rounded-full transition-colors duration-300">
          <Icon className="size-5" />
        </span>
        <ArrowUpRight className="text-muted-foreground size-5 transition-transform duration-500 ease-soft group-hover:rotate-45" />
      </span>
      <span>
        <span className="block text-lg font-medium tracking-tight">{title}</span>
        <span className="text-muted-foreground mt-1 block text-sm">{body}</span>
      </span>
    </>
  );
}

const contactLd = {
  '@type': 'ContactPage',
  '@id': `${absoluteUrl('/contact')}#webpage`,
  url: absoluteUrl('/contact'),
  name: 'Contact TripGoals',
  inLanguage: 'en-IN',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={graph(contactLd, faqLd(FAQS), breadcrumbLd([{ name: 'Contact', path: '/contact' }]))} />
      <PageHero
        eyebrow="We're here to help"
        title="Let's plan your next trip"
        subtitle="Call, message or write to us. Our travel experts usually reply within a few hours."
        image="/hero/mountain-lake.jpg"
      />

      <section className="shell py-24 sm:py-28">
        <div className="grid gap-14 px-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <div>
            <p className="eyebrow text-primary mb-4">Get in touch</p>
            <RevealText text="Ready for your next adventure?" className={TITLE} />
            <Reveal delay={0.1}>
              <p className="text-muted-foreground mt-5 max-w-md leading-relaxed">
                Our travel experts are here to help you plan the perfect trip in India. Reach us whichever way suits
                you.
              </p>
            </Reveal>
            <ul className="mt-10">
              {METHODS.map(({ icon: Icon, title, info, subtitle, href }) => {
                const body = (
                  <>
                    <span className="bg-muted text-primary flex size-11 shrink-0 items-center justify-center rounded-full">
                      <Icon className="size-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-muted-foreground block text-xs font-medium tracking-[0.12em] uppercase">{title}</span>
                      <span className="mt-1 block font-medium break-words">{info}</span>
                      <span className="text-muted-foreground block text-sm">{subtitle}</span>
                    </span>
                    {href ? (
                      <ArrowUpRight className="text-muted-foreground size-5 shrink-0 transition-transform duration-500 ease-soft group-hover:rotate-45" />
                    ) : null}
                  </>
                );
                const cls = 'group flex items-center gap-4 border-t py-5';
                return (
                  <li key={title}>
                    {href ? (
                      <a href={href} className={cls} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        {body}
                      </a>
                    ) : (
                      <div className={cls}>{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <Reveal
            delay={0.1}
            className="bg-card ring-border self-start rounded-[1.75rem] p-6 shadow-[0_30px_70px_-40px_oklch(0.3_0.06_132/0.35)] ring-1 sm:p-10"
          >
            <h2 className="mb-2 text-2xl font-medium tracking-tight">Send us a message</h2>
            <p className="text-muted-foreground mb-8 text-sm">We&apos;ll get back to you as soon as we can.</p>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <section className="bg-muted/60 py-24 sm:py-28">
        <div className="shell">
          <div className="mb-10 px-1">
            <p className="eyebrow text-primary mb-4">Quick actions</p>
            <RevealText text="The fastest ways to reach us" className={TITLE} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal>
              <a
                href={whatsappLink('Hi! I would like to know more about your travel packages.')}
                target="_blank"
                rel="noopener noreferrer"
                className={TILE}
              >
                <QuickTile icon={MessageCircle} title="WhatsApp chat" body="Get instant responses to your queries" />
              </a>
            </Reveal>
            <Reveal delay={0.06}>
              <Link href="/packages" className={TILE}>
                <QuickTile icon={Map} title="View packages" body="Explore our travel packages" />
              </Link>
            </Reveal>
            <Reveal delay={0.12}>
              <a href={tel} className={TILE}>
                <QuickTile icon={Phone} title="Call now" body="Speak directly with our travel experts" />
              </a>
            </Reveal>
            <Reveal delay={0.18}>
              <CallbackButton className={TILE}>
                <QuickTile icon={CalendarClock} title="Request a callback" body="We'll call you at your preferred time" />
              </CallbackButton>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="shell py-24 sm:py-28">
        <div className="grid gap-12 px-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <div>
            <p className="eyebrow text-primary mb-4">FAQ</p>
            <RevealText text="Frequently asked questions" className={TITLE} />
          </div>
          <Accordion type="single" collapsible className="border-b">
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.question} value={`faq-${i}`} className="border-t border-b-0">
                <AccordionTrigger className="py-6 text-left text-base font-medium hover:no-underline sm:text-lg">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground max-w-[62ch] pb-6 leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
}
