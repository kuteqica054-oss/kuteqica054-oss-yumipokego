// Generates src/data/turkey-map.json (SVG outline of Türkiye + Mercator projection params).
// Run once with `npm run map` (needs devDependencies). The output is committed, so builds don't need it.
import { readFileSync, writeFileSync } from 'node:fs';
import { feature } from 'topojson-client';
import { geoMercator, geoPath } from 'd3-geo';

const topo = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-50m.json', import.meta.url)));
const countries = feature(topo, topo.objects.countries);
const tr = countries.features.find((f) => f.id === '792');
const W = 1000, H = 440, PAD = 12;
const projection = geoMercator().fitExtent([[PAD, PAD], [W - PAD, H - PAD]], tr);
const path = geoPath(projection).digits(1);
const out = {
  viewBox: `0 0 ${W} ${H}`,
  width: W, height: H,
  scale: projection.scale(),
  translate: projection.translate(),
  path: path(tr),
};
writeFileSync(new URL('../src/data/turkey-map.json', import.meta.url), JSON.stringify(out));
console.log('turkey-map.json written', out.path.length, 'chars');
