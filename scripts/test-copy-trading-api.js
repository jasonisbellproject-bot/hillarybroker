require('dotenv').config();

async function testCopyTradingAPI() {
  try {
    console.log('🧪 Testing copy trading API endpoints...\n');
    
    // Test 1: Get copy traders
    console.log('📋 Testing GET /api/copy-trading/traders...');
    const tradersResponse = await fetch('http://localhost:3001/api/copy-trading/traders?limit=5');
    console.log('Status:', tradersResponse.status);
    
    if (tradersResponse.ok) {
      const tradersData = await tradersResponse.json();
      console.log('✅ Copy traders API working!');
      console.log('📊 Traders returned:', tradersData.length);
      if (tradersData.length > 0) {
        console.log('📋 First trader:', {
          id: tradersData[0].id,
          display_name: tradersData[0].display_name,
          total_followers: tradersData[0].total_followers,
          success_rate: tradersData[0].success_rate
        });
      }
    } else {
      const errorData = await tradersResponse.json();
      console.log('❌ Copy traders API failed:', errorData.error);
    }
    
    console.log('\n📋 Testing GET /api/copy-trading/subscriptions...');
    const subscriptionsResponse = await fetch('http://localhost:3001/api/copy-trading/subscriptions');
    console.log('Status:', subscriptionsResponse.status);
    
    if (subscriptionsResponse.ok) {
      const subscriptionsData = await subscriptionsResponse.json();
      console.log('✅ Subscriptions API working!');
      console.log('📊 Subscriptions returned:', subscriptionsData.length);
    } else {
      const errorData = await subscriptionsResponse.json();
      console.log('❌ Subscriptions API failed:', errorData.error);
    }
    
    console.log('\n🎉 Copy trading API test completed!');
    
  } catch (error) {
    console.error('❌ Error testing copy trading API:', error.message);
  }
}

testCopyTradingAPI();
