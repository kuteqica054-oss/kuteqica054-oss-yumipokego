// Sayfa anahtarları ve her dildeki adresleri. Yeni sayfa eklerken buraya da ekleyin.
export const languages = ['tr', 'en'] as const;
export type Lang = (typeof languages)[number];
export const defaultLang: Lang = 'tr';

export const routes = {
  home: { tr: '/', en: '/en/' },
  franchise: { tr: '/franchise/', en: '/en/franchise/' },
  formats: { tr: '/formatlar/', en: '/en/formats/' },
  investment: { tr: '/yatirim/', en: '/en/investment/' },
  process: { tr: '/acilis-sureci/', en: '/en/opening-process/' },
  support: { tr: '/destek/', en: '/en/support/' },
  menu: { tr: '/menu/', en: '/en/menu/' },
  locations: { tr: '/restoranlar/', en: '/en/locations/' },
  corporate: { tr: '/kurumsal/', en: '/en/corporate/' },
  companyInfo: { tr: '/bilgi-toplumu-hizmetleri/', en: '/en/company-information/' },
  press: { tr: '/basin/', en: '/en/press/' },
  apply: { tr: '/basvuru/', en: '/en/apply/' },
  contact: { tr: '/iletisim/', en: '/en/contact/' },
  privacy: { tr: '/kvkk/', en: '/en/privacy/' },
  cookies: { tr: '/cerez-politikasi/', en: '/en/cookies/' },
  terms: { tr: '/kullanim-kosullari/', en: '/en/terms/' },
} as const;

export type RouteKey = keyof typeof routes;

export const path = (key: RouteKey, lang: Lang) => routes[key][lang];
