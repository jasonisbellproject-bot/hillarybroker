const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testDeposit() {
  console.log('🔍 Testing deposit functionality...\n');

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

    // Get cookies from login response
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('Cookies received:', cookies ? 'Yes' : 'No');

    // 2. Test wallet addresses endpoint
    console.log('\n2. Testing wallet addresses...');
    const walletResponse = await fetch('http://localhost:3000/api/wallet-addresses', {
      credentials: 'include',
      headers: {
        'Cookie': cookies || ''
      }
    });

    if (walletResponse.ok) {
      const walletData = await walletResponse.json();
      console.log('✅ Wallet addresses retrieved:', walletData.length, 'methods');
      walletData.forEach(wallet => {
        console.log(`   - ${wallet.name} (${wallet.type}): $${wallet.min_amount} - $${wallet.max_amount}`);
      });
    } else {
      console.log('❌ Failed to get wallet addresses');
    }

    // 3. Test deposit creation
    console.log('\n3. Testing deposit creation...');
    const depositResponse = await fetch('http://localhost:3000/api/deposits/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookies || ''
      },
      credentials: 'include',
      body: JSON.stringify({
        amount: 100,
        method: 'bitcoin',
        paymentDetails: {
          walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
        }
      })
    });

    if (depositResponse.ok) {
      const depositData = await depositResponse.json();
      console.log('✅ Deposit created successfully');
      console.log('   Deposit ID:', depositData.deposit.id);
      console.log('   Amount:', depositData.deposit.amount);
      console.log('   Status:', depositData.deposit.status);
    } else {
      const errorData = await depositResponse.json();
      console.log('❌ Deposit creation failed:', errorData.error);
    }

    // 4. Test deposits history
    console.log('\n4. Testing deposits history...');
    const depositsResponse = await fetch('http://localhost:3000/api/dashboard/deposits', {
      credentials: 'include',
      headers: {
        'Cookie': cookies || ''
      }
    });

    if (depositsResponse.ok) {
      const depositsData = await depositsResponse.json();
      console.log('✅ Deposits history retrieved');
      console.log('   Total deposits:', depositsData.deposits.length);
      console.log('   Stats:', depositsData.stats);
    } else {
      console.log('❌ Failed to get deposits history');
    }

    console.log('\n🎉 Deposit functionality test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDeposit(); 