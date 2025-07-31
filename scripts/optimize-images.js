import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const optimizedDir = path.join(uploadsDir, 'optimized');

// Crea la cartella optimized se non esiste
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

/**
 * Ottimizza un'immagine convertendola in WebP e AVIF
 * @param {string} inputPath - Percorso dell'immagine originale
 * @param {string} outputDir - Directory di output
 * @param {string} filename - Nome del file senza estensione
 */
async function optimizeImage(inputPath, outputDir, filename) {
  const baseName = path.parse(filename).name;
  
  try {
    // Ottimizza in WebP (formato principale)
    await sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .webp({ 
        quality: 80, 
        effort: 6 
      })
      .toFile(path.join(outputDir, `${baseName}.webp`));

    // Ottimizza in AVIF (formato più moderno)
    await sharp(inputPath)
      .resize(1920, 1080, { 
        fit: 'inside', 
        withoutEnlargement: true 
      })
      .avif({ 
        quality: 70, 
        effort: 6 
      })
      .toFile(path.join(outputDir, `${baseName}.avif`));

    console.log(`✅ Ottimizzata: ${filename}`);
    
    // Ottieni le dimensioni dei file per il confronto
    const originalSize = fs.statSync(inputPath).size;
    const webpSize = fs.statSync(path.join(outputDir, `${baseName}.webp`)).size;
    const avifSize = fs.statSync(path.join(outputDir, `${baseName}.avif`)).size;
    
    console.log(`   Originale: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   WebP: ${(webpSize / 1024 / 1024).toFixed(2)} MB (${((1 - webpSize/originalSize) * 100).toFixed(1)}% riduzione)`);
    console.log(`   AVIF: ${(avifSize / 1024 / 1024).toFixed(2)} MB (${((1 - avifSize/originalSize) * 100).toFixed(1)}% riduzione)`);
    
  } catch (error) {
    console.error(`❌ Errore ottimizzando ${filename}:`, error.message);
  }
}

/**
 * Ottimizza tutte le immagini nella cartella uploads
 */
async function optimizeAllImages() {
  console.log('🔄 Inizio ottimizzazione immagini...\n');
  
  const files = fs.readdirSync(uploadsDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png'].includes(ext) && 
           !fs.statSync(path.join(uploadsDir, file)).isDirectory();
  });

  if (imageFiles.length === 0) {
    console.log('📂 Nessuna immagine trovata da ottimizzare.');
    return;
  }

  console.log(`📸 Trovate ${imageFiles.length} immagini da ottimizzare:\n`);

  for (const file of imageFiles) {
    const inputPath = path.join(uploadsDir, file);
    await optimizeImage(inputPath, optimizedDir, file);
    console.log(''); // Riga vuota per separare
  }

  console.log('✨ Ottimizzazione completata!');
  console.log(`📁 Le immagini ottimizzate si trovano in: ${optimizedDir}`);
}

// Esegui se chiamato direttamente
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  optimizeAllImages().catch(console.error);
}

export { optimizeImage, optimizeAllImages };
