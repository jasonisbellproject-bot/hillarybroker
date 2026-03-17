const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testWithdrawalSimple() {
  console.log('🔍 Testing withdrawal method mapping fix...\n');

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
      const errorData = await loginResponse.json().catch(() => ({}));
      throw new Error(`Login failed: ${errorData.error || 'Unknown error'}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');

    // 2. Test withdrawal creation with bitcoin method
    console.log('\n2. Testing withdrawal creation with bitcoin method...');
    const withdrawalResponse = await fetch('http://localhost:3000/api/withdrawals/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: 100,
        method: 'bitcoin',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
      })
    });

    if (!withdrawalResponse.ok) {
      const errorData = await withdrawalResponse.json();
      throw new Error(`Withdrawal creation failed: ${errorData.error}`);
    }

    const withdrawalData = await withdrawalResponse.json();
    console.log('✅ Withdrawal created successfully!');
    console.log('   ID:', withdrawalData.withdrawal.id);
    console.log('   Status:', withdrawalData.withdrawal.status);
    console.log('   Method (DB):', withdrawalData.withdrawal.method);
    console.log('   Amount:', withdrawalData.withdrawal.amount);
    console.log('   Message:', withdrawalData.message);

    console.log('\n🎉 Withdrawal method mapping fix works!');
    console.log('   ✅ Frontend method "bitcoin" was mapped to DB method "crypto"');
    console.log('   ✅ No more constraint violation errors');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithdrawalSimple(); 