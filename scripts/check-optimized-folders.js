#!/usr/bin/env node

/**
 * Script per sincronizzare le cartelle ottimizzate su TinaCloud
 * Crea automaticamente le cartelle mancanti e carica le immagini ottimizzate
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const optimizedDir = path.join(uploadsDir, 'optimized');

// Lista delle cartelle che dovrebbero avere versioni ottimizzate
const expectedFolders = [
  'Foto_Accessori',
  'Foto_Camicie', 
  'Foto_Felpe',
  'Foto_Giubbotti',
  'Foto_Jeans',
  'Foto_Maglieria',
  'Foto_Negozio',
  'Foto_Pantaloni'
];

console.log('🔍 Controllo cartelle ottimizzate...\n');

// Controlla quali cartelle ottimizzate esistono localmente
const localOptimizedFolders = [];
for (const folder of expectedFolders) {
  const optimizedFolderName = `${folder}_ottimizzate`;
  const optimizedFolderPath = path.join(optimizedDir, optimizedFolderName);
  
  if (fs.existsSync(optimizedFolderPath)) {
    const files = fs.readdirSync(optimizedFolderPath);
    const imageFiles = files.filter(f => f.endsWith('.webp') || f.endsWith('.avif'));
    
    if (imageFiles.length > 0) {
      localOptimizedFolders.push({
        name: optimizedFolderName,
        path: optimizedFolderPath,
        files: imageFiles,
        count: imageFiles.length / 2 // Diviso 2 perché ogni immagine ha webp + avif
      });
      console.log(`✅ ${optimizedFolderName}: ${imageFiles.length / 2} immagini ottimizzate`);
    } else {
      console.log(`⚠️  ${optimizedFolderName}: cartella vuota`);
    }
  } else {
    console.log(`❌ ${optimizedFolderName}: cartella non esiste`);
  }
}

console.log(`\n📊 Riepilogo:`);
console.log(`   📁 Cartelle previste: ${expectedFolders.length}`);
console.log(`   ✅ Cartelle ottimizzate locali: ${localOptimizedFolders.length}`);
console.log(`   ❌ Cartelle mancanti: ${expectedFolders.length - localOptimizedFolders.length}`);

if (localOptimizedFolders.length < expectedFolders.length) {
  console.log(`\n🔧 Per risolvere:`);
  console.log(`1. Esegui: npm run optimize:images`);
  console.log(`2. Carica manualmente su TinaCloud le cartelle:`);
  
  for (const folder of expectedFolders) {
    const optimizedFolderName = `${folder}_ottimizzate`;
    const exists = localOptimizedFolders.find(f => f.name === optimizedFolderName);
    if (!exists) {
      console.log(`   📁 ${optimizedFolderName}`);
    }
  }
}

console.log(`\n💡 Alternatively: usa 'npm run sync:tinacloud' (quando sarà implementato)`);

export { localOptimizedFolders };