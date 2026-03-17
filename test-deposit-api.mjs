import fetch from 'node-fetch';

async function testDepositAPI() {
  console.log('🧪 Testing Deposit API...\n');

  try {
    // Test the deposit creation API
    console.log('1. Testing POST /api/deposits/create...');
    
    const testDeposit = {
      amount: 100,
      method: 'card',
      transactionHash: 'test_tx_hash_123',
      paymentProof: '',
      walletAddress: 'test_wallet_address'
    };

    const response = await fetch('http://localhost:3000/api/deposits/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testDeposit),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Deposit API test successful!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.log('❌ Deposit API test failed:', response.status, response.statusText);
      console.log('Error:', JSON.stringify(errorData, null, 2));
    }

    // Test the admin settings API
    console.log('\n2. Testing GET /api/admin/settings...');
    
    const settingsResponse = await fetch('http://localhost:3000/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (settingsResponse.ok) {
      const settingsData = await settingsResponse.json();
      console.log('✅ Settings API test successful!');
      console.log('Settings:', JSON.stringify(settingsData.settings, null, 2));
    } else {
      console.log('❌ Settings API test failed:', settingsResponse.status, settingsResponse.statusText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDepositAPI(); 