#!/usr/bin/env node

/**
 * Script per ottimizzare tutte le immagini esistenti nel progetto
 * Uso: npm run optimize-images
 */

import { imageOptimizer } from '../lib/TinaCMSImageOptimizer.js'

async function main() {
  console.log('🚀 Starting batch image optimization...')
  console.log('This will create WebP and AVIF versions of all images in /public/uploads/')
  
  try {
    // Ottimizza tutte le immagini nella directory uploads
    await imageOptimizer.optimizeDirectory('uploads')
    
    console.log('\n✨ All done! Your images are now optimized.')
    console.log('📁 Check /public/uploads/optimized/ for the new files.')
    
  } catch (error) {
    console.error('❌ Batch optimization failed:', error)
    process.exit(1)
  }
}

// Esegui solo se chiamato direttamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}