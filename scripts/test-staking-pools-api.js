require('dotenv').config();

async function testStakingPoolsAPI() {
  try {
    console.log('🧪 Testing staking pools API...');
    
    const response = await fetch('http://localhost:3001/api/staking/pools', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Staking pools API successful!');
      console.log('📋 Pools returned:', data.length || 0);
      if (data.length > 0) {
        console.log('📋 First pool:', {
          id: data[0].id,
          name: data[0].name,
          apy: data[0].apy,
          min_stake: data[0].min_stake,
          max_stake: data[0].max_stake,
          total_staked: data[0].total_staked
        });
      }
    } else {
      console.log('❌ Staking pools API failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing staking pools API:', error.message);
  }
}

testStakingPoolsAPI();
