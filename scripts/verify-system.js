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
  const functionPath = './netlify/functions/auto-optimize.js';
  
  if (fs.existsSync(functionPath)) {
    console.log('   ✅ Function auto-optimize.js: Presente');
    
    // Controlla le dipendenze
    const content = fs.readFileSync(functionPath, 'utf8');
    const hasSharp = content.includes('sharp');
    const hasFetch = content.includes('node-fetch');
    
    console.log(`   ${hasSharp ? '✅' : '❌'} Sharp: ${hasSharp ? 'Importato' : 'Mancante'}`);
    console.log(`   ${hasFetch ? '✅' : '❌'} Node-fetch: ${hasFetch ? 'Importato' : 'Mancante'}`);
    
    return hasSharp && hasFetch;
  } else {
    console.log('   ❌ Function auto-optimize.js: Mancante');
    return false;
  }
};

const checkGitHubActions = async () => {
  console.log('\n3️⃣ Controllo GitHub Actions:');
  
  const fs = await import('fs');
  const actionPath = './.github/workflows/optimize-images.yml';
  
  if (fs.existsSync(actionPath)) {
    console.log('   ✅ Workflow optimize-images.yml: Presente');
    return true;
  } else {
    console.log('   ❌ Workflow optimize-images.yml: Mancante');
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
  const actionCheck = await checkGitHubActions();
  const testCheck = await testWebhookLocally();
  
  console.log('\n📊 Risultati:');
  console.log(`   Variabili Ambiente: ${envCheck ? '✅' : '❌'}`);
  console.log(`   Netlify Functions: ${functionCheck ? '✅' : '❌'}`);
  console.log(`   GitHub Actions: ${actionCheck ? '✅' : '❌'}`);
  console.log(`   Test Setup: ${testCheck ? '✅' : '❌'}`);
  
  const allGood = envCheck && functionCheck && actionCheck && testCheck;
  
  console.log(`\n${allGood ? '🎉' : '⚠️'} Sistema ${allGood ? 'PRONTO' : 'RICHIEDE CONFIGURAZIONE'}`);
  
  if (!allGood) {
    console.log('\n🔧 Prossimi passi:');
    if (!envCheck) console.log('   • Configura le variabili ambiente su Netlify');
    if (!functionCheck) console.log('   • Verifica le dipendenze della function');
    if (!actionCheck) console.log('   • Crea il workflow GitHub Actions');
    console.log('   • Esegui: npm run setup:webhook');
  } else {
    console.log('\n🎯 Il sistema è pronto! Carica un\'immagine per testare.');
  }
};

// Esegui se chiamato direttamente
if (process.argv[1].endsWith('verify-system.js')) {
  main();
}

export { main as verifySystem };