import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testReferralAPI() {
  console.log('🧪 Testing Referral API...\n');

  try {
    // Get all users to find one with referrals
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(10);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return;
    }

    console.log(`👥 Found ${users?.length || 0} users`);

    // Find a user with referrals
    for (const user of users || []) {
      console.log(`\n🔍 Testing user: ${user.first_name} ${user.last_name} (${user.email})`);
      
      // Get referrals for this user
      const { data: referrals, error: referralsError } = await supabase
        .from('referrals')
        .select('referred_id, created_at, commission_earned')
        .eq('referrer_id', user.id)
        .eq('status', 'active');

      if (referralsError) {
        console.error('❌ Error fetching referrals:', referralsError);
        continue;
      }

      console.log(`📋 User has ${referrals?.length || 0} referrals`);

      if (referrals && referrals.length > 0) {
        const referredIds = referrals.map(r => r.referred_id);
        
        // Get referred users
        const { data: referredUsers, error: referredUsersError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name, created_at')
          .in('id', referredIds);

        if (referredUsersError) {
          console.error('❌ Error fetching referred users:', referredUsersError);
          continue;
        }

        // Test the mapping logic
        const mappedUsers = referredUsers.map(user => {
          const referral = referrals.find(r => r.referred_id === user.id);
          let reward = 0;
          if (referral) {
            reward = referral.commission_earned || 0;
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

        // Calculate total earnings
        const totalEarnings = mappedUsers.reduce((sum, user) => sum + user.reward, 0);
        console.log(`\n💰 Total Referral Earnings: $${totalEarnings}`);
        
        break; // Found a user with referrals, stop testing
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testReferralAPI(); 