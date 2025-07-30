import fs from 'fs';
import path from 'path';

const uploadsDir = path.resolve('public/uploads');
const optimizedDir = path.join(uploadsDir, 'optimized');

/**
 * Verifica lo stato del sistema di ottimizzazione
 */
function checkOptimizationStatus() {
  console.log('🔍 Verifica sistema di ottimizzazione immagini\n');
  
  // Verifica esistenza cartelle
  const uploadsExists = fs.existsSync(uploadsDir);
  const optimizedExists = fs.existsSync(optimizedDir);
  
  console.log(`📁 Cartella uploads: ${uploadsExists ? '✅ Esistente' : '❌ Mancante'}`);
  console.log(`📁 Cartella optimized: ${optimizedExists ? '✅ Esistente' : '❌ Mancante'}`);
  
  if (!uploadsExists) {
    console.log('❌ Cartella uploads non trovata!');
    return;
  }
  
  // Conta file originali
  const originalFiles = fs.readdirSync(uploadsDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    const filePath = path.join(uploadsDir, file);
    return ['.jpg', '.jpeg', '.png'].includes(ext) && 
           !fs.statSync(filePath).isDirectory();
  });
  
  console.log(`\n📊 File originali trovati: ${originalFiles.length}`);
  
  if (!optimizedExists) {
    console.log('📂 Cartella optimized non esiste ancora. Verrà creata al primo utilizzo.');
    return;
  }
  
  // Conta file ottimizzati
  const optimizedFiles = fs.readdirSync(optimizedDir);
  const webpFiles = optimizedFiles.filter(f => f.endsWith('.webp')).length;
  const avifFiles = optimizedFiles.filter(f => f.endsWith('.avif')).length;
  const jpegFiles = optimizedFiles.filter(f => f.endsWith('.jpg')).length;
  
  console.log(`\n🎯 File ottimizzati:`);
  console.log(`   WebP: ${webpFiles}`);
  console.log(`   AVIF: ${avifFiles}`);
  console.log(`   JPEG: ${jpegFiles}`);
  
  // Calcola risparmio spazio
  if (originalFiles.length > 0 && optimizedFiles.length > 0) {
    let originalSize = 0;
    let optimizedSize = 0;
    
    originalFiles.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      originalSize += fs.statSync(filePath).size;
    });
    
    optimizedFiles.filter(f => f.endsWith('.webp')).forEach(file => {
      const filePath = path.join(optimizedDir, file);
      optimizedSize += fs.statSync(filePath).size;
    });
    
    const savings = ((originalSize - optimizedSize) / originalSize * 100);
    
    console.log(`\n💾 Risparmio spazio:`);
    console.log(`   Originali: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Ottimizzate (WebP): ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Risparmio: ${savings.toFixed(1)}%`);
  }
  
  console.log(`\n🚀 Sistema pronto!`);
  console.log(`💡 Comandi disponibili:`);
  console.log(`   npm run optimize:images    - Ottimizza tutte le immagini`);
  console.log(`   npm run watch:images       - Monitoraggio automatico`);
  console.log(`   npm run dev:with-optimizer - Dev con ottimizzazione automatica`);
}

// Esegui se chiamato direttamente
const isMainModule = process.argv[1] === path.resolve(process.argv[1]);
if (isMainModule) {
  checkOptimizationStatus();
}

export { checkOptimizationStatus };
