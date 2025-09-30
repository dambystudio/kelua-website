// File: tina/media-config.ts
// Configurazione per integrare il media store ottimizzato

import { TinaMediaStore } from '@tinacms/core'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

/**
 * Media Store Wrapper che estende il comportamento di TinaCMS
 * per aggiungere ottimizzazione automatica delle immagini
 */
export class TinaOptimizedMediaStore extends TinaMediaStore {
  
  async persist(files: any[]): Promise<any[]> {
    // Prima salva normalmente con TinaCMS
    const results = await super.persist(files)
    
    // Poi ottimizza in background
    for (const result of results) {
      if (this.isImageFile(result.filename)) {
        this.optimizeImageInBackground(result)
          .catch(error => {
            console.error(`Background optimization failed for ${result.filename}:`, error)
          })
      }
    }
    
    return results
  }

  private async optimizeImageInBackground(media: any): Promise<void> {
    try {
      const originalPath = path.join(process.cwd(), 'public', media.src)
      const optimizedDir = path.join(path.dirname(originalPath), 'optimized')
      
      // Crea directory ottimizzate
      await fs.mkdir(optimizedDir, { recursive: true })
      
      const baseName = path.basename(media.filename, path.extname(media.filename))
      const webpPath = path.join(optimizedDir, `${baseName}.webp`)
      const avifPath = path.join(optimizedDir, `${baseName}.avif`)
      
      // Verifica se il file originale esiste
      try {
        await fs.access(originalPath)
      } catch {
        console.warn(`Original file not found: ${originalPath}`)
        return
      }
      
      // Ottimizza con Sharp
      const image = sharp(originalPath, { 
        limitInputPixels: false,
        sequentialRead: true 
      })
      
      // Ridimensiona se troppo grande
      const metadata = await image.metadata()
      let processedImage = image
      
      if (metadata.width && metadata.width > 2000) {
        processedImage = image.resize(2000, null, {
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3
        })
      }
      
      // Genera versioni ottimizzate
      await Promise.all([
        processedImage
          .clone()
          .webp({ quality: 85, effort: 4 })
          .toFile(webpPath),
        
        processedImage
          .clone()
          .avif({ quality: 80, effort: 4 })
          .toFile(avifPath)
      ])
      
      console.log(`✅ Optimized: ${baseName}.webp, ${baseName}.avif`)
      
    } catch (error) {
      console.error(`Optimization failed for ${media.filename}:`, error)
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    const ext = path.extname(filename).toLowerCase()
    return imageExtensions.includes(ext)
  }
}

// Factory function per creare il media store
export function createOptimizedMediaStore() {
  return new TinaOptimizedMediaStore()
}