import TinaCMSImageOptimizer from './lib/TinaCMSImageOptimizer.js';

async function reOptimizeFelpe() {
  const optimizer = new TinaCMSImageOptimizer();
  console.log('🔄 Re-ottimizzando Foto_Felpe...');
  
  const files = [
    '8a9da66e-cc32-44a3-bf2f-987975704a2d.jpeg',
    'FelpaDS2Bianca.jpg', 
    'FelpaDS2BiancoNera.jpg',
    'FelpaDS2Nera.jpg',
    'FelpaDS2NeraRossaCappuccio.jpg',
    'FelpaDS2NeroRossa.jpg',
    'FelpaDS2RossoNera.jpg',
    'FelpaGuessBianca.jpg',
    'FelpaGuessBiancaCappuccio.jpg',
    'FelpaGuessNera.jpg',
    'felpaGuessNeraCappuccio.jpg',
    'IMG-3622.jpeg',
    'PantaloneDS2Nero.jpg'
  ];
  
  for (const file of files) {
    const path = `/uploads/Foto_Felpe/${file}`;
    console.log(`  🔄 ${file}`);
    await optimizer.optimizeImage(path);
  }
  
  console.log('✅ Done!');
}

reOptimizeFelpe();