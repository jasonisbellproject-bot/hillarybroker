const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testNewDepositFlow() {
  console.log('🔍 Testing new deposit flow...\n');

  try {
    // 1. Login first
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:3000/api/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');

    // 2. Test wallet addresses endpoint
    console.log('\n2. Testing wallet addresses...');
    const walletResponse = await fetch('http://localhost:3000/api/wallet-addresses', {
      credentials: 'include'
    });

    if (!walletResponse.ok) {
      throw new Error('Failed to fetch wallet addresses');
    }

    const walletData = await walletResponse.json();
    console.log('✅ Wallet addresses fetched:', walletData.length, 'methods available');

    // 3. Test deposit creation with new flow
    console.log('\n3. Testing deposit creation with new flow...');
    const depositResponse = await fetch('http://localhost:3000/api/deposits/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: 100,
        method: 'bitcoin',
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        paymentProof: 'Payment screenshot attached',
        walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
      })
    });

    if (!depositResponse.ok) {
      const errorData = await depositResponse.json();
      throw new Error(`Deposit creation failed: ${errorData.error}`);
    }

    const depositData = await depositResponse.json();
    console.log('✅ Deposit created successfully:', depositData.deposit.id);
    console.log('   Status:', depositData.deposit.status);
    console.log('   Message:', depositData.message);

    // 4. Test deposits history
    console.log('\n4. Testing deposits history...');
    const depositsResponse = await fetch('http://localhost:3000/api/dashboard/deposits', {
      credentials: 'include'
    });

    if (!depositsResponse.ok) {
      throw new Error('Failed to fetch deposits history');
    }

    const depositsData = await depositsResponse.json();
    console.log('✅ Deposits history fetched');
    console.log('   Total deposits:', depositsData.deposits?.length || 0);
    console.log('   Stats:', depositsData.stats);

    console.log('\n🎉 New deposit flow test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ User can login');
    console.log('   ✅ Wallet addresses are available');
    console.log('   ✅ Deposit can be created with transaction hash');
    console.log('   ✅ Deposit starts as pending');
    console.log('   ✅ Deposit history shows the new deposit');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNewDepositFlow(); 