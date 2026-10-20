import type { Lang } from '../i18n/routes';
import { useT } from '../i18n/utils';

const strip = (s: string) => s.replace(/\[TODO(: [^\]]+)?\]/g, '').replace(/\s+/g, ' ').trim();

/** schema.org FAQPage — TODO işaretleri çıkarılır. */
export const faqJsonLd = (lang: Lang) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  inLanguage: lang,
  mainEntity: useT(lang).faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
  })),
});
