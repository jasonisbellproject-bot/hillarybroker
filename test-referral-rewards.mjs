import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testReferralRewards() {
  console.log('🔍 Testing Referral Rewards...\n');

  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, referral_code, referred_by')
      .limit(10);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log('👥 Users found:', users?.length || 0);
    
    // Get all referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*');

    if (referralsError) {
      console.error('❌ Error fetching referrals:', referralsError);
      return;
    }

    console.log('🔗 Referrals found:', referrals?.length || 0);
    
    // Get all rewards
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .eq('type', 'referral');

    if (rewardsError) {
      console.error('❌ Error fetching rewards:', rewardsError);
      return;
    }

    console.log('💰 Referral rewards found:', rewards?.length || 0);

    // Show detailed information
    if (users && users.length > 0) {
      console.log('\n📋 User Details:');
      users.forEach(user => {
        console.log(`- ${user.first_name} ${user.last_name} (${user.email})`);
        console.log(`  Referral Code: ${user.referral_code}`);
        console.log(`  Referred By: ${user.referred_by || 'None'}`);
      });
    }

    if (referrals && referrals.length > 0) {
      console.log('\n🔗 Referral Details:');
      referrals.forEach(ref => {
        console.log(`- Referrer: ${ref.referrer_id} -> Referred: ${ref.referred_id}`);
        console.log(`  Commission: $${ref.commission_earned}`);
        console.log(`  Status: ${ref.status}`);
      });
    }

    if (rewards && rewards.length > 0) {
      console.log('\n💰 Reward Details:');
      rewards.forEach(reward => {
        console.log(`- User: ${reward.user_id}`);
        console.log(`  Amount: $${reward.amount}`);
        console.log(`  Source: ${reward.source}`);
        console.log(`  Status: ${reward.status}`);
      });
    }

    // Test the referrals API logic
    if (users && users.length > 0) {
      const testUserId = users[0].id;
      console.log(`\n🧪 Testing referrals API for user: ${testUserId}`);
      
      // Get referrals for this user
      const { data: userReferrals, error: userReferralsError } = await supabase
        .from('referrals')
        .select('referred_id, created_at')
        .eq('referrer_id', testUserId)
        .eq('status', 'active');

      if (userReferralsError) {
        console.error('❌ Error fetching user referrals:', userReferralsError);
        return;
      }

      console.log(`User referrals: ${userReferrals?.length || 0}`);

      if (userReferrals && userReferrals.length > 0) {
        const referredIds = userReferrals.map(r => r.referred_id);
        
        // Get referred users
        const { data: referredUsers, error: referredUsersError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, created_at')
          .in('id', referredIds);

        if (referredUsersError) {
          console.error('❌ Error fetching referred users:', referredUsersError);
          return;
        }

        // Get rewards for this user
        const { data: userRewards, error: userRewardsError } = await supabase
          .from('rewards')
          .select('user_id, amount, source')
          .eq('type', 'referral')
          .eq('user_id', testUserId);

        if (userRewardsError) {
          console.error('❌ Error fetching user rewards:', userRewardsError);
          return;
        }

        console.log(`User rewards: ${userRewards?.length || 0}`);

        // Test the mapping logic
        const mappedUsers = referredUsers.map(user => {
          const referral = userReferrals.find(r => r.referred_id === user.id);
          let reward = 0;
          if (userRewards && Array.isArray(userRewards)) {
            const rewardObj = userRewards.find(rw => rw.source === `referral_${user.id}`);
            if (rewardObj) reward = rewardObj.amount;
          }
          
          const displayName = user.first_name && user.last_name 
            ? `${user.first_name} ${user.last_name}`
            : user.email;
            
          return {
            name: displayName,
            email: user.email,
            joinedAt: referral?.created_at || user.created_at,
            reward,
          };
        });

        console.log('\n📊 Mapped Results:');
        mappedUsers.forEach(user => {
          console.log(`- ${user.name} (${user.email})`);
          console.log(`  Reward: $${user.reward}`);
          console.log(`  Joined: ${new Date(user.joinedAt).toLocaleDateString()}`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testReferralRewards(); 