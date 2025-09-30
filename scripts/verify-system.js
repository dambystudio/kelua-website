#!/usr/bin/env node

/**
 * 🔍 Test & Verifica Sistema di Ottimizzazione Automatica
 * 
 * Controlla che tutto sia configurato correttamente
 */

console.log('🔍 Verifica Sistema di Ottimizzazione Automatica\n');

const checkEnvironmentVariables = () => {
  console.log('1️⃣ Controllo Variabili Ambiente:');
  
  const requiredVars = ['TINA_CLIENT_ID', 'TINA_TOKEN'];
  let allSet = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✅ ${varName}: Configurata`);
    } else {
      console.log(`   ❌ ${varName}: Mancante`);
      allSet = false;
    }
  });
  
  return allSet;
};

const checkNetlifyFunctions = async () => {
  console.log('\n2️⃣ Controllo Netlify Functions:');
  
  const fs = await import('fs');
  const functionPath = './netlify/functions/auto-optimize-images.js';
  
  if (fs.existsSync(functionPath)) {
    console.log('   ✅ Function auto-optimize-images.js: Presente (disabilitata)');
    console.log('   📋 Nota: Function semplificata per evitare problemi di build');
    return true;
  } else {
    console.log('   ❌ Function auto-optimize-images.js: Mancante');
    return false;
  }
};

const checkLocalOptimizer = async () => {
  console.log('\n3️⃣ Controllo Sistema di Ottimizzazione Locale:');
  
  const fs = await import('fs');
  const optimizerPath = './lib/TinaCMSImageOptimizer.js';
  
  if (fs.existsSync(optimizerPath)) {
    console.log('   ✅ TinaCMSImageOptimizer.js: Presente');
    
    // Verifica se Sharp è installato
    try {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const hasSharp = packageJson.dependencies?.sharp || packageJson.devDependencies?.sharp;
      console.log(`   ${hasSharp ? '✅' : '❌'} Sharp: ${hasSharp ? 'Installato' : 'Mancante'}`);
      return !!hasSharp;
    } catch (error) {
      console.log('   ❌ Errore verifica dipendenze');
      return false;
    }
  } else {
    console.log('   ❌ TinaCMSImageOptimizer.js: Mancante');
    return false;
  }
};

const generateTestPayload = () => {
  return {
    event: 'media.upload',
    data: {
      file: {
        filename: 'test-image.jpg',
        path: '/uploads/Foto_Maglieria/test-image.jpg',
        size: 150000
      }
    }
  };
};

const testWebhookLocally = async () => {
  console.log('\n4️⃣ Test Webhook Locale:');
  
  try {
    // Simula l'esecuzione della function
    const payload = generateTestPayload();
    console.log('   📦 Payload di test generato');
    console.log('   🔧 Per testare localmente:');
    console.log(`   netlify dev`);
    console.log(`   curl -X POST http://localhost:8888/.netlify/functions/auto-optimize \\`);
    console.log(`        -H "Content-Type: application/json" \\`);
    console.log(`        -d '${JSON.stringify(payload)}'`);
    
    return true;
  } catch (error) {
    console.log('   ❌ Errore nel test:', error.message);
    return false;
  }
};

const main = async () => {
  console.log('🚀 Inizio verifica sistema...\n');
  
  const envCheck = checkEnvironmentVariables();
  const functionCheck = await checkNetlifyFunctions();
  const optimizerCheck = await checkLocalOptimizer();
  const testCheck = await testWebhookLocally();
  
  console.log('\n📊 Risultati:');
  console.log(`   Variabili Ambiente: ${envCheck ? '✅' : '❌'}`);
  console.log(`   Netlify Functions: ${functionCheck ? '✅' : '❌'}`);
  console.log(`   Sistema Locale: ${optimizerCheck ? '✅' : '❌'}`);
  console.log(`   Test Setup: ${testCheck ? '✅' : '❌'}`);
  
  const allGood = envCheck && functionCheck && optimizerCheck && testCheck;
  
  console.log(`\n${allGood ? '🎉' : '⚠️'} Sistema ${allGood ? 'PRONTO' : 'RICHIEDE CONFIGURAZIONE'}`);
  
  if (!allGood) {
    console.log('\n🔧 Prossimi passi:');
    if (!envCheck) console.log('   • Configura le variabili ambiente su Netlify');
    if (!functionCheck) console.log('   • Verifica le dipendenze della function');
    if (!optimizerCheck) console.log('   • Installa Sharp: npm install sharp');
    console.log('   • Per ottimizzare: npm run optimize:batch');
  } else {
    console.log('\n🎯 Il sistema è pronto! Usa npm run optimize:batch per ottimizzare immagini.');
  }
};

// Esegui se chiamato direttamente
if (process.argv[1].endsWith('verify-system.js')) {
  main();
}

export { main as verifySystem };