#!/usr/bin/env node

/**
 * Script per testare la Netlify Function di ottimizzazione automatica
 * Da eseguire quando netlify dev è attivo
 */

import fetch from 'node-fetch'

const FUNCTION_URL = 'http://localhost:8888/.netlify/functions/auto-optimize-images'

console.log('🧪 Test Netlify Function - Auto Image Optimization')
console.log(`📡 URL: ${FUNCTION_URL}`)
console.log('')

// Test 1: Ping di base
async function testBasicPing() {
  console.log('🔄 Test 1: Basic ping test...')
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Test 1 PASSED')
      console.log('📦 Response:', data)
    } else {
      console.log('❌ Test 1 FAILED')
      console.log('Status:', response.status)
      console.log('Response:', data)
    }
  } catch (error) {
    console.log('❌ Test 1 ERROR:', error.message)
  }
  
  console.log('')
}

// Test 2: Simulazione payload TinaCloud
async function testTinaCloudPayload() {
  console.log('🔄 Test 2: TinaCloud payload simulation...')
  
  const payload = {
    event: 'media.create',
    data: {
      filename: 'test-image.jpg',
      path: '/uploads/galleries/test-image.jpg',
      type: 'image/jpeg',
      size: 1024000,
      created_at: new Date().toISOString()
    }
  }
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Test 2 PASSED')
      console.log('📦 Response:', data)
    } else {
      console.log('❌ Test 2 FAILED')
      console.log('Status:', response.status)
      console.log('Response:', data)
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error.message)
  }
  
  console.log('')
}

// Test 3: Payload con formato alternativo
async function testAlternativePayload() {
  console.log('🔄 Test 3: Alternative payload format...')
  
  const payload = {
    path: 'uploads/galleries/another-test.png',
    media: {
      filename: 'another-test.png',
      type: 'image'
    }
  }
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Test 3 PASSED')
      console.log('📦 Response:', data)
    } else {
      console.log('❌ Test 3 FAILED')
      console.log('Status:', response.status)
      console.log('Response:', data)
    }
  } catch (error) {
    console.log('❌ Test 3 ERROR:', error.message)
  }
  
  console.log('')
}

// Test 4: File non-immagine (dovrebbe essere skippato)
async function testNonImageFile() {
  console.log('🔄 Test 4: Non-image file (should be skipped)...')
  
  const payload = {
    path: '/uploads/documents/test.pdf',
    filename: 'test.pdf'
  }
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Test 4 PASSED')
      console.log('📦 Response:', data)
    } else {
      console.log('❌ Test 4 FAILED')
      console.log('Status:', response.status)
      console.log('Response:', data)
    }
  } catch (error) {
    console.log('❌ Test 4 ERROR:', error.message)
  }
  
  console.log('')
}

// Test 5: CORS preflight
async function testCORSPreflight() {
  console.log('🔄 Test 5: CORS preflight request...')
  
  try {
    const response = await fetch(FUNCTION_URL, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://app.tina.io',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    })
    
    if (response.ok) {
      console.log('✅ Test 5 PASSED')
      console.log('Status:', response.status)
      console.log('CORS Headers:')
      console.log('  Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'))
      console.log('  Access-Control-Allow-Methods:', response.headers.get('Access-Control-Allow-Methods'))
      console.log('  Access-Control-Allow-Headers:', response.headers.get('Access-Control-Allow-Headers'))
    } else {
      console.log('❌ Test 5 FAILED')
      console.log('Status:', response.status)
    }
  } catch (error) {
    console.log('❌ Test 5 ERROR:', error.message)
  }
  
  console.log('')
}

// Esegui tutti i test
async function runAllTests() {
  console.log('🚀 Starting all tests...')
  console.log('=' .repeat(50))
  console.log('')
  
  await testBasicPing()
  await testTinaCloudPayload()
  await testAlternativePayload()
  await testNonImageFile()
  await testCORSPreflight()
  
  console.log('=' .repeat(50))
  console.log('🏁 All tests completed!')
  console.log('')
  console.log('📋 Next steps:')
  console.log('   1. Se tutti i test sono passati ✅, la function è pronta')
  console.log('   2. Configura il webhook su https://tina.io/dashboard/')
  console.log('   3. URL webhook: https://kelua.netlify.app/.netlify/functions/auto-optimize-images')
  console.log('   4. Event: media.create')
  console.log('   5. Testa caricando una vera immagine su TinaCMS')
}

// Esegui i test
runAllTests().catch(error => {
  console.error('💥 Test suite failed:', error.message)
  process.exit(1)
})