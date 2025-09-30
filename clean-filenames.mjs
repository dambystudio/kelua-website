#!/usr/bin/env node

/**
 * Script per pulire i nomi di tutti i file nelle cartelle uploads
 * Rimuove spazi, caratteri speciali e normalizza i nomi
 */

import fs from 'fs'
import path from 'path'

// Funzione universale per pulire i nomi dei file
const cleanFileName = (filename) => {
  // Estrai nome ed estensione
  const lastDotIndex = filename.lastIndexOf('.')
  const name = lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename
  const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : ''
  
  // Pulisci il nome del file:
  let cleanName = name
    // Rimuovi spazi e sostituisci con trattini
    .replace(/\s+/g, '-')
    // Rimuovi caratteri speciali pericolosi
    .replace(/[^a-zA-Z0-9\-_]/g, '')
    // Rimuovi trattini multipli
    .replace(/-+/g, '-')
    // Rimuovi trattini all'inizio e alla fine
    .replace(/^-+|-+$/g, '')
    // Converti a lowercase per consistenza
    .toLowerCase()
  
  // Se il nome è vuoto dopo la pulizia, usa un fallback
  if (!cleanName) {
    cleanName = 'file-' + Date.now()
  }
  
  // Ritorna nome pulito + estensione (lowercase)
  return cleanName + extension.toLowerCase()
}

// Funzione per rinominare ricorsivamente tutti i file
const cleanAllFiles = (dirPath) => {
  console.log(`🔍 Scanning: ${dirPath}`)
  
  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true })
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name)
      
      if (item.isDirectory()) {
        // Ricorsione nelle sottocartelle
        cleanAllFiles(fullPath)
      } else if (item.isFile()) {
        // Pulisci il nome del file
        const cleanName = cleanFileName(item.name)
        
        // Se il nome è diverso, rinomina
        if (cleanName !== item.name) {
          const newPath = path.join(dirPath, cleanName)
          
          // Controlla se il file di destinazione esiste già
          if (fs.existsSync(newPath)) {
            console.log(`⚠️  Skipped (exists): ${item.name} -> ${cleanName}`)
          } else {
            try {
              fs.renameSync(fullPath, newPath)
              console.log(`✅ Renamed: ${item.name} -> ${cleanName}`)
            } catch (error) {
              console.log(`❌ Error renaming ${item.name}:`, error.message)
            }
          }
        }
      }
    }
  } catch (error) {
    console.log(`❌ Error scanning ${dirPath}:`, error.message)
  }
}

// Main execution
async function main() {
  console.log('🧹 Universal File Name Cleaner')
  console.log('This will rename all files to remove spaces and special characters\n')
  
  const uploadsDir = './public/uploads'
  
  if (!fs.existsSync(uploadsDir)) {
    console.log(`❌ Directory ${uploadsDir} not found!`)
    return
  }
  
  // Pulisci tutti i file nella directory uploads
  cleanAllFiles(uploadsDir)
  
  console.log('\n✨ File cleaning completed!')
  console.log('📋 Run npm run optimize:batch to regenerate optimized versions with clean names')
}

main()