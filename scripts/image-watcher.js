import { optimizeImage } from './optimize-images.js';
import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

const uploadsDir = path.resolve('public/uploads');
const optimizedDir = path.join(uploadsDir, 'optimized');

// Assicurati che la cartella optimized esista
if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

/**
 * Watcher per l'ottimizzazione automatica delle nuove immagini
 */
function startImageWatcher() {
  console.log('👀 Avvio monitoraggio cartella uploads...');
  console.log(`📂 Cartella monitorata: ${uploadsDir}`);
  console.log(`💾 Immagini ottimizzate salvate in: ${optimizedDir}`);
  
  const watcher = chokidar.watch(uploadsDir, {
    ignored: [
      /optimized/, // Ignora la cartella optimized
      /\.(webp|avif)$/, // Ignora i file già ottimizzati
      /.*\.(mov|mp4|avi|mkv)$/ // Ignora i video
    ],
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  });

  watcher.on('add', async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const fileName = path.basename(filePath);
      console.log(`\n📸 Nuova immagine rilevata: ${fileName}`);
      console.log(`📊 Dimensione originale: ${(fs.statSync(filePath).size / 1024 / 1024).toFixed(2)} MB`);
      
      // Aspetta un po' per assicurarsi che il file sia completamente scritto
      setTimeout(async () => {
        try {
          console.log(`🔄 Inizio ottimizzazione di: ${fileName}`);
          await optimizeImage(filePath, optimizedDir, fileName);
          console.log(`✅ Ottimizzazione automatica completata per: ${fileName}`);
          console.log(`📁 File disponibili in: /uploads/optimized/`);
          console.log(`🌐 I browser utilizzeranno automaticamente il formato migliore supportato\n`);
        } catch (error) {
          console.error(`❌ Errore durante l'ottimizzazione automatica di ${fileName}:`, error.message);
        }
      }, 1000);
    }
  });

  watcher.on('change', async (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      const fileName = path.basename(filePath);
      console.log(`\n🔄 Immagine modificata: ${fileName}`);
      
      setTimeout(async () => {
        try {
          console.log(`🔄 Ri-ottimizzazione di: ${fileName}`);
          await optimizeImage(filePath, optimizedDir, fileName);
          console.log(`✅ Ri-ottimizzazione completata per: ${fileName}\n`);
        } catch (error) {
          console.error(`❌ Errore durante la ri-ottimizzazione di ${fileName}:`, error.message);
        }
      }, 1000);
    }
  });

  watcher.on('ready', () => {
    console.log('✅ Monitoraggio attivo. Le nuove immagini verranno ottimizzate automaticamente.');
    console.log('📋 Formati supportati: JPG, JPEG, PNG');
    console.log('🎯 Formati di output: AVIF, WebP, JPEG ottimizzato');
    console.log('💡 Tip: Usa Ctrl+C per fermare il monitoraggio\n');
  });

  watcher.on('error', error => {
    console.error('❌ Errore nel watcher:', error);
  });

  return watcher;
}

// Avvia il watcher se il modulo viene eseguito direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  startImageWatcher();
  
  // Mantieni il processo attivo
  process.on('SIGINT', () => {
    console.log('\n👋 Arresto monitoraggio...');
    process.exit(0);
  });
}

export { startImageWatcher };
