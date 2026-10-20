// Derleme öncesi: OG görselleri (1200×630, TR + EN) ve favicon PNG'lerini SVG'den üretir → public/
// Metinleri değiştirmek için aşağıdaki OG_TEXT nesnesini düzenleyin.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

const root = new URL('../', import.meta.url);
const fonts = ['scripts/fonts/BricolageGrotesque-Bold.ttf', 'scripts/fonts/DMSans-Medium.ttf'].map((f) => new URL(f, root).pathname);
const render = (svg, width) =>
  new Resvg(svg, { fitTo: { mode: 'width', value: width }, font: { fontFiles: fonts, loadSystemFonts: false, defaultFontFamily: 'DM Sans' } }).render().asPng();

const OG_TEXT = {
  tr: { eyebrow: 'Franchise fırsatı · Türkiye', l1: 'Kendi YumiPokeGo', l2: 'restoranınızı açın', sub: 'Poke bowl · Wok · Roll — hızlı-rahat Asya mutfağı', cta: 'Franchise başvurusu' },
  en: { eyebrow: 'Franchise opportunity · Turkey', l1: 'Open your own', l2: 'YumiPokeGo restaurant', sub: 'Poke bowls · Wok · Rolls — fast-casual Asian food', cta: 'Apply for a franchise' },
};

const bowl = (cx, cy, r) => {
  const sectors = ['#ee6a4e', '#6e9a3c', '#f5b83d', '#9fc46a', '#ee6a4e', '#e6efc6'];
  const fr = r * 0.78;
  let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0a1f2c"/><circle cx="${cx}" cy="${cy}" r="${r * 0.92}" fill="#173d55"/><circle cx="${cx}" cy="${cy}" r="${fr + 6}" fill="#f6efe2"/><circle cx="${cx}" cy="${cy}" r="${fr}" fill="#fffcf5"/>`;
  sectors.forEach((c, i) => {
    const a0 = -Math.PI / 2 + (i / 6) * Math.PI * 2 + 0.06, a1 = -Math.PI / 2 + ((i + 1) / 6) * Math.PI * 2 - 0.06;
    const ri = fr * 0.32, ro = fr * 0.94;
    const p = (a, rr) => `${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`;
    s += `<path d="M${p(a0, ri)} L${p(a0, ro)} A${ro} ${ro} 0 0 1 ${p(a1, ro)} L${p(a1, ri)} A${ri} ${ri} 0 0 0 ${p(a0, ri)} Z" fill="${c}"/>`;
  });
  for (let i = 0; i < 26; i++) { const a = i * 2.4, rr = fr * (0.2 + ((i * 37) % 70) / 100); s += `<ellipse cx="${(cx + Math.cos(a) * rr).toFixed(1)}" cy="${(cy + Math.sin(a) * rr).toFixed(1)}" rx="3.5" ry="2" fill="${i % 4 ? '#fbf7f0' : '#1f2d2a'}"/>`; }
  return s;
};

const og = (t) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0e2a3b"/>
  <g fill="#ffffff" opacity=".05">${Array.from({ length: 60 }, (_, i) => `<ellipse cx="${(i * 97) % 1200}" cy="${(i * 53) % 630}" rx="4" ry="2"/>`).join('')}</g>
  ${bowl(960, 330, 230)}
  <g transform="translate(80 92)">
    <circle cx="22" cy="22" r="22" fill="#fbf7f0"/><path d="M22 22 L22 4 A18 18 0 0 1 39.1 16.4 Z" fill="#ee6a4e"/><path d="M22 22 L39.1 16.4 A18 18 0 0 1 32.6 36.6 Z" fill="#6e9a3c"/><path d="M22 22 L32.6 36.6 A18 18 0 0 1 11.4 36.6 Z" fill="#f5b83d"/><path d="M22 22 L11.4 36.6 A18 18 0 0 1 4.9 16.4 Z" fill="#9fc46a"/><circle cx="22" cy="22" r="5" fill="#fbf7f0"/>
    <text x="58" y="33" font-family="Bricolage Grotesque" font-weight="700" font-size="34" fill="#fbf7f0" letter-spacing="-1">Yumi<tspan fill="#ee6a4e">Poke</tspan><tspan fill="#9fc46a">Go</tspan></text>
  </g>
  <text x="80" y="218" font-family="DM Sans" font-weight="500" font-size="26" fill="#f5b83d">${t.eyebrow}</text>
  <text x="80" y="300" font-family="Bricolage Grotesque" font-weight="700" font-size="70" fill="#ffffff" letter-spacing="-2">${t.l1}</text>
  <text x="80" y="378" font-family="Bricolage Grotesque" font-weight="700" font-size="70" fill="#ffffff" letter-spacing="-2">${t.l2}</text>
  <text x="80" y="438" font-family="DM Sans" font-weight="500" font-size="26" fill="#b9c7d0">${t.sub}</text>
  <rect x="80" y="486" width="${t.cta.length * 14.5 + 56}" height="62" rx="31" fill="#c4442a"/>
  <text x="108" y="526" font-family="DM Sans" font-weight="500" font-size="25" fill="#ffffff">${t.cta} →</text>
</svg>`;

mkdirSync(new URL('public/og/', root), { recursive: true });
for (const lang of ['tr', 'en']) {
  writeFileSync(new URL(`public/og/og-${lang}.png`, root), render(og(OG_TEXT[lang]), 1200));
}
const fav = readFileSync(new URL('public/favicon.svg', root), 'utf8');
for (const [name, size] of [['favicon-32.png', 32], ['apple-touch-icon.png', 180], ['icon-192.png', 192], ['icon-512.png', 512]]) {
  writeFileSync(new URL(`public/${name}`, root), render(fav, size));
}
console.log('OG ve favicon görselleri üretildi.');
