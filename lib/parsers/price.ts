export const PRICE_BANDS = [
  { value: 'budget', label: 'Under ₹15,000', min: 0, max: 15000 },
  { value: 'mid', label: '₹15,000 – ₹30,000', min: 15000, max: 30000 },
  { value: 'premium', label: 'Above ₹30,000', min: 30000, max: Infinity },
] as const;

export type PriceBand = (typeof PRICE_BANDS)[number]['value'];

export function matchesPriceBand(price: number, band: PriceBand): boolean {
  const b = PRICE_BANDS.find((x) => x.value === band);
  return !!b && price >= b.min && (price < b.max || b.max === Infinity);
}

export const formatPrice = (price: number) =>
  price > 0 ? `₹${price.toLocaleString('en-IN')}` : 'On request';
