require('dotenv').config();

async function testLandingPage() {
  try {
    console.log('🧪 Testing landing page...');
    
    const response = await fetch('http://localhost:3001/', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });

    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Landing page is accessible!');
      console.log('💡 Check the browser at http://localhost:3001/');
    } else {
      console.log('❌ Landing page failed:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error testing landing page:', error.message);
  }
}

testLandingPage();
