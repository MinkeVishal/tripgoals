import type { ItineraryDay } from '@/types';

const INVISIBLES = /[⁠​‌‍﻿]/g;
const DAY_PREFIX = /^day\s*(\d+)\s*[:.\-–—]*\s*/i;
// Emojis mark inline facts ("🏨 Hotel…", "🍽 Included…") that should be their own line.
const EMOJI_SPLIT = /(?=\p{Extended_Pictographic})/u;

const clean = (s: string) => s.replace(INVISIBLES, '').replace(/\s+/g, ' ').trim();

/**
 * Turns one legacy itinerary string
 * "Day 1   Arrival • Visit temple • Check-in  🏨 Hotel Overnight  🍽 Included: Dinner"
 * into { title: 'Arrival', points: [...] }. The "Day N" prefix is dropped because the UI
 * numbers days by position.
 */
export function parseItineraryDay(raw: string, index = 0): ItineraryDay {
  const chunks = raw
    .replace(INVISIBLES, '')
    .split('•')
    .flatMap((part) => part.split(EMOJI_SPLIT))
    .map(clean)
    .filter(Boolean);

  const [first = '', ...rest] = chunks;
  const title = clean(first.replace(DAY_PREFIX, '')) || `Day ${index + 1}`;
  return { title, points: rest };
}

/** Accepts either a JSON-encoded day (v2 format) or a legacy free-text day. */
export function decodeItineraryDay(raw: string, index: number): ItineraryDay {
  const text = raw.trim();
  if (text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text) as Partial<ItineraryDay>;
      if (typeof parsed.title === 'string' && Array.isArray(parsed.points)) {
        return { title: parsed.title, points: parsed.points.filter((p) => typeof p === 'string') };
      }
    } catch {
      /* fall through to legacy parsing */
    }
  }
  return parseItineraryDay(text, index);
}

export const encodeItineraryDay = (day: ItineraryDay) =>
  JSON.stringify({ title: day.title, points: day.points });

/**
 * Some packages keep their day-by-day plan inside `description`, one "Day N …" per line.
 * Splits that into an overview paragraph plus itinerary days.
 */
export function splitDescription(description: string): { overview: string; days: ItineraryDay[] } {
  const lines = description
    .split(/\r?\n/)
    .map(clean)
    .filter(Boolean);
  const overview: string[] = [];
  const days: ItineraryDay[] = [];
  let current: ItineraryDay | null = null;

  for (const line of lines) {
    if (DAY_PREFIX.test(line)) {
      current = { title: clean(line.replace(DAY_PREFIX, '')) || `Day ${days.length + 1}`, points: [] };
      days.push(current);
    } else if (current) {
      current.points.push(line);
    } else {
      overview.push(line);
    }
  }
  return { overview: overview.join('\n'), days };
}
