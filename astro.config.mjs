// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://kelua.it',
  integrations: [],
  output: 'static',
  
  // Configurazione Vite per proxy Tina CMS
  vite: {
    server: {
      proxy: {
        '/tina-api': {
          target: 'http://localhost:4001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/tina-api/, '')
        }
      }
    }
  },
  
  // Ottimizzazioni per SEO e performance
  build: {
    inlineStylesheets: 'auto',
    assets: 'assets'
  },
  
  // Compressione e ottimizzazione
  compressHTML: true
});
