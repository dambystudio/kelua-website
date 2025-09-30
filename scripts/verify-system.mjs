#!/usr/bin/env node

/**
 * Script per verificare che tutto il sistema di ottimizzazione funzioni correttamente
 */

import fs from 'fs/promises'
import path from 'path'

console.log('🔍 Verifica Sistema di Ottimizzazione Automatica')
console.log('===============================================')
console.log('')

let allChecksPass = true

// 1. Verifica dipendenze
console.log('1. 📦 Controllo dipendenze...')
try {
  const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'))
  const requiredDeps = ['sharp', 'uuid']
  
  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`   ✅ ${dep} installato`)
    } else {
      console.log(`   ❌ ${dep} mancante`)
      allChecksPass = false
    }
  }
} catch (error) {
  console.log('   ❌ Errore lettura package.json')
  allChecksPass = false
}

console.log('')

// 2. Verifica file del sistema
console.log('2. 📁 Controllo file del sistema...')
const requiredFiles = [
  'lib/TinaCMSImageOptimizer.js',
  'netlify/functions/auto-optimize-images.js',
  'scripts/optimize-images.mjs',
  'scripts/setup-webhook.mjs',
  'src/components/OptimizedImage.astro'
]

for (const file of requiredFiles) {
  try {
    await fs.access(file)
    console.log(`   ✅ ${file}`)
  } catch {
    console.log(`   ❌ ${file} mancante`)
    allChecksPass = false
  }
}

console.log('')

// 3. Verifica directory ottimizzate
console.log('3. 🖼️  Controllo immagini ottimizzate...')
try {
  const optimizedDir = 'public/uploads/optimized'
  const files = await fs.readdir(optimizedDir)
  const webpFiles = files.filter(f => f.endsWith('.webp')).length
  const avifFiles = files.filter(f => f.endsWith('.avif')).length
  
  console.log(`   ✅ Directory ottimizzate esistente`)
  console.log(`   📊 ${webpFiles} file WebP trovati`)
  console.log(`   📊 ${avifFiles} file AVIF trovati`)
  
  if (webpFiles === 0 && avifFiles === 0) {
    console.log('   ⚠️  Nessuna immagine ottimizzata trovata. Esegui: npm run optimize:batch')
  }
} catch {
  console.log('   ❌ Directory ottimizzate non trovata')
  allChecksPass = false
}

console.log('')

// 4. Verifica configurazione Netlify
console.log('4. 🌐 Controllo configurazione Netlify...')
try {
  const netlifyConfig = await fs.readFile('netlify.toml', 'utf8')
  if (netlifyConfig.includes('functions = "netlify/functions"')) {
    console.log('   ✅ Netlify Functions abilitato')
  } else {
    console.log('   ❌ Netlify Functions disabilitato in netlify.toml')
    allChecksPass = false
  }
} catch {
  console.log('   ❌ File netlify.toml non trovato')
  allChecksPass = false
}

console.log('')

// 5. Test componente
console.log('5. 🧩 Test componente OptimizedImage...')
try {
  const component = await fs.readFile('src/components/OptimizedImage.astro', 'utf8')
  if (component.includes('getOptimizedVersions')) {
    console.log('   ✅ Componente usa logica di ottimizzazione automatica')
  } else {
    console.log('   ❌ Componente non aggiornato')
    allChecksPass = false
  }
} catch {
  console.log('   ❌ Componente OptimizedImage non trovato')
  allChecksPass = false
}

console.log('')

// Risultato finale
if (allChecksPass) {
  console.log('🎉 SISTEMA COMPLETO E FUNZIONANTE!')
  console.log('')
  console.log('📋 Prossimi passi:')
  console.log('   1. Deploy su Netlify: git push')
  console.log('   2. Configura webhook: npm run setup:webhook')
  console.log('   3. Testa webhook: npm run test:webhook')
  console.log('')
  console.log('✨ Dopo la configurazione, ogni immagine caricata su TinaCloud')
  console.log('   verrà automaticamente ottimizzata in WebP e AVIF!')
} else {
  console.log('❌ SISTEMA INCOMPLETO')
  console.log('')
  console.log('🔧 Correggi gli errori sopra e riesegui questo script')
}

console.log('')
console.log('📊 Statistiche sistema:')

// Calcola risparmio spazio
try {
  const stats = await calculateSpaceSavings()
  console.log(`   💾 Spazio risparmiato: ~${stats.savedMB}MB (${stats.savedPercent}%)`)
  console.log(`   📁 ${stats.originalCount} immagini originali`)
  console.log(`   🖼️  ${stats.optimizedCount} versioni ottimizzate`)
} catch (error) {
  console.log('   ❌ Impossibile calcolare statistiche')
}

async function calculateSpaceSavings() {
  const originalDir = 'public/uploads'
  const optimizedDir = 'public/uploads/optimized'
  
  let originalSize = 0
  let optimizedSize = 0
  let originalCount = 0
  let optimizedCount = 0
  
  // Calcola dimensioni ricorsivamente
  const calculateDirSize = async (dir, isOptimized = false) => {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory() && entry.name !== 'optimized') {
          await calculateDirSize(fullPath, isOptimized)
        } else if (entry.isFile()) {
          const stats = await fs.stat(fullPath)
          
          if (isOptimized) {
            optimizedSize += stats.size
            optimizedCount++
          } else if (entry.name !== 'test.txt') {
            originalSize += stats.size
            originalCount++
          }
        }
      }
    } catch (error) {
      // Directory non esiste o non accessibile
    }
  }
  
  await calculateDirSize(originalDir, false)
  await calculateDirSize(optimizedDir, true)
  
  const savedBytes = originalSize - optimizedSize
  const savedMB = Math.round(savedBytes / 1024 / 1024)
  const savedPercent = Math.round((savedBytes / originalSize) * 100)
  
  return { savedMB, savedPercent, originalCount, optimizedCount }
}