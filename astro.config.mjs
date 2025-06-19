// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kelua.it',
  integrations: [],
  output: 'static',
  
  // Ottimizzazioni per SEO e performance
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  
  // Compressione e ottimizzazione
  compressHTML: true
});
