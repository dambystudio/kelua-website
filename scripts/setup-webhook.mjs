#!/usr/bin/env node

/**
 * Script per configurare il webhook TinaCloud → Netlify
 * Configura TinaCloud per chiamare la nostra function quando viene caricata un'immagine
 */

console.log('🔧 TinaCloud Webhook Configuration')
console.log('')

console.log('Per configurare l\'ottimizzazione automatica delle immagini:')
console.log('')

console.log('1. 🌐 Vai su https://tina.io/dashboard/')
console.log('2. 📂 Seleziona il tuo progetto "kelua-website"')
console.log('3. ⚙️  Vai su Settings → Webhooks')
console.log('4. ➕ Aggiungi nuovo webhook con questi parametri:')
console.log('')
console.log('   � Name: Auto Image Optimization')
console.log('   �📍 Webhook URL: https://kelua.netlify.app/.netlify/functions/auto-optimize-images')
console.log('   🌿 Branches: master (o il tuo branch principale)')
console.log('   📦 Headers: 
     Key: Content-Type
     Value: application/json')
console.log('')

console.log('5. 💾 Salva il webhook')
console.log('')

console.log('🧪 Test del webhook:')
console.log('Una volta configurato, puoi testarlo con:')
console.log('')
console.log('   curl -X POST https://kelua.netlify.app/.netlify/functions/auto-optimize-images \\')
console.log('     -H "Content-Type: application/json" \\')
console.log('     -d \'{"test": true}\'')
console.log('')

console.log('✅ Se tutto funziona, vedrai il messaggio: "Auto-optimization webhook is working!"')
console.log('')

console.log('🎯 Flusso completo:')
console.log('   Utente carica immagine → TinaCloud → Webhook → Netlify Function → Sharp → WebP/AVIF')
console.log('')

console.log('📚 Documentazione TinaCloud Webhooks:')
console.log('   https://tina.io/docs/reference/overview/#webhooks')

// Test della function localmente se disponibile
const siteUrl = process.env.NETLIFY_SITE_URL || 'https://kelua.netlify.app'
console.log('')
console.log(`🔗 URL webhook per TinaCloud: ${siteUrl}/.netlify/functions/auto-optimize-images`)
console.log('')

// Salva configurazione per riferimento
import fs from 'fs/promises'
import path from 'path'

const config = {
  webhook: {
    name: 'Auto Image Optimization',
    url: `${siteUrl}/.netlify/functions/auto-optimize-images`,
    branches: 'master',
    headers: 'Content-Type: application/json'
  },
  setup_date: new Date().toISOString(),
  instructions: 'Configurare questo webhook su https://tina.io/dashboard/'
}

const configPath = path.join(process.cwd(), 'webhook-config.json')
await fs.writeFile(configPath, JSON.stringify(config, null, 2))
console.log(`📄 Configurazione salvata in: webhook-config.json`)