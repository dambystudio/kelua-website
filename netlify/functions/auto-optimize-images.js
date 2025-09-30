// Netlify Function per ottimizzazione automatica delle immagini
// Temporaneamente disabilitata - l'ottimizzazione avviene localmente

exports.handler = async (event, context) => {
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

  console.log('🔄 Webhook ricevuto - funzione temporaneamente disabilitata')
  
  // Risposta immediata - ottimizzazione avviene localmente
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ 
      message: 'Webhook received - optimization handled locally',
      note: 'Run npm run optimize:batch locally to optimize new images',
      timestamp: new Date().toISOString()
    })
  }
}