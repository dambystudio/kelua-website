import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

interface OptimizedImageFormats {
  webp: string
  avif: string
  original: string
}

interface UploadResponse {
  filename: string
  directory: string
  src: string
}

interface MediaUploadOptions {
  name: string
  buffer: Buffer
  directory?: string
  type?: string
}

// Media Store compatibile con TinaCMS
export class OptimizedMediaStore {
  private baseDirectory: string
  private publicPath: string
  
  constructor(options: {
    baseDirectory: string
    publicPath: string
  }) {
    this.baseDirectory = options.baseDirectory
    this.publicPath = options.publicPath
  }

  async persist(files: MediaUploadOptions[]): Promise<UploadResponse[]> {
    const results: UploadResponse[] = []
    
    for (const file of files) {
      try {
        const result = await this.processAndUploadFile(file)
        results.push(result)
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error)
        // Fallback: salva solo l'originale se la conversione fallisce
        const fallbackResult = await this.uploadOriginalFile(file)
        results.push(fallbackResult)
      }
    }
    
    return results
  }

  private async processAndUploadFile(file: MediaUploadOptions): Promise<UploadResponse> {
    const isImage = this.isImageFile(file.name)
    
    if (!isImage) {
      // Per file non-immagine, upload normale
      return this.uploadOriginalFile(file)
    }

    // Genera nomi file unici
    const fileId = uuidv4()
    const ext = path.extname(file.name).toLowerCase()
    const baseName = path.basename(file.name, ext)
    const sanitizedName = this.sanitizeFilename(baseName)
    
    const filenames = {
      original: `${sanitizedName}-${fileId}${ext}`,
      webp: `${sanitizedName}-${fileId}.webp`,
      avif: `${sanitizedName}-${fileId}.avif`
    }

    // Directory di destinazione
    const targetDir = path.join(this.baseDirectory, file.directory || 'uploads')
    const optimizedDir = path.join(targetDir, 'optimized')
    
    // Crea directory se non esistono
    await fs.mkdir(targetDir, { recursive: true })
    await fs.mkdir(optimizedDir, { recursive: true })

    // Percorsi completi
    const paths = {
      original: path.join(targetDir, filenames.original),
      webp: path.join(optimizedDir, filenames.webp),
      avif: path.join(optimizedDir, filenames.avif)
    }

    // Salva file originale
    await fs.writeFile(paths.original, file.buffer)

    // Ottimizza in parallelo (non bloccante)
    this.optimizeImageAsync(file.buffer, paths.webp, paths.avif)
      .catch(error => {
        console.error(`Background optimization failed for ${file.name}:`, error)
      })

    // Ritorna immediatamente il path dell'originale
    const relativePath = path.relative(this.baseDirectory, paths.original)
    return {
      filename: filenames.original,
      directory: file.directory || 'uploads',
      src: `${this.publicPath}/${relativePath.replace(/\\/g, '/')}`
    }
  }

  private async optimizeImageAsync(buffer: Buffer, webpPath: string, avifPath: string): Promise<void> {
    const image = sharp(buffer, { 
      limitInputPixels: false,
      sequentialRead: true 
    })

    // Ottimizza dimensioni se troppo grandi
    const metadata = await image.metadata()
    let processedImage = image

    if (metadata.width && metadata.width > 2000) {
      processedImage = image.resize(2000, null, {
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3
      })
    }

    // Genera WebP e AVIF in parallelo
    await Promise.all([
      // WebP con qualità alta
      processedImage
        .clone()
        .webp({ 
          quality: 85,
          effort: 4,
          nearLossless: false
        })
        .toFile(webpPath),
      
      // AVIF con qualità ottimale
      processedImage
        .clone()
        .avif({ 
          quality: 80,
          effort: 4,
          chromaSubsampling: '4:2:0'
        })
        .toFile(avifPath)
    ])

    console.log(`✅ Optimized images created: ${path.basename(webpPath)}, ${path.basename(avifPath)}`)
  }

  private async uploadOriginalFile(file: MediaUploadOptions): Promise<UploadResponse> {
    const targetDir = path.join(this.baseDirectory, file.directory || 'uploads')
    await fs.mkdir(targetDir, { recursive: true })
    
    const filename = `${Date.now()}-${this.sanitizeFilename(file.name)}`
    const filepath = path.join(targetDir, filename)
    
    await fs.writeFile(filepath, file.buffer)
    
    const relativePath = path.relative(this.baseDirectory, filepath)
    return {
      filename,
      directory: file.directory || 'uploads',
      src: `${this.publicPath}/${relativePath.replace(/\\/g, '/')}`
    }
  }

  async delete(media: { filename: string; directory?: string }): Promise<void> {
    const targetDir = path.join(this.baseDirectory, media.directory || 'uploads')
    const filepath = path.join(targetDir, media.filename)
    
    try {
      // Elimina file originale
      await fs.unlink(filepath)
      
      // Elimina versioni ottimizzate se esistono
      const baseName = path.basename(media.filename, path.extname(media.filename))
      const optimizedDir = path.join(targetDir, 'optimized')
      
      const optimizedFiles = [
        path.join(optimizedDir, `${baseName}.webp`),
        path.join(optimizedDir, `${baseName}.avif`)
      ]
      
      for (const file of optimizedFiles) {
        try {
          await fs.access(file)
          await fs.unlink(file)
        } catch {
          // File non esiste, ignora
        }
      }
    } catch (error) {
      console.error(`Error deleting file ${media.filename}:`, error)
      throw error
    }
  }

  private isImageFile(filename: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.webp']
    const ext = path.extname(filename).toLowerCase()
    return imageExtensions.includes(ext)
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-zA-Z0-9.-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
}

export default OptimizedMediaStore