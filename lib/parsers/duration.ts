export interface ParsedDuration {
  nights: number | null;
  days: number | null;
}

/**
 * Understands the free-text durations stored today:
 * "5 night 6 days ", "3 night 4 days", "1 day ", "7 night 7 day".
 */
export function parseDuration(raw: string | null | undefined): ParsedDuration {
  const text = (raw ?? '').trim().toLowerCase();
  if (!text) return { nights: null, days: null };
  const nights = /(\d+)\s*n(?:ight)?s?\b/.exec(text);
  const days = /(\d+)\s*d(?:ay)?s?\b/.exec(text);
  return {
    nights: nights ? Number(nights[1]) : null,
    days: days ? Number(days[1]) : null,
  };
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export function formatDuration({ nights, days }: ParsedDuration): string {
  if (nights && days) return `${plural(nights, 'Night')} / ${plural(days, 'Day')}`;
  if (days) return plural(days, 'Day');
  if (nights) return plural(nights, 'Night');
  return '';
}

export const DURATION_BANDS = [
  { value: 'short', label: '1–3 days', min: 1, max: 3 },
  { value: 'medium', label: '4–6 days', min: 4, max: 6 },
  { value: 'long', label: '7+ days', min: 7, max: Infinity },
] as const;

export type DurationBand = (typeof DURATION_BANDS)[number]['value'];

export function matchesDurationBand(days: number | null, band: DurationBand): boolean {
  if (days === null) return false;
  const b = DURATION_BANDS.find((x) => x.value === band);
  return !!b && days >= b.min && days <= b.max;
}
