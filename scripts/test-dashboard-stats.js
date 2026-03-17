const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testDashboardStats() {
  try {
    console.log('🔍 Testing Dashboard Stats API...\n');

    // Test the dashboard stats endpoint
    const response = await fetch('http://localhost:3000/api/dashboard/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Note: This won't work without proper authentication cookies
      // This is just to test the endpoint structure
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Dashboard Stats Response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const errorText = await response.text();
      console.log('❌ Error response:', errorText);
    }

  } catch (error) {
    console.error('❌ Error testing dashboard stats:', error);
  }
}

testDashboardStats(); 