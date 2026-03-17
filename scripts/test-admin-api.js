require('dotenv').config();

async function testAdminAPI() {
  try {
    console.log('🧪 Testing admin login API...');
    
    const response = await fetch('http://localhost:3001/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'aaasssaaa'
      }),
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Admin login successful!');
      console.log('🎉 You can now access the admin panel');
    } else {
      console.log('❌ Admin login failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin API:', error.message);
  }
}

testAdminAPI();
