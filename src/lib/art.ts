// Kodla çizilen yemek illüstrasyonları (SVG string üretir, derleme sırasında çalışır).
// Tüm çizimler aynı palet ve çizgi diliyle: düz renk, ince açık vurgular, susam noktaları.

export type Topping =
  | 'salmon' | 'tuna' | 'chicken' | 'tofu' | 'shrimp'
  | 'avocado' | 'edamame' | 'mango' | 'cucumber' | 'carrot' | 'corn' | 'seaweed';

const C = {
  ink: '#0e2a3b', ink2: '#173d55', ink3: '#24506c',
  rice: '#fffcf5', grain: '#ece2cf', grain2: '#f3ecdf',
  salmon: '#ee6a4e', salmonFat: '#fbc2ae', salmonDark: '#d9563b',
  tuna: '#cf4458', tunaDark: '#a9344a', tunaLight: '#e98a97',
  chicken: '#e3a35c', chickenDark: '#9a6331',
  tofu: '#f7edd3', tofuEdge: '#e2bf78',
  shrimp: '#f4956a', shrimpLight: '#fde3d5',
  avoSkin: '#3f6b22', avo: '#a9c95e', avoLight: '#d5e69a',
  edamame: '#8dbf4a', edamameDark: '#5f8f2c',
  mango: '#f5b83d', mangoLight: '#fcd57e',
  cucumber: '#e6efc6', cucumberRim: '#4f7a2a', seed: '#c3d38e',
  carrot: '#f08a3c', corn: '#f7cf4a', cornDark: '#e5b52f',
  seaweed: '#4f7a2a', seaweed2: '#6e9a3c',
  sesame: '#f7f0e0', sesameDark: '#2a2a2a', nori: '#1f2d2a',
  wood: '#d9a066', woodDark: '#b98048',
};

/** Deterministik rastgele (her derlemede aynı çizim) */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const f = (n: number) => Math.round(n * 10) / 10;

type Piece = (x: number, y: number, rot: number, r: () => number) => string;

const pieces: Record<Topping, Piece> = {
  salmon: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-11" y="-11" width="22" height="22" rx="4.5" fill="${C.salmon}"/><path d="M-9 -3 Q0 -7 9 -3 M-9 4 Q0 0 9 4" stroke="${C.salmonFat}" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="-11" y="5" width="22" height="6" rx="3" fill="${C.salmonDark}" opacity=".35"/></g>`,
  tuna: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-11" y="-11" width="22" height="22" rx="4.5" fill="${C.tuna}"/><path d="M-8 -4 L8 -6" stroke="${C.tunaLight}" stroke-width="1.8" stroke-linecap="round"/><rect x="-11" y="5" width="22" height="6" rx="3" fill="${C.tunaDark}" opacity=".5"/></g>`,
  chicken: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-16" y="-8" width="32" height="16" rx="7" fill="${C.chicken}"/><path d="M-9 -6 L-5 6 M-1 -6 L3 6 M7 -6 L11 6" stroke="${C.chickenDark}" stroke-width="2" stroke-linecap="round" opacity=".7"/></g>`,
  tofu: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-10" y="-10" width="20" height="20" rx="3.5" fill="${C.tofuEdge}"/><rect x="-8" y="-8" width="16" height="15" rx="3" fill="${C.tofu}"/></g>`,
  shrimp: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M-12 4 A12 12 0 1 1 8 9" stroke="${C.shrimp}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M-6 -7 l3 4 M2 -9 l0 5 M8 -4 l-4 3" stroke="${C.shrimpLight}" stroke-width="1.8" stroke-linecap="round"/></g>`,
  avocado: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M-22 0 Q-20 -12 0 -13 Q20 -12 22 0 Q20 5 0 5 Q-20 5 -22 0Z" fill="${C.avoSkin}"/><path d="M-19 0 Q-17 -9 0 -10 Q17 -9 19 0 Q17 2.5 0 2.5 Q-17 2.5 -19 0Z" fill="${C.avo}"/><path d="M-12 -4 Q0 -8 12 -4" stroke="${C.avoLight}" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`,
  edamame: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><ellipse rx="8" ry="6" fill="${C.edamame}"/><ellipse rx="8" ry="6" fill="none" stroke="${C.edamameDark}" stroke-width="1.2" opacity=".6"/><ellipse cx="-2.5" cy="-2" rx="2.4" ry="1.4" fill="#c6e08f" opacity=".8"/></g>`,
  mango: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><rect x="-10" y="-10" width="20" height="20" rx="4" fill="${C.mango}"/><path d="M-6 -6 L4 -6" stroke="${C.mangoLight}" stroke-width="2.5" stroke-linecap="round"/></g>`,
  cucumber: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><circle r="12" fill="${C.cucumberRim}"/><circle r="10" fill="${C.cucumber}"/><circle cx="-3" cy="-2" r="1.3" fill="${C.seed}"/><circle cx="3" cy="-2" r="1.3" fill="${C.seed}"/><circle cx="0" cy="3" r="1.3" fill="${C.seed}"/></g>`,
  carrot: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})"><path d="M-14 -4 L12 -8 M-12 2 L14 -1 M-10 8 L13 6" stroke="${C.carrot}" stroke-width="3.2" stroke-linecap="round"/></g>`,
  corn: (x, y, rot, r) => {
    let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})">`;
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + r();
      s += `<rect x="${f(Math.cos(a) * 7 - 3)}" y="${f(Math.sin(a) * 7 - 3)}" width="6" height="6" rx="2" fill="${i % 2 ? C.corn : C.cornDark}"/>`;
    }
    return s + `<rect x="-3" y="-3" width="6" height="6" rx="2" fill="${C.corn}"/></g>`;
  },
  seaweed: (x, y, rot) =>
    `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(rot)})" fill="none" stroke-linecap="round"><path d="M-14 -6 q4 -5 8 0 t8 0 t8 0" stroke="${C.seaweed}" stroke-width="3.2"/><path d="M-12 2 q4 -5 8 0 t8 0 t8 0" stroke="${C.seaweed2}" stroke-width="3.2"/><path d="M-10 9 q4 -5 8 0 t8 0" stroke="${C.seaweed}" stroke-width="3"/></g>`,
};

