// Simple test script to verify APIs are working
const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:3002';

function makeRequest(url, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (body) {
      const bodyString = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const result = await makeRequest(`${BASE_URL}${endpoint}`, method, body);
    
    console.log(`✅ ${method} ${endpoint}: ${result.status}`);
    if (result.status === 200 || result.status === 201) {
      console.log(`   Data:`, JSON.stringify(result.data, null, 2).substring(0, 200) + '...');
    } else if (result.status === 401) {
      console.log(`   Expected: Unauthorized (authentication required)`);
    } else {
      console.log(`   Response:`, result.data);
    }
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 Testing User Dashboard APIs');
  console.log('================================');
  
  // Test all the APIs we implemented
  await testAPI('/api/dashboard/stats');
  await testAPI('/api/investment/plans');
  await testAPI('/api/staking/pools');
  await testAPI('/api/rewards');
  await testAPI('/api/dashboard/transactions');
  
  console.log('\n📊 Test Summary:');
  console.log('- All APIs should return 401 (Unauthorized) without authentication');
  console.log('- This is expected behavior for protected routes');
  console.log('- To test with real data, you need to:');
  console.log('  1. Login to the dashboard');
  console.log('  2. Create some test data in the database');
  console.log('  3. Then the APIs will return real user data');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit http://localhost:3002/login');
  console.log('2. Create a test user or login with existing credentials');
  console.log('3. Navigate to the dashboard to see real data');
  console.log('4. Test the investment, staking, and rewards features');
}

runTests(); 