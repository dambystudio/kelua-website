import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

/**
 * Hook per ottimizzare automaticamente le immagini caricate tramite TinaCMS
 * Si integra con il sistema esistente senza sostituirlo
 */
export class TinaCMSImageOptimizer {
  private baseDirectory: string
  private isProcessing: Set<string> = new Set()

  constructor(baseDirectory: string = 'public') {
    this.baseDirectory = baseDirectory
  }

  /**
   * Ottimizza un'immagine data il suo path relativo
   * Es: optimizeImage('/uploads/IMG-3618.jpeg')
   */
  async optimizeImage(relativePath: string): Promise<void> {
    // Evita processamento doppio
    if (this.isProcessing.has(relativePath)) {
      return
    }
    
    this.isProcessing.add(relativePath)
    
    try {
      const fullPath = path.join(process.cwd(), this.baseDirectory, relativePath)
      
      // Verifica che il file esista
      try {
        await fs.access(fullPath)
      } catch {
        console.warn(`File not found for optimization: ${fullPath}`)
        return
      }

      // Controlla se è un'immagine
      if (!this.isImageFile(relativePath)) {
        return
      }

      console.log(`🔄 Starting optimization for: ${relativePath}`)
      
      // Crea directory ottimizzata
      const dir = path.dirname(fullPath)
      const optimizedDir = path.join(dir, 'optimized')
      await fs.mkdir(optimizedDir, { recursive: true })

      // Genera nomi file ottimizzati
      const filename = path.basename(relativePath)
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
      
      const webpPath = path.join(optimizedDir, `${nameWithoutExt}.webp`)
      const avifPath = path.join(optimizedDir, `${nameWithoutExt}.avif`)

      // Ottimizza con Sharp
      const image = sharp(fullPath, { 
        limitInputPixels: false,
        sequentialRead: true,
        failOnError: false
      })

      // Ottieni metadata
      const metadata = await image.metadata()
      let processedImage = image

      // Ridimensiona se troppo grande (>2000px width)
      if (metadata.width && metadata.width > 2000) {
        console.log(`📏 Resizing ${filename}: ${metadata.width}px → 2000px`)
        processedImage = image.resize(2000, null, {
          withoutEnlargement: true,
          kernel: sharp.kernel.lanczos3
        })
      }

      // Genera versioni ottimizzate in parallelo
      await Promise.all([
        // WebP - buon supporto browser
        processedImage
          .clone()
          .webp({ 
            quality: 85,
            effort: 4,
            nearLossless: false 
          })
          .toFile(webpPath)
          .then(() => console.log(`✅ Created: ${path.basename(webpPath)}`)),
        
        // AVIF - migliore compressione
        processedImage
          .clone()
          .avif({ 
            quality: 80,
            effort: 4,
            chromaSubsampling: '4:2:0' 
          })
          .toFile(avifPath)
          .then(() => console.log(`✅ Created: ${path.basename(avifPath)}`))
      ])

      console.log(`🎉 Optimization complete for: ${filename}`)
      
    } catch (error) {
      console.error(`❌ Optimization failed for ${relativePath}:`, error)
    } finally {
      this.isProcessing.delete(relativePath)
    }
  }

  /**
   * Ottimizza tutte le immagini in una directory
   */
  async optimizeDirectory(directory: string = 'uploads'): Promise<void> {
    const fullDir = path.join(process.cwd(), this.baseDirectory, directory)
    
    try {
      const files = await this.getImageFilesRecursive(fullDir)
      console.log(`🔍 Found ${files.length} images to optimize in ${directory}`)
      
      // Processa in batch di 3 per evitare sovraccarico
      for (let i = 0; i < files.length; i += 3) {
        const batch = files.slice(i, i + 3)
        await Promise.all(
          batch.map(file => {
            const relativePath = path.relative(path.join(process.cwd(), this.baseDirectory), file)
            return this.optimizeImage('/' + relativePath.replace(/\\/g, '/'))
          })
        )
      }
      
      console.log(`🎉 Batch optimization complete!`)
    } catch (error) {
      console.error(`❌ Batch optimization failed:`, error)
    }
  }

  /**
   * Trova ricorsivamente tutti i file immagine in una directory
   */
  private async getImageFilesRecursive(dir: string): Promise<string[]> {
    const files: string[] = []
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true })
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        
        if (entry.isDirectory() && entry.name !== 'optimized') {
          // Ricorsione nelle sottodirectory (eccetto 'optimized')
          const subFiles = await this.getImageFilesRecursive(fullPath)
          files.push(...subFiles)
        } else if (entry.isFile() && this.isImageFile(entry.name)) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      console.warn(`Cannot read directory ${dir}:`, error)
    }
    
    return files
  }

  /**
   * Verifica se un file è un'immagine supportata
   */
  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff']
    const ext = path.extname(filename).toLowerCase()
    return imageExtensions.includes(ext)
  }

  /**
   * Elimina le versioni ottimizzate di un'immagine
   */
  async deleteOptimizedVersions(relativePath: string): Promise<void> {
    try {
      const fullPath = path.join(process.cwd(), this.baseDirectory, relativePath)
      const dir = path.dirname(fullPath)
      const optimizedDir = path.join(dir, 'optimized')
      
      const filename = path.basename(relativePath)
      const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
      
      const filesToDelete = [
        path.join(optimizedDir, `${nameWithoutExt}.webp`),
        path.join(optimizedDir, `${nameWithoutExt}.avif`)
      ]
      
      for (const file of filesToDelete) {
        try {
          await fs.unlink(file)
          console.log(`🗑️ Deleted: ${path.basename(file)}`)
        } catch {
          // File non esiste, ignora
        }
      }
    } catch (error) {
      console.error(`Error deleting optimized versions for ${relativePath}:`, error)
    }
  }
}

// Istanza singleton
export const imageOptimizer = new TinaCMSImageOptimizer()

export default TinaCMSImageOptimizer