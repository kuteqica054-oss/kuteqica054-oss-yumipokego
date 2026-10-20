import site from '../config/site.json';
import type { Lang } from './routes';
import { tr } from './tr';
import { en } from './en';

export const dict = { tr, en };
export const useT = (lang: Lang) => dict[lang];

/** {tr, en} nesnesinden doğru dili seçer. */
export type L10n<T = string> = { tr: T; en: T };
export const pick = <T,>(v: L10n<T> | T, lang: Lang): T =>
  v && typeof v === 'object' && 'tr' in (v as object) && 'en' in (v as object) ? (v as L10n<T>)[lang] : (v as T);

export const locale = (lang: Lang) => (lang === 'tr' ? 'tr-TR' : 'en-GB');

export const currencyCode = (lang: Lang) => site.currency[lang] as string;
export const currencySymbol = (lang: Lang) => {
  const code = currencyCode(lang);
  return ({ TRY: '₺', USD: '$', EUR: '€' } as Record<string, string>)[code] ?? code;
};

export type Num = number | null | { min: number | null; max: number | null };
export type Unit = 'money' | 'area' | 'months' | 'weeks' | 'percent' | 'years' | 'count' | 'text';

const fmtOne = (n: number, unit: Unit, lang: Lang) => {
  const loc = locale(lang);
  if (unit === 'money')
    return new Intl.NumberFormat(loc, { style: 'currency', currency: currencyCode(lang), maximumFractionDigits: 0 }).format(n);
  if (unit === 'percent') return new Intl.NumberFormat(loc, { style: 'percent', maximumFractionDigits: 1 }).format(n / 100);
  return new Intl.NumberFormat(loc).format(n);
};

const unitSuffix: Record<Lang, Partial<Record<Unit, string>>> = {
  tr: { area: 'm²', months: 'ay', weeks: 'hafta', years: 'yıl', count: '' },
  en: { area: 'm²', months: 'months', weeks: 'weeks', years: 'years', count: '' },
};

/** Değeri biçimlendirir. Boşsa null döner (bileşen "—" + TODO gösterir). */
export function formatValue(v: Num | undefined, unit: Unit, lang: Lang): string | null {
  if (v === null || v === undefined) return null;
  const sfx = unitSuffix[lang][unit];
  const tail = sfx ? ` ${sfx}` : '';
  if (typeof v === 'number') return fmtOne(v, unit, lang) + tail;
  if (v.min === null && v.max === null) return null;
  if (v.min !== null && v.max !== null) return `${fmtOne(v.min, unit, lang)} – ${fmtOne(v.max, unit, lang)}${tail}`;
  const one = (v.min ?? v.max) as number;
  return `${lang === 'tr' ? (v.min !== null ? '' : '≤ ') : v.min !== null ? 'from ' : 'up to '}${fmtOne(one, unit, lang)}${tail}${lang === 'tr' && v.min !== null ? "'den başlayan" : ''}`;
}

/** Boş değer için gösterilecek yer tutucu: "— ₺", "— m²" vb. */
export function emptyValue(unit: Unit, lang: Lang) {
  if (unit === 'money') return lang === 'tr' ? '— ₺' : `— ${currencySymbol(lang)}`;
  const sfx = unitSuffix[lang][unit];
  return sfx ? `— ${sfx}` : '—';
}

export const formatDate = (iso: string, lang: Lang) =>
  new Intl.DateTimeFormat(locale(lang), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

/** Mutlak adres — astro.config.mjs → site (SITE_URL ortam değişkeni veya site.json → url) */
export const siteUrl = (import.meta.env.SITE as string | undefined) ?? site.url;
export const absUrl = (p: string) => new URL(p, siteUrl).toString();

/** tel: bağlantısı (boşluklar kaldırılır) */
export const telHref = (phone: unknown) => `tel:${String(phone).replace(/\s/g, '')}`;
