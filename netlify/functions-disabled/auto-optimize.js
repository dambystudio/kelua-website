const sharp = require('sharp');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Abilita CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    console.log('🔄 Webhook ricevuto per ottimizzazione automatica');
    
    const payload = JSON.parse(event.body);
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Verifica se è un evento di upload media
    if (!payload.event || payload.event !== 'media.upload') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Event ignored' })
      };
    }

    const { file } = payload.data;
    if (!file || !file.path) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file information' })
      };
    }

    const filePath = file.path;
    const fileName = file.filename;
    
    console.log(`📁 File caricato: ${fileName} in ${filePath}`);

    // Controlla se è un'immagine
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.tiff', '.bmp'];
    const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
    
    if (!imageExtensions.includes(fileExtension)) {
      console.log(`⏭️ ${fileName} non è un'immagine, skip`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Not an image, skipped' })
      };
    }

    // Estrai cartella dalla path
    const pathParts = filePath.split('/');
    const folderName = pathParts[pathParts.length - 2];
    
    // Verifica se è una cartella da ottimizzare
    const foldersToOptimize = [
      'Foto_Accessori', 'Foto_Camicie', 'Foto_Felpe', 'Foto_Giubbotti',
      'Foto_Jeans', 'Foto_Maglieria', 'Foto_Negozio', 'Foto_Pantaloni'
    ];
    
    if (!foldersToOptimize.includes(folderName)) {
      console.log(`⏭️ Cartella ${folderName} non richiede ottimizzazione`);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Folder does not require optimization' })
      };
    }

    console.log(`🖼️ Inizio ottimizzazione: ${fileName} → ${folderName}_ottimizzate`);

    // Costruisci URL per scaricare l'immagine da TinaCloud
    const clientId = process.env.TINA_CLIENT_ID;
    const imageUrl = `https://assets.tina.io/${clientId}/${filePath}`;
    
    console.log(`📥 Scaricando da: ${imageUrl}`);
    
    // Scarica l'immagine originale
    const response = await fetch(imageUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.TINA_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }
    
    const imageBuffer = await response.buffer();
    console.log(`✅ Scaricata: ${(imageBuffer.length / 1024).toFixed(1)}KB`);

    // Genera nome ottimizzato (stessa logica di OptimizedImage.astro)
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
      
      // Pattern specifici
      if (sanitizedName.match(/^IMG_36\d+$/)) {
        sanitizedName = sanitizedName.replace('_', '-');
      }
      
      return sanitizedName;
    };

    const optimizedName = getOptimizedFilename(fileName);
    const optimizedFolderName = `${folderName}_ottimizzate`;

    // Ottimizza in WebP
    console.log('🔄 Generando WebP...');
    const webpBuffer = await sharp(imageBuffer)
      .webp({ quality: 80 })
      .toBuffer();

    // Ottimizza in AVIF  
    console.log('🔄 Generando AVIF...');
    const avifBuffer = await sharp(imageBuffer)
      .avif({ quality: 80 })
      .toBuffer();

    console.log(`📊 Risultati ottimizzazione:
      - Originale: ${(imageBuffer.length / 1024).toFixed(1)}KB
      - WebP: ${(webpBuffer.length / 1024).toFixed(1)}KB (-${(100 - (webpBuffer.length/imageBuffer.length)*100).toFixed(1)}%)
      - AVIF: ${(avifBuffer.length / 1024).toFixed(1)}KB (-${(100 - (avifBuffer.length/imageBuffer.length)*100).toFixed(1)}%)`);

    // Carica le versioni ottimizzate su TinaCloud tramite API
    const uploadToTinaCloud = async (buffer, filename, folder) => {
      const uploadPath = `uploads/optimized/${folder}/${filename}`;
      
      // Crea FormData per l'upload
      const FormData = require('form-data');
      const form = new FormData();
      form.append('file', buffer, filename);
      form.append('directory', `uploads/optimized/${folder}`);
      
      const uploadResponse = await fetch(`https://api.tina.io/uploads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TINA_TOKEN}`,
          ...form.getHeaders()
        },
        body: form
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.text();
        throw new Error(`Upload failed: ${uploadResponse.status} ${error}`);
      }
      
      const result = await uploadResponse.json();
      console.log(`📤 Caricato: ${uploadPath}`);
      return result;
    };

    // Carica entrambe le versioni ottimizzate
    console.log('📤 Caricamento versioni ottimizzate...');
    
    const webpUpload = await uploadToTinaCloud(webpBuffer, `${optimizedName}.webp`, optimizedFolderName);
    const avifUpload = await uploadToTinaCloud(avifBuffer, `${optimizedName}.avif`, optimizedFolderName);

    console.log('✅ Ottimizzazione automatica completata!');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Image optimized and uploaded successfully',
        data: {
          original: {
            path: filePath,
            size: imageBuffer.length
          },
          optimized: {
            webp: {
              path: webpUpload.url,
              size: webpBuffer.length
            },
            avif: {
              path: avifUpload.url,
              size: avifBuffer.length
            }
          },
          folder: optimizedFolderName,
          savings: {
            webp: `${(100 - (webpBuffer.length/imageBuffer.length)*100).toFixed(1)}%`,
            avif: `${(100 - (avifBuffer.length/imageBuffer.length)*100).toFixed(1)}%`
          }
        }
      })
    };

  } catch (error) {
    console.error('❌ Errore durante ottimizzazione automatica:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to optimize image',
        details: error.message 
      })
    };
  }
};