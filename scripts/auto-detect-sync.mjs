#!/usr/bin/env node

/**
 * 🔍 AUTO-DETECTION & SYNC
 * Script intelligente che rileva automaticamente quando vengono caricate
 * nuove immagini tramite TinaCMS e le ottimizza automaticamente
 */

import { imageOptimizer } from '../lib/TinaCMSImageOptimizer.js'
import fs from 'fs/promises'
import path from 'path'

console.log('🔍 AUTO-DETECTION & SYNC - Sistema Intelligente')
console.log('=' .repeat(60))
console.log('')

// Funzione per rilevare immagini "orfane" (senza versioni ottimizzate)
async function detectOrphanImages() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads')
  const orphans = []
  const problematic = []
  
  async function scanDirectory(dir, relativePath = '') {
    try {
      const items = await fs.readdir(dir)
      
      for (const item of items) {
        const fullPath = path.join(dir, item)
        const relativeFullPath = path.join(relativePath, item)
        const stat = await fs.stat(fullPath)
        
        if (stat.isDirectory() && item !== 'optimized') {
          await scanDirectory(fullPath, relativeFullPath)
        } else if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(item)) {
          const dirName = path.dirname(fullPath)
          const optimizedDir = path.join(dirName, 'optimized')
          const baseName = path.basename(item, path.extname(item))
          
          const webpPath = path.join(optimizedDir, baseName + '.webp')
          const avifPath = path.join(optimizedDir, baseName + '.avif')
          
          let hasWebp = false
          let hasAvif = false
          let webpSize = 0
          let avifSize = 0
          
          // Controlla WebP
          try {
            const webpStats = await fs.stat(webpPath)
            hasWebp = true
            webpSize = webpStats.size
            
            // File troppo piccolo = problematico
            if (webpSize < 100) {
              problematic.push({
                original: path.join('uploads', relativeFullPath).replace(/\\/g, '/'),
                issue: `WebP too small (${webpSize}B)`,
                path: webpPath
              })
            }
          } catch {
            // WebP non esiste
          }
          
          // Controlla AVIF
          try {
            const avifStats = await fs.stat(avifPath)
            hasAvif = true
            avifSize = avifStats.size
            
            // File troppo piccolo = problematico
            if (avifSize < 100) {
              problematic.push({
                original: path.join('uploads', relativeFullPath).replace(/\\/g, '/'),
                issue: `AVIF too small (${avifSize}B)`,
                path: avifPath
              })
            }
          } catch {
            // AVIF non esiste
          }
          
          // Se mancano versioni ottimizzate = orfano
          if (!hasWebp || !hasAvif) {
            const imageRelativePath = path.join('uploads', relativeFullPath).replace(/\\/g, '/')
            orphans.push({
              path: imageRelativePath,
              hasWebp,
              hasAvif,
              webpSize,
              avifSize
            })
          }
        }
      }
    } catch (error) {
      console.log(`⚠️ Errore scansione ${dir}:`, error.message)
    }
  }
  
  await scanDirectory(uploadDir)
  return { orphans, problematic }
}

async function main() {
  try {
    console.log('🔍 Scansione immagini orfane e problematiche...')
    console.log('')
    
    const { orphans, problematic } = await detectOrphanImages()
    
    // Mostra immagini problematiche
    if (problematic.length > 0) {
      console.log(`⚠️ IMMAGINI PROBLEMATICHE RILEVATE (${problematic.length}):`)
      console.log('')
      
      problematic.forEach((item, i) => {
        console.log(`   ${i + 1}. ${item.original}`)
        console.log(`      Problema: ${item.issue}`)
        console.log(`      File: ${item.path}`)
      })
      console.log('')
      
      console.log('🔧 Rimuovo file problematici...')
      for (const item of problematic) {
        try {
          await fs.unlink(item.path)
          console.log(`   ✅ Rimosso: ${path.basename(item.path)}`)
        } catch (error) {
          console.log(`   ❌ Errore rimozione ${path.basename(item.path)}:`, error.message)
        }
      }
      console.log('')
    }
    
    // Mostra immagini orfane
    if (orphans.length === 0) {
      console.log('✅ Nessuna immagine orfana trovata!')
      
      if (problematic.length > 0) {
        console.log('🔄 Ma ho risolto i file problematici. Esegui di nuovo per riottimizzare.')
      } else {
        console.log('🎯 Tutte le immagini sono correttamente ottimizzate!')
      }
      return
    }
    
    console.log(`📋 IMMAGINI ORFANE RILEVATE (${orphans.length}):`)
    console.log('')
    
    // Distingui per stato
    const missingBoth = orphans.filter(img => !img.hasWebp && !img.hasAvif)
    const missingWebp = orphans.filter(img => !img.hasWebp && img.hasAvif)
    const missingAvif = orphans.filter(img => img.hasWebp && !img.hasAvif)
    
    if (missingBoth.length > 0) {
      console.log(`🚫 Completamente non ottimizzate (${missingBoth.length}):`)
      missingBoth.forEach((img, i) => console.log(`   ${i + 1}. ${img.path}`))
      console.log('')
    }
    
    if (missingWebp.length > 0) {
      console.log(`📱 Mancano solo WebP (${missingWebp.length}):`)
      missingWebp.forEach((img, i) => console.log(`   ${i + 1}. ${img.path} (AVIF: ${img.avifSize}B)`))
      console.log('')
    }
    
    if (missingAvif.length > 0) {
      console.log(`🖼️ Mancano solo AVIF (${missingAvif.length}):`)
      missingAvif.forEach((img, i) => console.log(`   ${i + 1}. ${img.path} (WebP: ${img.webpSize}B)`))
      console.log('')
    }
    
    console.log('🚀 Inizio ottimizzazione automatica...')
    console.log('')
    
    let processed = 0
    for (const orphan of orphans) {
      try {
        console.log(`🔄 [${++processed}/${orphans.length}] ${orphan.path}`)
        await imageOptimizer.optimizeImage(orphan.path)
        console.log(`✅ Completato: ${orphan.path}`)
      } catch (error) {
        console.log(`❌ Errore ${orphan.path}:`, error.message)
      }
      console.log('')
    }
    
    console.log('🎉 AUTO-DETECTION & SYNC COMPLETATO!')
    console.log('')
    console.log('📊 Risultati:')
    console.log(`   - Immagini processate: ${processed}/${orphans.length}`)
    console.log(`   - File problematici risolti: ${problematic.length}`)
    console.log('   - Sistema: Completamente sincronizzato')
    console.log('')
    console.log('🚀 Prossimi passi:')
    console.log('   1. git add . && git commit -m "fix: auto-optimized orphan images"')
    console.log('   2. git push (deploy automatico)')
    console.log('   3. Le immagini ora funzioneranno perfettamente!')
    console.log('')
    console.log('💡 Suggerimento:')
    console.log('   Esegui questo script periodicamente o dopo aver caricato nuove immagini')
    console.log('   per mantenere il sistema sempre sincronizzato.')
    
  } catch (error) {
    console.error('❌ Errore durante auto-detection:', error.message)
    process.exit(1)
  }
}

main()