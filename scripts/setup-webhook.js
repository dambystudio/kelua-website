#!/usr/bin/env node

/**
 * 🔗 Configuratore Webhook per Ottimizzazione Automatica
 * 
 * Configura TinaCMS per chiamare la nostra Netlify Function
 * ogni volta che viene caricata una nuova immagine
 */

console.log('🔗 Configurazione Webhook TinaCMS per Ottimizzazione Automatica\n');

// Rileva automaticamente il dominio Netlify dal package.json o env
const getNetlifyDomain = () => {
  // Prova a leggere da variabili ambiente o configurazione
  if (process.env.NETLIFY_SITE_URL) {
    return process.env.NETLIFY_SITE_URL;
  }
  
  // Fallback per configurazione manuale
  return 'https://keluamoda.netlify.app'; // Sostituisci con il tuo dominio
};

const WEBHOOK_CONFIG = {
  name: 'Auto Image Optimization',
  url: `${getNetlifyDomain()}/.netlify/functions/auto-optimize`,
  events: ['media.upload'],
  description: 'Ottimizza automaticamente immagini caricate e le carica nella cartella _ottimizzate',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log('📋 Configurazione Webhook:');
console.log(JSON.stringify(WEBHOOK_CONFIG, null, 2));

console.log('\n🔧 Setup Automatico - Segui questi passi:');

console.log('\n1️⃣ NETLIFY - Variabili Ambiente:');
console.log('   Vai su: Netlify Dashboard > Site Settings > Environment Variables');
console.log('   Aggiungi:');
console.log('   • TINA_CLIENT_ID = [il tuo client ID da tina.io]');
console.log('   • TINA_TOKEN = [il tuo token da tina.io]');

console.log('\n2️⃣ TINACMS - Configurazione Webhook:');
console.log('   Vai su: https://app.tina.io/projects');
console.log('   • Seleziona il tuo progetto');
console.log('   • Settings > Webhooks > Add Webhook');
console.log('   • Copia la configurazione sopra');

console.log('\n3️⃣ DEPLOY - Attiva il sistema:');
console.log('   • git add . && git commit -m "🚀 Setup auto-optimization"');
console.log('   • git push');
console.log('   • Il sistema sarà attivo dopo il deploy!');

console.log('\n4️⃣ TEST - Verifica funzionamento:');
console.log('   • Carica un\'immagine su TinaCMS');
console.log('   • Controlla Netlify Functions logs');
console.log('   • Verifica che le versioni ottimizzate appaiano in _ottimizzate/');

console.log('\n🚀 Dopo la configurazione:');
console.log('✅ Ogni nuova immagine sarà ottimizzata automaticamente');
console.log('✅ Versioni WebP + AVIF caricate nella cartella _ottimizzate');
console.log('✅ Nessun intervento manuale richiesto');

export { WEBHOOK_CONFIG };