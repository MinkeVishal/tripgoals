import { siteConfig } from '@/lib/site-config';
import { formatPrice } from '@/lib/parsers/price';
import type { TravelPackage } from '@/types';

/** wa.me link with a prefilled message. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Joins lines, dropping skipped ones (null/false) but keeping intentional blank separators. */
const lines = (...items: Array<string | null | false | undefined>) =>
  items.filter((line): line is string => typeof line === 'string').join('\n');

const greeting = (name?: string) => (name ? `Hi, I'm ${name}.` : 'Hi!');

type PackageSummary = Pick<TravelPackage, 'title' | 'durationLabel' | 'price'>;

const packageLines = (pkg: PackageSummary) => [
  `Package: ${pkg.title}`,
  pkg.durationLabel ? `Duration: ${pkg.durationLabel}` : null,
  `Price: ${formatPrice(pkg.price)}`,
];

export function bookingMessage(pkg: PackageSummary, name?: string) {
  return lines(
    `${greeting(name)} I'm interested in booking the following package:`,
    '',
    ...packageLines(pkg),
    '',
    'Please share more details and booking information.',
  );
}

export function enquiryMessage(pkg: PackageSummary, name?: string) {
  return lines(
    `${greeting(name)} I'd like to enquire about:`,
    '',
    ...packageLines(pkg),
    '',
    'Please contact me with more details.',
  );
}

export interface ContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export function contactMessage(v: ContactMessageInput) {
  return lines(
    '*Contact form enquiry*',
    '',
    `*Name:* ${`${v.firstName} ${v.lastName}`.trim()}`,
    `*Email:* ${v.email}`,
    v.phone ? `*Phone:* ${v.phone}` : null,
    v.subject ? `*Subject:* ${v.subject}` : null,
    '',
    v.message,
  );
}

export interface CallbackMessageInput {
  name: string;
  phone: string;
  time: string;
  reason: string;
}

export function callbackMessage(v: CallbackMessageInput) {
  return lines(
    '*Callback request*',
    '',
    `*Name:* ${v.name}`,
    `*Phone:* ${v.phone}`,
    `*Preferred time:* ${v.time}`,
    `*Reason:* ${v.reason}`,
  );
}
