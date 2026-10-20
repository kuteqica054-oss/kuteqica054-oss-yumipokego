// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import site from './src/config/site.json' with { type: 'json' };

export default defineConfig({
  site: process.env.SITE_URL || site.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  vite: { plugins: [tailwindcss()] },
});
