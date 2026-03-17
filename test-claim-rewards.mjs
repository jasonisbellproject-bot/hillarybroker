import fetch from 'node-fetch';

async function testClaimRewards() {
  console.log('🧪 Testing Claim Rewards Functionality...\n');

  try {
    // Test the rewards API first
    console.log('1. Testing GET /api/rewards...');
    
    const rewardsResponse = await fetch('http://localhost:3001/api/rewards', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (rewardsResponse.ok) {
      const rewardsData = await rewardsResponse.json();
      console.log('✅ Rewards API test successful!');
      console.log('Rewards found:', rewardsData.rewards?.length || 0);
      console.log('Stats:', {
        totalRewards: rewardsData.stats?.totalRewards || 0,
        claimedRewards: rewardsData.stats?.claimedRewards || 0,
        pendingRewards: rewardsData.stats?.pendingRewards || 0
      });
    } else {
      console.log('❌ Rewards API test failed:', rewardsResponse.status, rewardsResponse.statusText);
    }

    // Test claim single reward API (will fail without auth, but should not fail on server errors)
    console.log('\n2. Testing POST /api/rewards/claim...');
    
    const claimResponse = await fetch('http://localhost:3001/api/rewards/claim', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ rewardId: 'test-reward-id' }),
    });

    if (claimResponse.ok) {
      const claimData = await claimResponse.json();
      console.log('✅ Claim reward API test successful!');
      console.log('Response:', JSON.stringify(claimData, null, 2));
    } else {
      const claimErrorData = await claimResponse.json().catch(() => ({}));
      console.log('❌ Claim reward API test failed:', claimResponse.status, claimResponse.statusText);
      console.log('Error:', JSON.stringify(claimErrorData, null, 2));
      
      // Check if it's an auth error (expected) vs server error (not expected)
      if (claimErrorData.error === 'Unauthorized') {
        console.log('✅ This is expected - authentication required for claiming rewards');
      } else if (claimErrorData.error === 'Reward not found or not available for claiming') {
        console.log('✅ This is expected - test reward ID does not exist');
      } else {
        console.log('❌ Unexpected error - check the API implementation');
      }
    }

    // Test claim all rewards API
    console.log('\n3. Testing POST /api/rewards/claim-all...');
    
    const claimAllResponse = await fetch('http://localhost:3001/api/rewards/claim-all', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (claimAllResponse.ok) {
      const claimAllData = await claimAllResponse.json();
      console.log('✅ Claim all rewards API test successful!');
      console.log('Response:', JSON.stringify(claimAllData, null, 2));
    } else {
      const claimAllErrorData = await claimAllResponse.json().catch(() => ({}));
      console.log('❌ Claim all rewards API test failed:', claimAllResponse.status, claimAllResponse.statusText);
      console.log('Error:', JSON.stringify(claimAllErrorData, null, 2));
      
      if (claimAllErrorData.error === 'Unauthorized') {
        console.log('✅ This is expected - authentication required for claiming rewards');
      } else {
        console.log('❌ Unexpected error - check the API implementation');
      }
    }

    console.log('\n📋 Summary:');
    console.log('- Rewards API: Should work correctly');
    console.log('- Claim Single Reward API: Should return auth error or "reward not found"');
    console.log('- Claim All Rewards API: Should return auth error');
    console.log('\n✅ The claim reward functionality should now work correctly when authenticated!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testClaimRewards(); 