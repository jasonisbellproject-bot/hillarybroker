require('dotenv').config();

async function testTransactionsAPI() {
  try {
    console.log('🧪 Testing transactions API...');
    
    const response = await fetch('http://localhost:3001/api/dashboard/transactions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Transactions API successful!');
      console.log('📋 Transactions returned:', data.length || 0);
    } else {
      console.log('❌ Transactions API failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing transactions API:', error.message);
  }
}

testTransactionsAPI(); 