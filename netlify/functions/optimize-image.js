const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

exports.handler = async (event, context) => {
  // Verifica che sia una richiesta POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { imagePath, imageData } = body;

    if (!imagePath || !imageData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing imagePath or imageData' })
      };
    }

    // Decodifica l'immagine base64
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    // Estrai informazioni dal percorso
    const pathParts = imagePath.split('/');
    const filename = pathParts[pathParts.length - 1];
    const folderName = pathParts[pathParts.length - 2];
    
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
      
      // Logica specifica per IMG_36xx
      if (sanitizedName.match(/^IMG_36\d+$/)) {
        sanitizedName = sanitizedName.replace('_', '-');
      }
      
      return sanitizedName;
    };

    const optimizedName = getOptimizedFilename(filename);
    const optimizedFolder = `${folderName}_ottimizzate`;

    // Ottimizza l'immagine
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    const avifBuffer = await sharp(imageBuffer)
      .avif({ quality: 80 })
      .toBuffer();

    // Qui dovresti implementare l'upload su TinaCloud/Netlify
    // Per ora restituiamo solo i percorsi ottimizzati
    const results = {
      original: imagePath,
      optimized: {
        webp: `/uploads/optimized/${optimizedFolder}/${optimizedName}.webp`,
        avif: `/uploads/optimized/${optimizedFolder}/${optimizedName}.avif`
      },
      sizes: {
        original: imageBuffer.length,
        webp: webpBuffer.length,
        avif: avifBuffer.length
      }
    };

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Image optimized successfully',
        data: results
      })
    };

  } catch (error) {
    console.error('Error optimizing image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to optimize image',
        details: error.message 
      })
    };
  }
};