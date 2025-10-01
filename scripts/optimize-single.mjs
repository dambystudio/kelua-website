#!/usr/bin/env node

/**
 * Script per ottimizzare una singola immagine
 * Uso: node scripts/optimize-single.mjs <percorso-immagine>
 * Esempio: node scripts/optimize-single.mjs /uploads/Foto_Giacche/foto_489.jpg
 */

import { imageOptimizer } from '../lib/TinaCMSImageOptimizer.js'
import path from 'path'

async function optimizeSingleImage(imagePath) {
  console.log('🖼️  Ottimizzazione singola immagine')
  console.log(`📁 Percorso: ${imagePath}`)
  console.log('')

  try {
    // Rimuovi il leading slash se presente
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath
    
    // Se l'utente ha fornito un percorso completo con public/, rimuovilo
    const finalPath = cleanPath.startsWith('public/') ? cleanPath.slice(7) : cleanPath
    
    console.log(`🔄 Inizio ottimizzazione: ${finalPath}`)
    
    // Usa il metodo per ottimizzare una singola immagine
    await imageOptimizer.optimizeImage(finalPath)
    
    console.log('')
    console.log('✅ Ottimizzazione completata!')
    console.log(`📂 Versioni ottimizzate create in: public/${path.dirname(finalPath)}/optimized/`)
    
  } catch (error) {
    console.error('')
    console.error('❌ Errore durante l\'ottimizzazione:', error.message)
    console.error('')
    console.error('💡 Suggerimenti:')
    console.error('   - Verifica che il file esista')
    console.error('   - Usa un percorso relativo a /uploads/')
    console.error('   - Esempio: /uploads/Foto_Giacche/foto_489.jpg')
    process.exit(1)
  }
}

// Gestisci argomenti command line
const imagePath = process.argv[2]

if (!imagePath) {
  console.log('📖 USO:')
  console.log('   node scripts/optimize-single.mjs <percorso-immagine>')
  console.log('')
  console.log('📝 ESEMPI:')
  console.log('   node scripts/optimize-single.mjs /uploads/Foto_Giacche/foto_489.jpg')
  console.log('   node scripts/optimize-single.mjs uploads/Foto_Felpe/FelpaGuessNera.jpg')
  console.log('   node scripts/optimize-single.mjs public/uploads/image.jpg')
  console.log('')
  console.log('🎯 RISULTATO:')
  console.log('   Crea versioni .webp e .avif nella cartella optimized/')
  process.exit(1)
}

// Esegui ottimizzazione
optimizeSingleImage(imagePath)