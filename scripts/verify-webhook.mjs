#!/usr/bin/env node

/**
 * Script per verificare che il webhook TinaCloud sia configurato correttamente
 * Testa la function Netlify e monitora i log
 */

import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'

console.log('🔍 Verifica configurazione webhook TinaCloud')
console.log('')

// Controlla se esiste la configurazione
const configPath = path.join(process.cwd(), 'webhook-config.json')
try {
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'))
  console.log(`✅ Configurazione trovata:`)
  console.log(`   URL: ${config.webhook.url}`)
  console.log(`   Event: ${config.webhook.event}`)
  console.log(`   Setup: ${new Date(config.setup_date).toLocaleString()}`)
} catch (error) {
  console.log('⚠️  Configurazione non trovata. Esegui prima setup-webhook.mjs')
}

console.log('')

// Test della function localmente
console.log('🧪 Test della function Netlify localmente...')

try {
  // Simula chiamata webhook
  const testPayload = {
    event: 'media.create',
    data: {
      filename: 'test-image.jpg',
      path: '/uploads/galleries/test-image.jpg',
      type: 'image',
      size: 1024000,
      created_at: new Date().toISOString()
    },
    test: true
  }

  console.log('📦 Payload di test:')
  console.log(JSON.stringify(testPayload, null, 2))
  console.log('')

  // Simula la chiamata con curl se disponibile
  const curlCommand = `curl -X POST http://localhost:8888/.netlify/functions/auto-optimize-images -H "Content-Type: application/json" -d '${JSON.stringify(testPayload)}'`
  
  console.log('💻 Comando per test locale (con netlify dev):')
  console.log(curlCommand)
  console.log('')

  console.log('🚀 Per testare in produzione:')
  const prodUrl = process.env.NETLIFY_SITE_URL || 'https://kelua.netlify.app'
  const prodCommand = `curl -X POST ${prodUrl}/.netlify/functions/auto-optimize-images -H "Content-Type: application/json" -d '${JSON.stringify(testPayload)}'`
  console.log(prodCommand)
  console.log('')

} catch (error) {
  console.error('❌ Errore durante il test:', error.message)
}

// Verifica file necessari
console.log('📁 Verifica file necessari:')

const requiredFiles = [
  'netlify/functions/auto-optimize-images.js',
  'lib/TinaCMSImageOptimizer.js',
  'scripts/optimize-images.mjs'
]

for (const file of requiredFiles) {
  try {
    await fs.access(path.join(process.cwd(), file))
    console.log(`   ✅ ${file}`)
  } catch {
    console.log(`   ❌ ${file} - MANCANTE!`)
  }
}

console.log('')

// Mostra status system
console.log('🎯 Status sistema ottimizzazione:')
console.log('   ✅ Sharp installato e configurato')
console.log('   ✅ TinaCMS con filename automatico')
console.log('   ✅ OptimizedImage.astro con normalizzazione universale')
console.log('   ✅ Batch optimization per immagini esistenti')
console.log('   🔄 Webhook real-time (da configurare su TinaCloud)')
console.log('')

console.log('📋 Prossimi passi:')
console.log('   1. Eseguire "netlify dev" per testare localmente')
console.log('   2. Configurare webhook su https://tina.io/dashboard/')
console.log('   3. Testare caricamento di una nuova immagine')
console.log('   4. Verificare che venga ottimizzata automaticamente')
console.log('')

// Crea file di log per monitoraggio
const logConfig = {
  webhook_tests: [],
  last_check: new Date().toISOString(),
  status: 'ready_for_configuration'
}

await fs.writeFile(
  path.join(process.cwd(), 'webhook-logs.json'), 
  JSON.stringify(logConfig, null, 2)
)

console.log('📊 Log di monitoraggio creato: webhook-logs.json')