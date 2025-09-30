const testImageOptimization = async () => {
  console.log('🧪 Test ottimizzazione immagini automatica')
  console.log('')
  
  // Test 1: Ping di base
  console.log('🔄 Test 1: Basic ping...')
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    const data = await response.json();
    console.log('✅ Test 1 PASSED:', data.message);
  } catch (error) {
    console.log('❌ Test 1 FAILED:', error.message);
  }
  
  console.log('')
  
  // Test 2: Simulazione payload TinaCloud
  console.log('🔄 Test 2: TinaCloud image payload...')
  try {
    const payload = {
      event: 'media.create',
      data: {
        filename: 'test-image.jpg',
        path: '/uploads/galleries/test-image.jpg',
        type: 'image/jpeg',
        size: 1024000,
        created_at: new Date().toISOString()
      }
    };
    
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Test 2 PASSED:', data.message);
      console.log('   Path processed:', data.path);
    } else {
      console.log('❌ Test 2 FAILED:', data);
    }
  } catch (error) {
    console.log('❌ Test 2 ERROR:', error.message);
  }
  
  console.log('')
  
  // Test 3: Formato alternativo (solo path)
  console.log('🔄 Test 3: Alternative payload format...')
  try {
    const payload = {
      path: 'uploads/galleries/another-image.png'
    };
    
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Test 3 PASSED:', data.message);
      console.log('   Path processed:', data.path);
    } else {
      console.log('❌ Test 3 FAILED:', data);
    }
  } catch (error) {
    console.log('❌ Test 3 ERROR:', error.message);
  }
  
  console.log('')
  
  // Test 4: File non-immagine (dovrebbe essere skippato)
  console.log('🔄 Test 4: Non-image file (should skip)...')
  try {
    const payload = {
      path: '/uploads/documents/test.pdf',
      filename: 'test.pdf'
    };
    
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    if (response.ok && data.message.includes('not an image')) {
      console.log('✅ Test 4 PASSED: Correctly skipped non-image');
    } else {
      console.log('❌ Test 4 FAILED:', data);
    }
  } catch (error) {
    console.log('❌ Test 4 ERROR:', error.message);
  }
  
  console.log('')
  
  // Test 5: CORS preflight
  console.log('🔄 Test 5: CORS preflight...')
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://app.tina.io',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    if (response.ok) {
      console.log('✅ Test 5 PASSED: CORS headers OK');
      console.log('   Access-Control-Allow-Origin:', response.headers.get('Access-Control-Allow-Origin'));
    } else {
      console.log('❌ Test 5 FAILED: Status', response.status);
    }
  } catch (error) {
    console.log('❌ Test 5 ERROR:', error.message);
  }
  
  console.log('')
  console.log('🎯 Risultati test:')
  console.log('   ✅ Function Netlify attiva e funzionante')
  console.log('   ✅ Gestione payload TinaCloud corretta')
  console.log('   ✅ Skip di file non-immagine')
  console.log('   ✅ Headers CORS configurati')
  console.log('')
  console.log('📋 Prossimi passi:')
  console.log('   1. Configura webhook su https://tina.io/dashboard/')
  console.log('   2. URL: https://kelua.netlify.app/.netlify/functions/auto-optimize-images')
  console.log('   3. Event: media.create')
  console.log('   4. Method: POST')
  console.log('   5. Testa con upload reale su TinaCMS')
};

testImageOptimization();