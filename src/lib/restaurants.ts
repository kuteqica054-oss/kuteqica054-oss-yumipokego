// locations.json → restaurants için tip (dizi boşken TypeScript türü çıkaramaz).
import locations from '../data/locations.json';

export interface Restaurant {
  id: string;
  placeholder?: boolean;
  name: string;
  city: string;
  district: string | null;
  format: string;
  address: string | null;
  phone: string | null;
  hours: { tr: string | null; en: string | null };
  lat: number;
  lon: number;
  mapsUrl: string | null;
  deliveryUrl: string | null;
  photo: string | null;
}

export const restaurants = locations.restaurants as unknown as Restaurant[];