// Malzeme başına adet ve yerleşim yoğunluğu
const density: Record<Topping, number> = {
  salmon: 9, tuna: 9, chicken: 7, tofu: 9, shrimp: 6, avocado: 5, edamame: 14,
  mango: 9, cucumber: 7, carrot: 5, corn: 6, seaweed: 5,
};

export interface BowlOptions {
  toppings: Topping[];
  seed?: number;
  /** Animasyon için her malzeme grubuna class ve gecikme ekler */
  animate?: boolean;
  chopsticks?: boolean;
  idPrefix?: string;
}

/**
 * Üstten görünen bowl. viewBox: -130 -130 260 260 (merkez 0,0).
 */
export function bowlSvg({ toppings, seed = 7, animate = false, chopsticks = false, idPrefix = 'b' }: BowlOptions) {
  const r = rng(seed);
  const R = 96; // yemek yarıçapı
  const n = toppings.length;
  const groups: string[] = [];
  toppings.forEach((tp, i) => {
    const center = -Math.PI / 2 + (i / n) * Math.PI * 2;
    const span = (Math.PI * 2) / n;
    const count = density[tp];
    let g = '';
    // avokado: yelpaze dilimler
    if (tp === 'avocado') {
      for (let k = 0; k < count; k++) {
        const a = center - span * 0.32 + (k / (count - 1)) * span * 0.64;
        const rad = 58;
        g += pieces.avocado(Math.cos(a) * rad, Math.sin(a) * rad, (a * 180) / Math.PI + 90, r);
      }
    } else {
      // halkalar halinde, çakışmayı azaltan basit ızgara
      const rings = [44, 64, 82];
      let placed = 0;
      for (const ring of rings) {
        const per = Math.max(2, Math.round((ring * span) / 24));
        for (let k = 0; k < per && placed < count; k++) {
          const a = center - span * 0.42 + ((k + 0.5) / per) * span * 0.84 + (r() - 0.5) * 0.08;
          const rr = ring + (r() - 0.5) * 6;
          g += pieces[tp](Math.cos(a) * rr, Math.sin(a) * rr, r() * 90 - 45, r);
          placed++;
        }
      }
    }
    const dx = f(Math.cos(center) * 70), dy = f(Math.sin(center) * 70);
    groups.push(
      animate
        ? `<g class="ing" style="--tx:${dx}px;--ty:${dy}px;--d:${380 + i * 140}ms">${g}</g>`
        : `<g>${g}</g>`,
    );
  });

  // pirinç taneleri (yalnızca orta bölge ve aralar)
  let grains = '';
  for (let k = 0; k < 90; k++) {
    const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * (R - 6);
    grains += `<ellipse cx="${f(Math.cos(a) * rr)}" cy="${f(Math.sin(a) * rr)}" rx="3.2" ry="1.6" transform="rotate(${f(r() * 180)} ${f(Math.cos(a) * rr)} ${f(Math.sin(a) * rr)})" fill="${k % 3 ? C.grain : C.grain2}"/>`;
  }
  // susam
  let sesame = '';
  for (let k = 0; k < 34; k++) {
    const a = r() * Math.PI * 2, rr = 14 + r() * (R - 18);
    const x = f(Math.cos(a) * rr), y = f(Math.sin(a) * rr);
    sesame += `<ellipse cx="${x}" cy="${y}" rx="1.9" ry="1.1" transform="rotate(${f(r() * 180)} ${x} ${y})" fill="${k % 4 === 0 ? C.sesameDark : C.sesame}"/>`;
  }

  const center = `<g${animate ? ' class="ing" style="--tx:0px;--ty:-40px;--d:' + (380 + n * 140) + 'ms"' : ''}>
    <circle r="24" fill="${C.rice}"/>
    <rect x="-14" y="-17" width="7" height="30" rx="2" fill="${C.nori}" transform="rotate(-22)"/>
    <rect x="-2" y="-19" width="7" height="32" rx="2" fill="${C.nori}" transform="rotate(-22)"/>
    <path d="M-30 18 C-15 2 -2 30 12 12 S 34 -6 40 4" stroke="#fff6e6" stroke-width="3.2" fill="none" stroke-linecap="round" opacity=".95"/>
    ${sesame}
  </g>`;

  const sticks = chopsticks
    ? `<g${animate ? ' class="sticks"' : ''}><g transform="rotate(-38) translate(0 -8)"><rect x="-150" y="-128" width="200" height="7" rx="3.5" fill="${C.wood}"/><rect x="-150" y="-128" width="40" height="7" rx="3.5" fill="${C.woodDark}"/><rect x="-148" y="-112" width="200" height="7" rx="3.5" fill="${C.wood}"/><rect x="-148" y="-112" width="40" height="7" rx="3.5" fill="${C.woodDark}"/></g></g>`
    : '';

  return `
  <defs><clipPath id="${idPrefix}-food"><circle r="${R}"/></clipPath></defs>
  <circle r="124" cy="6" fill="${C.ink}" opacity=".10"/>
  <g${animate ? ' class="bowl-base"' : ''}>
    <circle r="122" fill="${C.ink}"/>
    <circle r="112" fill="${C.ink2}"/>
    <path d="M-104 -30 A108 108 0 0 1 -30 -104" stroke="${C.ink3}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle r="${R + 4}" fill="#f6efe2"/>
    <circle r="${R}" fill="${C.rice}"/>
    <g clip-path="url(#${idPrefix}-food)">${grains}</g>
  </g>
  <g clip-path="url(#${idPrefix}-food)">${groups.join('')}</g>
  ${center}
  ${sticks}`;
}

