import type { Metadata } from 'next';
import Image from 'next/image';
import { Award, Clock, Compass, Eye, HandCoins, Leaf, ShieldCheck, Users } from 'lucide-react';
import { ClipReveal } from '@/components/motion/clip-reveal';
import { Reveal } from '@/components/motion/reveal';
import { RevealText } from '@/components/motion/reveal-text';
import { ArrowLink } from '@/components/site/arrow-link';
import { JsonLd } from '@/components/site/json-ld';
import { PageHero } from '@/components/site/page-hero';
import { absoluteUrl, breadcrumbLd, graph, ORG_ID, pageMetadata, WEBSITE_ID } from '@/lib/seo';

const DESCRIPTION =
  'TripGoals is a travel agency in Chhatrapati Sambhajinagar, Maharashtra, planning India tours for over a decade: Himalayan treks, Kerala backwaters, Rajasthan palaces and more.';

export const metadata: Metadata = pageMetadata({
  title: 'About TripGoals: Your India Travel Experts',
  description: DESCRIPTION,
  path: '/about',
  image: { url: '/hero/kashmir-meadow.jpg', alt: 'Meadows and snow-capped peaks in Kashmir' },
});

const aboutLd = {
  '@type': 'AboutPage',
  '@id': `${absoluteUrl('/about')}#webpage`,
  url: absoluteUrl('/about'),
  name: 'About TripGoals',
  description: DESCRIPTION,
  inLanguage: 'en-IN',
  isPartOf: { '@id': WEBSITE_ID },
  about: { '@id': ORG_ID },
  mainEntity: { '@id': ORG_ID },
};

const FEATURES = [
  {
    icon: Award,
    title: 'Expert guidance',
    description:
      'Our experienced travel consultants give personalised recommendations based on your preferences and budget.',
  },
  {
    icon: ShieldCheck,
    title: 'Safe and secure',
    description:
      'Your safety is our priority. Every package we offer meets strict safety standards and protocols.',
  },
  {
    icon: Clock,
    title: '24/7 support',
    description: 'Round-the-clock support to help you before, during and after your journey.',
  },
  {
    icon: HandCoins,
    title: 'Best value',
    description: 'Competitive pricing with transparent costs and no hidden fees.',
  },
  {
    icon: Users,
    title: 'Local connections',
    description:
      'Strong partnerships with local operators mean authentic experiences that support communities.',
  },
  {
    icon: Leaf,
    title: 'Responsible tourism',
    description:
      "Sustainable, responsible travel that preserves India's natural and cultural heritage.",
  },
];

const STATS = [
  { value: '10+', label: 'Years of experience' },
  { value: '50,000+', label: 'Happy travellers' },
  { value: '1,000+', label: 'Destinations covered' },
  { value: '99%', label: 'Customer satisfaction' },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={graph(aboutLd, breadcrumbLd([{ name: 'About', path: '/about' }]))} />
      <PageHero
        eyebrow="Our story"
        title="About TripGoals"
        subtitle="Discover our passion for creating unforgettable travel experiences."
        image="/hero/kashmir-meadow.jpg"
      />

      <section className="shell py-24 sm:py-32">
        <div className="grid items-center gap-14 px-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <p className="eyebrow text-primary mb-4">Who we are</p>
            <RevealText
              text="Travel is not just about places. It is about the memories you bring home."
              className="text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-medium tracking-[-0.035em]"
            />
            <Reveal
              delay={0.1}
              className="text-muted-foreground mt-8 max-w-[62ch] space-y-4 leading-relaxed"
            >
              <p>
                Founded with a passion for exploring India&apos;s incredible diversity, TripGoals
                has been curating exceptional travel experiences for over a decade.
              </p>
              <p>
                Our team of travel experts designs itineraries that show the best of India, from the
                snow-capped peaks of the Himalayas to the beaches of Goa, and from the royal palaces
                of Rajasthan to the backwaters of Kerala.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {[
                {
                  icon: Compass,
                  title: 'Our mission',
                  body: "To make incredible India accessible to every traveller through authentic, sustainable and memorable experiences that showcase the country's culture, heritage and natural beauty.",
                },
                {
                  icon: Eye,
                  title: 'Our vision',
                  body: "To be India's most trusted travel companion, known for exceptional service, thoughtful itineraries and responsible tourism that benefits local communities.",
                },
              ].map(({ icon: Icon, title, body }, i) => (
                <Reveal
                  key={title}
                  delay={0.1 + i * 0.08}
                  className="bg-muted rounded-[1.4rem] p-6"
                >
                  <Icon className="text-primary size-5" />
                  <h3 className="mt-4 font-medium tracking-tight">{title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{body}</p>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Overlapping photo pair */}
          <div className="relative pb-16 sm:pb-24 lg:pb-0">
            <ClipReveal className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden rounded-[1.8rem]">
              <Image
                src="/hero/mountain-lake.jpg"
                alt="A turquoise glacial lake below Himalayan peaks"
                fill
                sizes="(min-width: 1024px) 38vw, 82vw"
                className="object-cover"
              />
            </ClipReveal>
            <ClipReveal
              delay={0.2}
              className="ring-background absolute bottom-0 left-0 aspect-square w-[46%] overflow-hidden rounded-[1.5rem] ring-8 lg:-bottom-10"
            >
              <Image
                src="/hero/mysore-palace.jpg"
                alt="The ornate Durbar Hall of Mysore Palace"
                fill
                sizes="(min-width: 1024px) 22vw, 46vw"
                className="object-cover"
              />
            </ClipReveal>
          </div>
        </div>
      </section>

      <section className="bg-muted/60 py-24 sm:py-32">
        <div className="shell">
          <div className="grid gap-14 px-1 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow text-primary mb-4">Why us</p>
              <RevealText
                text="Why travellers choose TripGoals"
                className="text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.08] font-medium tracking-[-0.035em]"
              />
              <Reveal delay={0.15} className="mt-8">
                <ArrowLink href="/packages">Browse packages</ArrowLink>
              </Reveal>
            </div>

            <ol className="grid gap-x-10 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, description }, i) => (
                <li key={title}>
                  <Reveal
                    delay={(i % 2) * 0.08}
                    className="border-border flex h-full flex-col gap-4 border-t py-8"
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-background text-primary flex size-11 items-center justify-center rounded-full">
                        <Icon className="size-5" />
                      </span>
                      <span className="text-muted-foreground text-sm tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium tracking-tight">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="shell py-24 sm:py-28">
        <dl className="grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className="border-border flex flex-col-reverse gap-2 border-l px-5 sm:px-8"
            >
              <dt className="text-muted-foreground text-sm">{stat.label}</dt>
              <dd className="text-[clamp(2.4rem,5vw,4rem)] leading-none font-medium tracking-[-0.04em] tabular-nums">
                {stat.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>
    </>
  );
}
