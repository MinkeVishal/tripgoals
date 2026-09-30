import {
  Bed,
  Bus,
  Camera,
  Car,
  CheckCircle2,
  Coffee,
  Compass,
  Footprints,
  Hotel,
  Palmtree,
  Plane,
  Sparkles,
  TrainFront,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from 'lucide-react';
import type { AmenityIconKey } from '@/lib/parsers/amenities';

export const AMENITY_ICONS: Record<AmenityIconKey, LucideIcon> = {
  meals: Utensils,
  breakfast: Coffee,
  hotel: Hotel,
  stay: Bed,
  car: Car,
  bus: Bus,
  train: TrainFront,
  flight: Plane,
  guide: Compass,
  camera: Camera,
  wifi: Wifi,
  pool: Waves,
  spa: Sparkles,
  trek: Footprints,
  beach: Palmtree,
  check: CheckCircle2,
};

export function AmenityIcon({ name, className }: { name: string; className?: string }) {
  const Icon = AMENITY_ICONS[name as AmenityIconKey] ?? CheckCircle2;
  return <Icon className={className} aria-hidden />;
}
