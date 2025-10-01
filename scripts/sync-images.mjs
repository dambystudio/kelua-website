#!/usr/bin/env node

/**
 * Script per sincronizzare e ottimizzare le nuove immagini
 * Da eseguire dopo aver caricato nuove immagini su TinaCMS
 * 
 * Uso: npm run sync-images
 */

import { imageOptimizer } from '../lib/TinaCMSImageOptimizer.js'
import fs from 'fs/promises'
import path from 'path'

console.log('🔄 SYNC & OPTIMIZE - Nuove Immagini TinaCMS')
console.log('=' .repeat(50))
console.log('')

async function findUnoptimizedImages() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const unoptimized = []
  
  async function scanDirectory(dir, relativePath = '') {
    try {
      const items = await fs.readdir(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const relativeFullPath = path.join(relativePath, item)
        const stat = await fs.stat(fullPath)
        
        if (stat.isDirectory() && item !== 'optimized') {
          // Scansiona ricorsivamente le sottocartelle
          await scanDirectory(fullPath, relativeFullPath)
        } else if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
          // Controlla se esiste la versione ottimizzata
          const dirName = path.dirname(fullPath)
          const optimizedDir = path.join(dirName, 'optimized')
          const baseName = path.basename(item, path.extname(item))
          
          const webpPath = path.join(optimizedDir, baseName + '.webp')
          const avifPath = path.join(optimizedDir, baseName + '.avif')
          
          try {
            await fs.access(webpPath)
            await fs.access(avifPath)
            // Entrambi esistono - immagine già ottimizzata
          } catch {
            // Almeno uno non esiste - aggiungi alla lista
            const imageRelativePath = path.join('uploads', relativeFullPath).replace(/\\/g, '/')
            unoptimized.push(imageRelativePath)
          }
        }
      }
    } catch (error) {
      console.log(`⚠️  Errore scansione ${dir}:`, error.message)
    }
  }
  
  await scanDirectory(uploadDir)
  return unoptimized
}

async function main() {
  try {
    console.log('🔍 Scansione immagini non ottimizzate...')
    console.log('')
    
    const unoptimized = await findUnoptimizedImages()
    
    if (unoptimized.length === 0) {
      console.log('✅ Tutte le immagini sono già ottimizzate!')
      console.log('')
      console.log('🎯 Sistema automatico configurato:')
      console.log('   - Webhook TinaCloud → Netlify Function')
      console.log('   - Per nuove immagini: esegui questo script manualmente')
      console.log('   - Comando: npm run sync-images')
      return
    }
    
    console.log(`📋 Trovate ${unoptimized.length} immagini da ottimizzare:`)
    unoptimized.forEach((img, i) => console.log(`   ${i + 1}. ${img}`))
    console.log('')
    
    console.log('🚀 Inizio ottimizzazione...')
    console.log('')
    
    let processed = 0
    for (const imagePath of unoptimized) {
      try {
        console.log(`🔄 [${++processed}/${unoptimized.length}] ${imagePath}`)
        await imageOptimizer.optimizeImage(imagePath)
        console.log(`✅ Completato: ${imagePath}`)
      } catch (error) {
        console.log(`❌ Errore ${imagePath}:`, error.message)
      }
      console.log('')
    }
    
    console.log('🎉 Sincronizzazione completata!')
    console.log('')
    console.log('📊 Risultati:')
    console.log(`   - Immagini processate: ${processed}/${unoptimized.length}`)
    console.log('   - Versioni create: WebP + AVIF per ogni immagine')
    console.log('   - OptimizedImage component userà automaticamente le nuove versioni')
    console.log('')
    console.log('🚀 Prossimi passi:')
    console.log('   1. git add . && git commit -m "feat: optimize new images"')
    console.log('   2. git push (deploy automatico)')
    console.log('   3. Le immagini ottimizzate saranno live!')
    
  } catch (error) {
    console.error('❌ Errore durante la sincronizzazione:', error.message)
    process.exit(1)
  }
}

main()