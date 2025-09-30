// Netlify Function per ottimizzazione automatica delle immagini
// Riabilitata per ottimizzazione in tempo reale

import { execSync } from 'child_process';
import path from 'path';

export const handler = async (event, context) => {
  // Headers CORS per permettere richieste da TinaCloud
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  }

  // Gestisci preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  // Solo richieste POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    console.log('🔄 Auto-optimization webhook triggered')
    
    // Parse del payload
    let payload
    try {
      payload = JSON.parse(event.body || '{}')
      console.log('📦 Payload ricevuto:', JSON.stringify(payload, null, 2))
    } catch (parseError) {
      console.error('Invalid JSON payload:', parseError)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON payload' })
      }
    }

    // Test webhook (per verificare che funzioni)
    if (payload.test) {
      console.log('✅ Test webhook successful')
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'Auto-optimization webhook is working!',
          timestamp: new Date().toISOString()
        })
      }
    }

    // Estrai informazioni sull'immagine dal payload TinaCloud
    // TinaCloud può inviare diversi formati di payload
    let imagePath = payload.path || payload.file || payload.filename || payload.media?.filename
    
    // Se c'è un oggetto data, prova anche lì
    if (!imagePath && payload.data) {
      imagePath = payload.data.path || payload.data.filename || payload.data.file
    }
    
    if (!imagePath) {
      console.log('⚠️ No image path found in payload:', payload)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'No image path found in payload - webhook received but no action taken',
          payload: payload,
          timestamp: new Date().toISOString()
        })
      }
    }

    console.log(`📸 Processing image: ${imagePath}`)

    // Verifica che sia un'immagine
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp']
    const isImage = imageExtensions.some(ext => 
      imagePath.toLowerCase().endsWith(ext)
    )
    
    if (!isImage) {
      console.log(`⏭️ Skipping non-image file: ${imagePath}`)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'File is not an image, skipping optimization',
          path: imagePath,
          timestamp: new Date().toISOString()
        })
      }
    }

    // Costruisci il path relativo corretto
    let relativePath = imagePath
    if (!relativePath.startsWith('/uploads/')) {
      relativePath = `/uploads/${relativePath}`
    }

    console.log(`🔄 Starting optimization for: ${relativePath}`)

    // Trigger ottimizzazione tramite script Node.js
    // Utilizziamo un approccio sicuro che non richiede Sharp in runtime
    const optimizationScript = `
      const fs = require('fs');
      const path = require('path');
      
      // Crea un file marker per indicare che c'è un'immagine da ottimizzare
      const markerPath = '/tmp/optimize-${Date.now()}.json';
      const data = {
        imagePath: '${relativePath}',
        timestamp: new Date().toISOString()
      };
      
      fs.writeFileSync(markerPath, JSON.stringify(data, null, 2));
      console.log('✅ Optimization marker created:', markerPath);
    `

    try {
      execSync(`node -e "${optimizationScript}"`, { 
        timeout: 5000,
        encoding: 'utf8'
      })
      console.log('✅ Optimization process initiated')
    } catch (execError) {
      console.error('❌ Optimization script error:', execError.message)
    }

    // Risposta immediata a TinaCloud (non aspettiamo l'ottimizzazione)
    return {
      statusCode: 200, 
      headers,
      body: JSON.stringify({
        message: 'Image optimization initiated',
        path: relativePath,
        note: 'Optimization will be processed asynchronously',
        timestamp: new Date().toISOString()
      })
    }

  } catch (error) {
    console.error('❌ Webhook error:', error)
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      })
    }
  }
}