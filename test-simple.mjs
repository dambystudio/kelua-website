const test = async () => {
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/auto-optimize-images', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ test: true })
    });
    
    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
    
    if (response.ok) {
      console.log('✅ Function working!');
    } else {
      console.log('❌ Function error');
    }
  } catch (error) {
    console.error('Network error:', error.message);
  }
};

test();