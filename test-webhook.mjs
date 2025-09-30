#!/usr/bin/env node

/**
 * Script per testare la Netlify Function localmente
 */

console.log('🧪 Testing Netlify Function Auto-Optimize...')

// Simula i payloads che TinaCloud potrebbe inviare
const testPayloads = [
  // Test payload
  { test: true },
  
  // Payload con path diretto
  { path: '/uploads/Foto_Jeans/nuovo-jeans.jpg' },
  
  // Payload con filename
  { filename: 'nuova-felpa.jpg' },
  
  // Payload con struttura media
  { media: { filename: 'giacca-sportiva.png' } },
  
  // Payload senza immagini
  { file: 'documento.pdf' }
]

async function testFunction(payload) {
  console.log(`\n🔄 Testing payload:`, JSON.stringify(payload, null, 2))
  
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const result = await response.json()
    console.log(`✅ Status: ${response.status}`)
    console.log(`📋 Response:`, result)
    
  } catch (error) {
    console.error(`❌ Error:`, error.message)
  }
}

async function runTests() {
  console.log('📋 Starting function tests...')
  console.log('⚠️  Make sure to start Netlify Dev first: netlify dev')
  
  // Aspetta un po' prima di iniziare
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  for (const payload of testPayloads) {
    await testFunction(payload)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  console.log('\n✨ All tests completed!')
}

runTests().catch(console.error)