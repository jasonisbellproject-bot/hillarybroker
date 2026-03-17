import fetch from 'node-fetch';

async function testSettingsAPI() {
  console.log('Testing Admin Settings API...\n');

  try {
    // Test GET request to fetch settings
    console.log('1. Testing GET /api/admin/settings...');
    const getResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('✅ GET request successful');
      console.log('Settings loaded:', JSON.stringify(getData.settings, null, 2));
    } else {
      console.log('❌ GET request failed:', getResponse.status, getResponse.statusText);
    }

    console.log('\n2. Testing POST /api/admin/settings...');
    
    // Test POST request to save settings
    const testSettings = {
      platform_name: "Test Platform",
      platform_url: "https://testplatform.com",
      maintenance_mode: true,
      registration_enabled: false,
      min_deposit: 100,
      max_deposit: 100000,
      min_withdrawal: 200,
      max_withdrawal: 50000,
      withdrawal_fee: 10,
      daily_withdrawal_limit: 20000,
      two_factor_required: false,
      kyc_required: false,
      session_timeout: 60,
      max_login_attempts: 10,
      email_notifications: false,
      sms_notifications: true,
      push_notifications: false,
      default_investment_plan: "premium",
      max_active_investments: 20,
      auto_reinvest: true,
    };

    const postResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSettings),
    });

    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log('✅ POST request successful');
      console.log('Response:', JSON.stringify(postData, null, 2));
    } else {
      const errorData = await postResponse.json();
      console.log('❌ POST request failed:', postResponse.status, postResponse.statusText);
      console.log('Error details:', errorData);
    }

    console.log('\n3. Testing validation...');
    
    // Test validation with invalid data
    const invalidSettings = {
      platform_name: "", // Empty name should fail validation
      platform_url: "https://testplatform.com",
      min_deposit: 1000,
      max_deposit: 500, // Min > Max should fail validation
    };

    const validationResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidSettings),
    });

    if (validationResponse.status === 400) {
      const validationData = await validationResponse.json();
      console.log('✅ Validation working correctly');
      console.log('Validation error:', validationData.error);
    } else {
      console.log('❌ Validation not working as expected');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSettingsAPI(); 