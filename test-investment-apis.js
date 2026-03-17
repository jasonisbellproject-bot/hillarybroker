// Test script for investment APIs
const fetch = require('node-fetch');

// Mock environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://your-project.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'your-anon-key';

async function testInvestmentAPIs() {
  console.log('🧪 Testing Investment APIs...\n');

  const baseUrl = 'http://localhost:3000';

  try {
    // Test 1: Investment Plans API
    console.log('1. Testing /api/investment/plans...');
    const plansResponse = await fetch(`${baseUrl}/api/investment/plans`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('   Status:', plansResponse.status);
    if (plansResponse.ok) {
      const plansData = await plansResponse.json();
      console.log('   ✅ Success - Found', plansData.length, 'plans');
      if (plansData.length > 0) {
        console.log('   Sample plan:', plansData[0]);
      }
    } else {
      const errorData = await plansResponse.text();
      console.log('   ❌ Error:', errorData);
    }

    // Test 2: User Investments API
    console.log('\n2. Testing /api/investment/user-investments...');
    const investmentsResponse = await fetch(`${baseUrl}/api/investment/user-investments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('   Status:', investmentsResponse.status);
    if (investmentsResponse.ok) {
      const investmentsData = await investmentsResponse.json();
      console.log('   ✅ Success - Found', investmentsData.investments?.length || 0, 'investments');
      console.log('   Stats:', investmentsData.stats);
    } else {
      const errorData = await investmentsResponse.text();
      console.log('   ❌ Error:', errorData);
    }

    // Test 3: Dashboard Investments API
    console.log('\n3. Testing /api/dashboard/investments...');
    const dashboardResponse = await fetch(`${baseUrl}/api/dashboard/investments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('   Status:', dashboardResponse.status);
    if (dashboardResponse.ok) {
      const dashboardData = await dashboardResponse.json();
      console.log('   ✅ Success - Found', dashboardData.investments?.length || 0, 'investments');
      console.log('   Summary:', dashboardData.summary);
    } else {
      const errorData = await dashboardResponse.text();
      console.log('   ❌ Error:', errorData);
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
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
    await testInvestmentAPIs();
  }
}

main(); 