/** Wok kutusu (yandan görünüm). viewBox: 0 0 260 260 */
export function wokSvg(toppings: Topping[], seed = 3) {
  const r = rng(seed);
  let noodles = '';
  for (let k = 0; k < 9; k++) {
    const y = 80 + k * 4 + r() * 3;
    noodles += `<path d="M${58 + r() * 8} ${f(y)} q16 -12 32 0 t32 0 t32 0 t32 0" stroke="${k % 2 ? '#f2c46b' : '#e9b257'}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  }
  let tops = '';
  toppings.forEach((tp, i) => {
    for (let k = 0; k < 3; k++) {
      tops += pieces[tp](72 + ((i * 3 + k) * 37) % 120, 76 + r() * 18, r() * 60 - 30, r);
    }
  });
  return `
  <ellipse cx="130" cy="236" rx="92" ry="10" fill="${C.ink}" opacity=".12"/>
  <g transform="rotate(14 180 60)"><rect x="150" y="10" width="7" height="120" rx="3.5" fill="${C.wood}"/><rect x="164" y="14" width="7" height="118" rx="3.5" fill="${C.woodDark}"/></g>
  <g>${noodles}${tops}</g>
  <path d="M52 110 L208 110 L190 232 L70 232 Z" fill="#fffaf0" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M52 110 L30 74 L92 96 Z" fill="#f6efe2" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M208 110 L230 74 L168 96 Z" fill="#f6efe2" stroke="${C.ink}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M64 150 L196 150 L192 178 L68 178 Z" fill="${C.salmon}"/>
  <path d="M74 164 q10 -8 20 0 t20 0 t20 0 t20 0 t20 0" stroke="#fffaf0" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M118 112 L118 100 Q130 90 142 100 L142 112" stroke="${C.ink}" stroke-width="4" fill="none"/>`;
}

/** Roll tabağı (üstten). viewBox: 0 0 260 260 */
export function rollSvg(toppings: Topping[], seed = 5) {
  const r = rng(seed);
  const fill: Record<string, string> = { salmon: C.salmon, tuna: C.tuna, avocado: C.avo, cucumber: '#9fc46a', mango: C.mango, shrimp: C.shrimp, chicken: C.chicken, tofu: C.tofu, carrot: C.carrot, corn: C.corn, edamame: C.edamame, seaweed: C.seaweed };
  const pos = [[72, 98], [118, 86], [164, 98], [86, 146], [132, 138], [178, 148], [110, 192], [156, 190]];
  let rolls = '';
  pos.forEach(([x, y], i) => {
    const outside = i % 2 === 0;
    rolls += `<g transform="translate(${x} ${y})"><circle r="22" fill="${C.ink}" opacity=".12" cy="3"/>`;
    rolls += outside
      ? `<circle r="21" fill="${C.rice}"/><circle r="13" fill="${C.nori}"/>`
      : `<circle r="21" fill="${C.nori}"/><circle r="18" fill="${C.rice}"/>`;
    const inner = outside ? 11 : 9;
    toppings.forEach((tp, k) => {
      const a0 = (k / toppings.length) * Math.PI * 2 + i, a1 = ((k + 1) / toppings.length) * Math.PI * 2 + i;
      rolls += `<path d="M0 0 L${f(Math.cos(a0) * inner)} ${f(Math.sin(a0) * inner)} A${inner} ${inner} 0 0 1 ${f(Math.cos(a1) * inner)} ${f(Math.sin(a1) * inner)} Z" fill="${fill[tp] ?? C.avo}"/>`;
    });
    if (outside) for (let s = 0; s < 7; s++) { const a = r() * Math.PI * 2, rr = 15 + r() * 4; rolls += `<ellipse cx="${f(Math.cos(a) * rr)}" cy="${f(Math.sin(a) * rr)}" rx="1.6" ry="1" fill="${s % 3 ? C.grain : C.sesameDark}"/>`; }
    rolls += '</g>';
  });
  return `
  <ellipse cx="130" cy="142" rx="118" ry="104" fill="${C.ink}" opacity=".08"/>
  <rect x="22" y="44" width="216" height="184" rx="34" fill="${C.ink}"/>
  <rect x="30" y="52" width="200" height="168" rx="28" fill="${C.ink2}"/>
  ${rolls}
  <path d="M196 196 q10 -14 22 -6 q-4 14 -22 6Z" fill="#f7b7a3"/><path d="M194 206 q12 -6 22 2 q-10 10 -22 -2Z" fill="#f4a088"/>
  <circle cx="52" cy="196" r="9" fill="#9fc46a"/><circle cx="49" cy="193" r="3" fill="#c6e08f"/>`;
}
