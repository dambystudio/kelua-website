import { imageOptimizer } from '../../lib/TinaCMSImageOptimizer.js'

/**
 * Netlify Function per ottimizzazione automatica delle immagini
 * Viene chiamata da TinaCloud quando viene caricata una nuova immagine
 */
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
    const { imagePath, filename, mediaRoot } = payload
    
    if (!imagePath && !filename) {
      console.error('Missing image information in payload:', payload)
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing imagePath or filename' })
      }
    }

    // Determina il path relativo dell'immagine
    let relativePath
    if (imagePath) {
      // Usa imagePath se fornito
      relativePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
    } else {
      // Costruisci path da filename e mediaRoot
      const root = mediaRoot || 'uploads'
      relativePath = `/${root}/${filename}`
    }

    console.log(`📸 Processing image: ${relativePath}`)

    // Verifica che sia un'immagine
    if (!imageOptimizer.isImageFile(relativePath)) {
      console.log(`⏭️ Skipping non-image file: ${relativePath}`)
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          message: 'File is not an image, skipping optimization',
          path: relativePath
        })
      }
    }

    // Ottimizza l'immagine (processo asincrono)
    const optimizationPromise = imageOptimizer.optimizeImage(relativePath)
    
    // Non aspettiamo il completamento per non far aspettare TinaCloud
    optimizationPromise
      .then(() => {
        console.log(`✅ Optimization completed for: ${relativePath}`)
      })
      .catch(error => {
        console.error(`❌ Optimization failed for ${relativePath}:`, error)
      })

    // Risposta immediata a TinaCloud
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: 'Image optimization started',
        path: relativePath,
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