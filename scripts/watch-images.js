#!/usr/bin/env node

/**
 * 🔍 File Watcher per Ottimizzazione Automatica Immagini
 * 
 * Monitora la cartella /uploads/ e ottimizza automaticamente
 * ogni nuova immagine caricata tramite TinaCMS
 * 
 * Uso: npm run watch:images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { optimizeImage } from './optimize-images.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const optimizedDir = path.join(uploadsDir, 'optimized');

// Colori per output console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.reset) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`);
}

/**
 * Controlla se un'immagine è già ottimizzata
 * @param {string} imagePath - Percorso dell'immagine originale
 * @returns {boolean}
 */
function isImageOptimized(imagePath) {
  const relativePath = path.relative(uploadsDir, imagePath);
  const dir = path.dirname(relativePath);
  const baseName = path.parse(path.basename(relativePath)).name;
  
  let optimizedFolderPath;
  if (dir === '.') {
    // Immagine nella root di uploads
    optimizedFolderPath = optimizedDir;
  } else {
    // Immagine in una sottocartella
    optimizedFolderPath = path.join(optimizedDir, `${dir}_ottimizzate`);
  }
  
  const webpPath = path.join(optimizedFolderPath, `${baseName}.webp`);
  const avifPath = path.join(optimizedFolderPath, `${baseName}.avif`);
  
  return fs.existsSync(webpPath) && fs.existsSync(avifPath);
}

/**
 * Ottimizza una nuova immagine
 * @param {string} imagePath - Percorso dell'immagine da ottimizzare
 */
async function processNewImage(imagePath) {
  const relativePath = path.relative(uploadsDir, imagePath);
  const dir = path.dirname(relativePath);
  const filename = path.basename(relativePath);
  
  log(`🖼️ Nuova immagine rilevata: ${relativePath}`, colors.cyan);
  
  let outputDir;
  if (dir === '.') {
    // Immagine nella root di uploads
    outputDir = optimizedDir;
  } else {
    // Immagine in una sottocartella
    const optimizedFolderName = `${dir}_ottimizzate`;
    outputDir = path.join(optimizedDir, optimizedFolderName);
    
    // Crea la cartella ottimizzata se non esiste
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      log(`📂 Creata cartella: optimized/${optimizedFolderName}`, colors.yellow);
    }
  }
  
  try {
    const success = await optimizeImage(imagePath, outputDir, filename);
    if (success) {
      log(`✅ Ottimizzazione completata per: ${filename}`, colors.green);
    }
  } catch (error) {
    log(`❌ Errore ottimizzando ${filename}: ${error.message}`, colors.red);
  }
}

/**
 * Scansiona ricorsivamente una directory per trovare immagini
 * @param {string} dir - Directory da scansionare
 * @param {function} callback - Callback per ogni immagine trovata
 */
function scanDirectory(dir, callback) {
  try {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && item !== 'optimized') {
        // Scansiona ricorsivamente le sottocartelle
        scanDirectory(itemPath, callback);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.tiff', '.bmp'].includes(ext)) {
          callback(itemPath);
        }
      }
    }
  } catch (error) {
    log(`❌ Errore scansionando ${dir}: ${error.message}`, colors.red);
  }
}

/**
 * Avvia il monitoraggio dei file
 */
function startWatching() {
  log('🚀 Avvio monitoraggio automatico immagini...', colors.bright + colors.green);
  log(`📍 Monitorando: ${uploadsDir}`, colors.cyan);
  log('💡 Carica immagini tramite TinaCMS - saranno ottimizzate automaticamente!', colors.yellow);
  log('⏹️  Premi Ctrl+C per fermare il monitoraggio\n', colors.magenta);
  
  // Assicurati che la cartella optimized esista
  if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
  }
  
  // Controlla rapidamente se ci sono immagini non ottimizzate (senza processarle)
  log('🔍 Controllo rapido immagini esistenti...', colors.cyan);
  let unoptimizedCount = 0;
  scanDirectory(uploadsDir, (imagePath) => {
    if (!isImageOptimized(imagePath)) {
      unoptimizedCount++;
    }
  });
  
  if (unoptimizedCount > 0) {
    log(`⚠️  Trovate ${unoptimizedCount} immagini non ottimizzate`, colors.yellow);
    log(`💡 Esegui 'npm run optimize:images' per ottimizzare le immagini esistenti`, colors.cyan);
  } else {
    log('✅ Tutte le immagini esistenti sono già ottimizzate', colors.green);
  }
  
  // Monitora nuove modifiche
  const watcher = fs.watch(uploadsDir, { recursive: true }, async (eventType, filename) => {
    if (!filename) return;
    
    const fullPath = path.join(uploadsDir, filename);
    
    // Ignora la cartella optimized
    if (filename.includes('optimized')) return;
    
    // Controlla se è un'immagine
    const ext = path.extname(filename).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.tiff', '.bmp'].includes(ext)) return;
    
    // Aspetta un po' per assicurarsi che il file sia completamente scritto
    setTimeout(async () => {
      try {
        if (fs.existsSync(fullPath) && !isImageOptimized(fullPath)) {
          await processNewImage(fullPath);
        }
      } catch (error) {
        // Ignora errori temporanei durante il caricamento del file
      }
    }, 1000);
  });
  
  // Gestisci chiusura pulita
  process.on('SIGINT', () => {
    log('\n🛑 Arresto monitoraggio...', colors.yellow);
    watcher.close();
    log('👋 Monitoraggio fermato', colors.green);
    process.exit(0);
  });
}

// Esegui se chiamato direttamente
const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);
if (isMainModule) {
  startWatching();
}

export { startWatching };