require('dotenv').config();

async function testCopyTradingNullUsers() {
  try {
    console.log('🧪 Testing copy trading API for null user issues...\n');
    
    // Test the API endpoint
    console.log('📋 Testing API endpoint...');
    const apiResponse = await fetch('http://localhost:3001/api/copy-trading/traders?limit=10');
    console.log('API status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log('✅ API endpoint working');
      console.log('📊 Traders returned:', data.length);
      
      // Check for null users
      const tradersWithNullUsers = data.filter(trader => !trader.users);
      const tradersWithUsers = data.filter(trader => trader.users);
      
      console.log('\n📋 User data analysis:');
      console.log(`- Traders with user data: ${tradersWithUsers.length}`);
      console.log(`- Traders without user data: ${tradersWithNullUsers.length}`);
      
      if (tradersWithNullUsers.length > 0) {
        console.log('\n⚠️  Traders without user data:');
        tradersWithNullUsers.forEach(trader => {
          console.log(`  - ${trader.display_name} (ID: ${trader.id})`);
        });
      }
      
      if (tradersWithUsers.length > 0) {
        console.log('\n✅ Sample trader with user data:');
        const sampleTrader = tradersWithUsers[0];
        console.log(`  - Name: ${sampleTrader.display_name}`);
        console.log(`  - User: ${sampleTrader.users.first_name} ${sampleTrader.users.last_name}`);
        console.log(`  - Email: ${sampleTrader.users.email}`);
      }
      
    } else {
      const errorData = await apiResponse.json();
      console.log('❌ API endpoint failed:', errorData.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing copy trading null users:', error.message);
  }
}

testCopyTradingNullUsers();
