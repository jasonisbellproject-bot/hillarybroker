require('dotenv').config();

async function testAdminStats() {
  try {
    console.log('🧪 Testing admin stats API...');
    
    const response = await fetch('http://localhost:3001/api/admin/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Admin stats successful!');
      console.log('👥 Total Users:', data.totalUsers);
      console.log('📈 Active Users:', data.activeUsers);
      console.log('💰 Total Staked:', data.totalStaked);
      console.log('📊 Monthly Growth:', data.monthlyGrowth + '%');
    } else {
      console.log('❌ Admin stats failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin stats:', error.message);
  }
}

testAdminStats();
