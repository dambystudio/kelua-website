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
 * @param {string} filename - Nome del file
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
        quality: 85, 
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
        quality: 80, 
        effort: 6 
      })
      .toFile(path.join(outputDir, `${baseName}.avif`));

    // Ottieni le dimensioni dei file per il confronto
    const originalStats = fs.statSync(inputPath);
    const webpStats = fs.statSync(path.join(outputDir, `${baseName}.webp`));
    const avifStats = fs.statSync(path.join(outputDir, `${baseName}.avif`));
    
    const originalSize = (originalStats.size / 1024).toFixed(1);
    const webpSize = (webpStats.size / 1024).toFixed(1);
    const avifSize = (avifStats.size / 1024).toFixed(1);
    
    const webpSaving = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);
    const avifSaving = (((originalStats.size - avifStats.size) / originalStats.size) * 100).toFixed(1);
    
    console.log(`     ✅ ${filename}`);
    console.log(`        📊 Originale: ${originalSize}KB`);
    console.log(`        📊 WebP: ${webpSize}KB (-${webpSaving}%)`);
    console.log(`        📊 AVIF: ${avifSize}KB (-${avifSaving}%)`);
    
    return true;
  } catch (error) {
    console.error(`     ❌ Errore ottimizzando ${filename}: ${error.message}`);
    return false;
  }
}

/**
 * Processa una cartella specifica e ottimizza le immagini
 * @param {string} folderPath - Percorso della cartella da processare
 * @param {string} folderName - Nome della cartella
 */
async function processFolder(folderPath, folderName) {
  console.log(`\n� Processando cartella: ${folderName}`);
  
  // Crea la cartella ottimizzata con il suffisso "_ottimizzate"
  const optimizedFolderName = `${folderName}_ottimizzate`;
  const optimizedFolderPath = path.join(optimizedDir, optimizedFolderName);
  
  if (!fs.existsSync(optimizedFolderPath)) {
    fs.mkdirSync(optimizedFolderPath, { recursive: true });
    console.log(`📂 Creata cartella: optimized/${optimizedFolderName}`);
  }
  
  // Leggi tutti i file nella cartella
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(folderPath, file);
    return ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'].includes(ext) && 
           !fs.statSync(filePath).isDirectory();
  });
  
  if (imageFiles.length === 0) {
    console.log(`   ⚠️  Nessuna immagine trovata in ${folderName}`);
    return 0;
  }
  
  console.log(`   🖼️  Trovate ${imageFiles.length} immagini`);
  
  let processedCount = 0;
  
  for (const imageFile of imageFiles) {
    const inputPath = path.join(folderPath, imageFile);
    const nameWithoutExt = path.parse(imageFile).name;
    
    // Controlla se le versioni ottimizzate esistono già
    const webpPath = path.join(optimizedFolderPath, `${nameWithoutExt}.webp`);
    const avifPath = path.join(optimizedFolderPath, `${nameWithoutExt}.avif`);
    
    if (fs.existsSync(webpPath) && fs.existsSync(avifPath)) {
      console.log(`   ⏭️  ${imageFile} già ottimizzata`);
      continue;
    }
    
    await optimizeImage(inputPath, optimizedFolderPath, imageFile);
    processedCount++;
  }
  
  console.log(`   ✅ Processate ${processedCount} nuove immagini in ${folderName}`);
  return processedCount;
}

/**
 * Ottimizza tutte le immagini nella cartella uploads e nelle sottocartelle
 */
async function optimizeAllImages() {
  console.log('🚀 Inizio ottimizzazione immagini...\n');
  console.log(`� Directory uploads: ${uploadsDir}\n`);
  
  // Processa prima le immagini nella root di uploads
  const rootFiles = fs.readdirSync(uploadsDir);
  const rootImageFiles = rootFiles.filter(file => {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(uploadsDir, file);
    return ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'].includes(ext) && 
           !fs.statSync(filePath).isDirectory();
  });

  let totalProcessed = 0;

  if (rootImageFiles.length > 0) {
    console.log(`📸 Trovate ${rootImageFiles.length} immagini nella cartella principale:\n`);

    for (const file of rootImageFiles) {
      const inputPath = path.join(uploadsDir, file);
      const nameWithoutExt = path.parse(file).name;
      
      // Controlla se le versioni ottimizzate esistono già
      const webpPath = path.join(optimizedDir, `${nameWithoutExt}.webp`);
      const avifPath = path.join(optimizedDir, `${nameWithoutExt}.avif`);
      
      if (fs.existsSync(webpPath) && fs.existsSync(avifPath)) {
        console.log(`⏭️  ${file} già ottimizzata`);
        continue;
      }
      
      await optimizeImage(inputPath, optimizedDir, file);
      totalProcessed++;
      console.log(''); // Riga vuota per separare
    }
  }

  // Processa tutte le sottocartelle
  const folders = rootFiles.filter(item => {
    const itemPath = path.join(uploadsDir, item);
    return fs.statSync(itemPath).isDirectory() && item !== 'optimized';
  });
  
  if (folders.length > 0) {
    console.log(`\n📁 Trovate ${folders.length} sottocartelle da processare:`);
    
    for (const folder of folders) {
      const folderPath = path.join(uploadsDir, folder);
      const processed = await processFolder(folderPath, folder);
      totalProcessed += processed;
    }
  }

  if (totalProcessed === 0 && rootImageFiles.length === 0 && folders.length === 0) {
    console.log('📂 Nessuna immagine trovata da ottimizzare.');
    console.log('💡 Aggiungi immagini in /uploads/ o crea sottocartelle come /uploads/Foto_maglie/');
    return;
  }

  console.log(`\n✨ Ottimizzazione completata! Processate ${totalProcessed} nuove immagini.`);
  console.log(`📁 Le immagini ottimizzate si trovano in: ${optimizedDir}`);
}

// Esegui se chiamato direttamente
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  optimizeAllImages().catch(console.error);
}

export { optimizeImage, optimizeAllImages };
