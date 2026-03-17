require('dotenv').config();

async function testAdminDashboard() {
  try {
    console.log('🧪 Testing admin dashboard page...');
    
    const response = await fetch('http://localhost:3001/admin', {
      method: 'GET',
      headers: {
        'Content-Type': 'text/html',
      },
    });

    console.log('📊 Response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Admin dashboard page is accessible!');
      console.log('💡 Check the browser at http://localhost:3001/admin');
      console.log('💡 Make sure you are logged in as admin');
    } else {
      console.log('❌ Admin dashboard page failed:', response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin dashboard:', error.message);
  }
}

testAdminDashboard();
