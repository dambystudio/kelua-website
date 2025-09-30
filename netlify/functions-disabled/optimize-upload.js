const sharp = require('sharp');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  console.log('🔄 Webhook ricevuto per ottimizzazione immagine');
  
  // Verifica che sia una richiesta POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse del payload TinaCMS
    const payload = JSON.parse(event.body);
    console.log('📦 Payload ricevuto:', JSON.stringify(payload, null, 2));

    // Verifica se è un upload di immagine
    if (!payload.file || !payload.file.path) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No file information provided' })
      };
    }

    const filePath = payload.file.path;
    const fileName = payload.file.filename;
    
    // Controlla se è un'immagine
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];
    const fileExtension = fileName.toLowerCase().substr(fileName.lastIndexOf('.'));
    
    if (!imageExtensions.includes(fileExtension)) {
      console.log(`⏭️ File ${fileName} non è un'immagine, skip`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Not an image, skipped' })
      };
    }

    // Estrai informazioni dal percorso
    const pathParts = filePath.split('/');
    const folderName = pathParts[pathParts.length - 2]; // es: "Foto_Maglieria"
    
    // Controlla se è in una cartella che richiede ottimizzazione
    const foldersToOptimize = [
      'Foto_Accessori', 'Foto_Camicie', 'Foto_Felpe', 'Foto_Giubbotti',
      'Foto_Jeans', 'Foto_Maglieria', 'Foto_Negozio', 'Foto_Pantaloni'
    ];
    
    if (!foldersToOptimize.includes(folderName)) {
      console.log(`⏭️ Cartella ${folderName} non richiede ottimizzazione`);
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Folder does not require optimization' })
      };
    }

    console.log(`🖼️ Ottimizzando immagine: ${fileName} in cartella: ${folderName}`);

    // Scarica l'immagine originale da TinaCloud
    const imageUrl = `https://assets.tina.io/${process.env.TINA_CLIENT_ID}/${filePath}`;
    console.log(`📥 Scaricando da: ${imageUrl}`);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.buffer();
    console.log(`✅ Immagine scaricata, dimensione: ${imageBuffer.length} bytes`);

    // Genera nome ottimizzato
    const getOptimizedFilename = (originalFilename) => {
      const lastDot = originalFilename.lastIndexOf('.');
      const nameWithoutExt = lastDot !== -1 ? originalFilename.substring(0, lastDot) : originalFilename;
      
      let sanitizedName = nameWithoutExt
        .replace(/\s+/g, '-')
        .replace(/[àáâäãå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôöõø]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ýÿ]/g, 'y')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^\w\-_.]/g, '');
      
      // Pattern specifici (stesso di OptimizedImage.astro)
      if (sanitizedName.match(/^IMG_36\d+$/)) {
        sanitizedName = sanitizedName.replace('_', '-');
      }
      
      return sanitizedName;
    };

    const optimizedName = getOptimizedFilename(fileName);
    const optimizedFolderName = `${folderName}_ottimizzate`;

    // Ottimizza in WebP
    console.log('🔄 Generando versione WebP...');
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Ottimizza in AVIF
    console.log('🔄 Generando versione AVIF...');
    const avifBuffer = await sharp(imageBuffer)
      .avif({ quality: 80 })
      .toBuffer();

    console.log(`📊 Dimensioni:
      Originale: ${(imageBuffer.length / 1024).toFixed(1)}KB
      WebP: ${(webpBuffer.length / 1024).toFixed(1)}KB (-${(100 - (webpBuffer.length/imageBuffer.length)*100).toFixed(1)}%)
      AVIF: ${(avifBuffer.length / 1024).toFixed(1)}KB (-${(100 - (avifBuffer.length/imageBuffer.length)*100).toFixed(1)}%)`);

    // Carica le versioni ottimizzate su TinaCloud
    const uploadToTina = async (buffer, filename, folder) => {
      const uploadPath = `uploads/optimized/${folder}/${filename}`;
      
      // Qui dovremmo usare l'API di TinaCMS per caricare il file
      // Per ora, restituiamo solo le informazioni
      console.log(`📤 Dovrei caricare: ${uploadPath}`);
      
      // TODO: Implementare upload effettivo tramite TinaCMS API
      // const uploadResponse = await tinaClient.media.upload({
      //   file: buffer,
      //   path: uploadPath
      // });
      
      return { path: uploadPath, size: buffer.length };
    };

    // Carica le versioni ottimizzate
    const webpUpload = await uploadToTina(webpBuffer, `${optimizedName}.webp`, optimizedFolderName);
    const avifUpload = await uploadToTina(avifBuffer, `${optimizedName}.avif`, optimizedFolderName);

    console.log('✅ Ottimizzazione completata!');

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Image optimized successfully',
        data: {
          original: { path: filePath, size: imageBuffer.length },
          optimized: {
            webp: webpUpload,
            avif: avifUpload
          },
          folder: optimizedFolderName
        }
      })
    };

  } catch (error) {
    console.error('❌ Errore durante ottimizzazione:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to optimize image',
        details: error.message 
      })
    };
  }
};