import fetch from 'node-fetch';

async function testAPIError() {
  console.log('🔍 Testing API Error Details...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test the investment API
    console.log('Testing /api/investment/user-investments...');
    const response = await fetch(`${baseUrl}/api/investment/user-investments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const responseText = await response.text();
    console.log('Response Body:', responseText);

    if (response.ok) {
      console.log('✅ API is working');
    } else {
      console.log('❌ API Error:', response.status, response.statusText);
    }

  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000');
    if (response.ok) {
      console.log('✅ Server is running on http://localhost:3000');
      return true;
    }
  } catch (error) {
    console.log('❌ Server not running on http://localhost:3000');
    console.log('Please start the development server with: npm run dev');
    return false;
  }
}

async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await testAPIError();
  }
}

main(); 