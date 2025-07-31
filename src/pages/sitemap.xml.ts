import { getCollection } from 'astro:content';

// Definisci le pagine statiche del sito
const staticPages = [
  '',
  'collezioni',
  'saldi',
  'collezioni/abiti-cerimonia',
  'collezioni/sportswear',
  'collezioni/jeans',
  'collezioni/camicie',
  'collezioni/pantaloni',
  'collezioni/maglie',
  'collezioni/felpe',
  'collezioni/giubbotti',
  'collezioni/accessori',
];

export async function GET() {
  // Ottieni i contenuti dinamici (se necessario)
  try {
    const abitiCerimonia = await getCollection('galleria-abiti-cerimonia');
    const prodottiSaldi = await getCollection('prodotti-saldi');
    
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Aggiungi le pagine statiche
    staticPages.forEach(page => {
      const url = page === '' ? 'https://keluamoda.it/' : `https://keluamoda.it/${page}`;
      const priority = page === '' ? '1.0' : 
                      page === 'collezioni' ? '0.9' :
                      page === 'saldi' ? '0.8' :
                      page.includes('collezioni/') ? '0.7' : '0.6';
      const changefreq = page === 'saldi' ? 'daily' : 'weekly';
      
      sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Errore nella generazione della sitemap:', error);
    
    // Fallback a sitemap statica in caso di errore
    const currentDate = new Date().toISOString().split('T')[0];
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    staticPages.forEach(page => {
      const url = page === '' ? 'https://keluamoda.it/' : `https://keluamoda.it/${page}`;
      const priority = page === '' ? '1.0' : 
                      page === 'collezioni' ? '0.9' :
                      page === 'saldi' ? '0.8' :
                      page.includes('collezioni/') ? '0.7' : '0.6';
      const changefreq = page === 'saldi' ? 'daily' : 'weekly';
      
      sitemap += `
  <url>
    <loc>${url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
}
