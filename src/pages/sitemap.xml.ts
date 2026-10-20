// Her iki dil sürümünü ve hreflang karşılıklarını içeren site haritası.
import type { APIRoute } from 'astro';
import { routes } from '../i18n/routes';
import { absUrl } from '../i18n/utils';
import press from '../data/press.json';

export const GET: APIRoute = () => {
  const pairs: { tr: string; en: string }[] = Object.values(routes).map((r) => ({ tr: r.tr, en: r.en }));
  press.items.forEach((n) => pairs.push({ tr: `${routes.press.tr}${n.slug.tr}/`, en: `${routes.press.en}${n.slug.en}/` }));
  const entry = (loc: string, p: { tr: string; en: string }) => `  <url>
    <loc>${absUrl(loc)}</loc>
    <xhtml:link rel="alternate" hreflang="tr" href="${absUrl(p.tr)}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${absUrl(p.en)}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(p.tr)}"/>
  </url>`;
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${pairs.flatMap((p) => [entry(p.tr, p), entry(p.en, p)]).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
