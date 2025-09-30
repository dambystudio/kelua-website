import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

/**
 * Plugin TinaCMS per ottimizzazione automatica immagini
 * Si attiva quando vengono caricate nuove immagini tramite il Media Manager
 */
export const imageOptimizationPlugin = {
  name: 'image-optimization',
  
  // Hook che si attiva dopo il caricamento di un file media
  async onUpload(file, context) {
    // Controlla se è un'immagine
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];
    const fileExtension = path.extname(file.filename).toLowerCase();
    
    if (!imageExtensions.includes(fileExtension)) {
      console.log(`⏭️ File ${file.filename} non è un'immagine, skip ottimizzazione`);
      return;
    }
    
    console.log(`🖼️ Nuova immagine caricata: ${file.filename}`);
    console.log(`📁 Percorso: ${file.path}`);
    
    try {
      // Esegui l'ottimizzazione solo per questa immagine specifica
      const imagePath = path.join(process.cwd(), 'public', file.path);
      console.log(`🔄 Avvio ottimizzazione per: ${imagePath}`);
      
      // Usa lo script di ottimizzazione esistente
      const { stdout, stderr } = await execAsync(`node scripts/optimize-images.js "${imagePath}"`);
      
      if (stdout) {
        console.log('✅ Ottimizzazione completata:', stdout);
      }
      if (stderr) {
        console.warn('⚠️ Warning durante ottimizzazione:', stderr);
      }
      
    } catch (error) {
      console.error('❌ Errore durante ottimizzazione automatica:', error.message);
      // Non bloccare il caricamento del file se l'ottimizzazione fallisce
    }
  },
  
  // Hook per quando un file viene eliminato
  async onDelete(file, context) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];
    const fileExtension = path.extname(file.filename).toLowerCase();
    
    if (!imageExtensions.includes(fileExtension)) {
      return;
    }
    
    console.log(`🗑️ Immagine eliminata: ${file.filename}`);
    
    try {
      // Elimina anche le versioni ottimizzate
      const baseName = path.parse(file.filename).name;
      const dirName = path.dirname(file.path);
      
      let optimizedDir;
      if (dirName === 'uploads') {
        optimizedDir = 'uploads/optimized';
      } else {
        const folderName = path.basename(dirName);
        optimizedDir = `uploads/optimized/${folderName}_ottimizzate`;
      }
      
      const webpPath = path.join(process.cwd(), 'public', optimizedDir, `${baseName}.webp`);
      const avifPath = path.join(process.cwd(), 'public', optimizedDir, `${baseName}.avif`);
      
      // Elimina i file ottimizzati (se esistono)
      await execAsync(`rm -f "${webpPath}" "${avifPath}"`).catch(() => {
        // Ignora errori se i file non esistono
      });
      
      console.log(`🗑️ Versioni ottimizzate eliminate per: ${file.filename}`);
      
    } catch (error) {
      console.error('❌ Errore eliminando versioni ottimizzate:', error.message);
    }
  }
};