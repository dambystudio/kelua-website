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
 * Sanitizza il nome di un file rimuovendo spazi e caratteri speciali
 * @param {string} filename - Nome del file originale
 * @returns {string} - Nome del file sanitizzato
 */
function sanitizeFilename(filename) {
  const parsedPath = path.parse(filename);
  const sanitizedName = parsedPath.name
    .replace(/\s+/g, '-')           // Sostituisce spazi con trattini
    .replace(/[àáâäãå]/g, 'a')      // Sostituisce caratteri accentati
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôöõø]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[^\w\-_.]/g, '')      // Rimuove tutti i caratteri non alfanumerici eccetto - _ .
    .replace(/[-_]+/g, '-')         // Sostituisce multipli - o _ con un singolo -
    .replace(/^-+|-+$/g, '');       // Rimuove - all'inizio e alla fine
  
  return sanitizedName + parsedPath.ext.toLowerCase();
}

/**
 * Rinomina un file se contiene spazi o caratteri speciali
 * @param {string} filePath - Percorso completo del file
 * @returns {string} - Nuovo percorso del file (se rinominato)
 */
function renameFileIfNeeded(filePath) {
  const dir = path.dirname(filePath);
  const originalName = path.basename(filePath);
  const sanitizedName = sanitizeFilename(originalName);
  
  if (originalName !== sanitizedName) {
    const newPath = path.join(dir, sanitizedName);
    console.log(`   🔄 Rinomino: ${originalName} → ${sanitizedName}`);
    
    try {
      fs.renameSync(filePath, newPath);
      return newPath;
    } catch (error) {
      console.log(`   ⚠️  Errore nel rinominare ${originalName}: ${error.message}`);
      return filePath; // Ritorna il percorso originale se il rinominio fallisce
    }
  }
  
  return filePath;
}

/**
 * Ottimizza un'immagine convertendola in WebP e AVIF
 * @param {string} inputPath - Percorso dell'immagine originale
 * @param {string} outputDir - Directory di output
 * @param {string} filename - Nome del file
 */
async function optimizeImage(inputPath, outputDir, filename) {
  // Sanitizza il nome del file prima dell'ottimizzazione
  const sanitizedInputPath = renameFileIfNeeded(inputPath);
  const sanitizedFilename = path.basename(sanitizedInputPath);
  const baseName = path.parse(sanitizedFilename).name;
  
  try {
    // Ottimizza in WebP (formato principale)
    await sharp(sanitizedInputPath)
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
    await sharp(sanitizedInputPath)
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
    const originalStats = fs.statSync(sanitizedInputPath);
    const webpStats = fs.statSync(path.join(outputDir, `${baseName}.webp`));
    const avifStats = fs.statSync(path.join(outputDir, `${baseName}.avif`));
    
    const originalSize = (originalStats.size / 1024).toFixed(1);
    const webpSize = (webpStats.size / 1024).toFixed(1);
    const avifSize = (avifStats.size / 1024).toFixed(1);
    
    const webpSaving = (((originalStats.size - webpStats.size) / originalStats.size) * 100).toFixed(1);
    const avifSaving = (((originalStats.size - avifStats.size) / originalStats.size) * 100).toFixed(1);
    
    console.log(`     ✅ ${sanitizedFilename}`);
    console.log(`        📊 Originale: ${originalSize}KB`);
    console.log(`        📊 WebP: ${webpSize}KB (-${webpSaving}%)`);
    console.log(`        📊 AVIF: ${avifSize}KB (-${avifSaving}%)`);
    
    return { original: originalSize, webp: webpSize, avif: avifSize, sanitizedFilename };
    
  } catch (error) {
    console.error(`❌ Errore nell'ottimizzazione di ${sanitizedFilename}:`, error.message);
    throw error;
  }
}

/**
 * Verifica se un'immagine è già stata ottimizzata
 * @param {string} filename - Nome del file originale
 * @param {string} outputDir - Directory di output
 * @returns {boolean} - true se l'immagine è già ottimizzata
 */
function isAlreadyOptimized(filename, outputDir) {
  const baseName = path.parse(filename).name;
  const webpPath = path.join(outputDir, `${baseName}.webp`);
  const avifPath = path.join(outputDir, `${baseName}.avif`);
  
  return fs.existsSync(webpPath) && fs.existsSync(avifPath);
}

/**
 * Processa tutte le immagini in una directory
 * @param {string} sourceDir - Directory sorgente
 * @param {string} outputDir - Directory di output
 * @param {string} folderName - Nome della cartella (per il log)
 * @returns {number} - Numero di immagini processate
 */
async function processImagesInDirectory(sourceDir, outputDir, folderName = '') {
  const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'];
  let processedCount = 0;
  
  try {
    const files = fs.readdirSync(sourceDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return supportedExtensions.includes(ext);
    });
    
    if (folderName) {
      console.log(`\n📁 Processando cartella: ${folderName}`);
      console.log(`   🖼️  Trovate ${imageFiles.length} immagini`);
    } else {
      console.log(`📸 Trovate ${imageFiles.length} immagini nella cartella principale:\n`);
    }
    
    for (const file of imageFiles) {
      const inputPath = path.join(sourceDir, file);
      
      if (isAlreadyOptimized(file, outputDir)) {
        console.log(`   ⏭️  ${file} già ottimizzata`);
      } else {
        await optimizeImage(inputPath, outputDir, file);
        processedCount++;
      }
    }
    
    if (folderName) {
      console.log(`   ✅ Processate ${processedCount} nuove immagini in ${folderName}`);
    }
    
  } catch (error) {
    console.error(`❌ Errore nel processare la directory ${sourceDir}:`, error.message);
  }
  
  return processedCount;
}

/**
 * Funzione principale
 */
async function main() {
  console.log('🚀 Inizio ottimizzazione immagini...\n');
  
  console.log(`📁 Directory uploads: ${uploadsDir}`);
  
  let totalProcessed = 0;
  
  // Processa le immagini nella cartella principale uploads
  totalProcessed += await processImagesInDirectory(uploadsDir, optimizedDir);
  
  // Trova e processa tutte le sottocartelle
  try {
    const items = fs.readdirSync(uploadsDir, { withFileTypes: true });
    const subfolders = items
      .filter(item => item.isDirectory() && item.name !== 'optimized')
      .map(item => item.name);
    
    if (subfolders.length > 0) {
      console.log(`\n📁 Trovate ${subfolders.length} sottocartelle da processare:`);
      
      for (const folder of subfolders) {
        const subfolderPath = path.join(uploadsDir, folder);
        const subfolderOptimizedPath = path.join(optimizedDir, `${folder}_ottimizzate`);
        
        // Crea la cartella di output specifica per questa sottocartella
        if (!fs.existsSync(subfolderOptimizedPath)) {
          fs.mkdirSync(subfolderOptimizedPath, { recursive: true });
        }
        
        totalProcessed += await processImagesInDirectory(subfolderPath, subfolderOptimizedPath, folder);
      }
    }
    
  } catch (error) {
    console.error('❌ Errore nel leggere le sottocartelle:', error.message);
  }
  
  console.log(`\n✨ Ottimizzazione completata! Processate ${totalProcessed} nuove immagini.`);
  console.log(`📁 Le immagini ottimizzate si trovano in: ${optimizedDir}`);
}

// Esegui lo script
main().catch(error => {
  console.error('💥 Errore fatale:', error);
  process.exit(1);
});