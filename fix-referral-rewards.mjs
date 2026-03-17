import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixReferralRewards() {
  console.log('🔧 Fixing Referral Rewards...\n');

  try {
    // Get all referrals
    const { data: referrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('status', 'active');

    if (referralsError) {
      console.error('❌ Error fetching referrals:', referralsError);
      return;
    }

    console.log(`📋 Found ${referrals?.length || 0} active referrals`);

    // Get all existing referral rewards
    const { data: existingRewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .eq('type', 'referral');

    if (rewardsError) {
      console.error('❌ Error fetching rewards:', rewardsError);
      return;
    }

    console.log(`💰 Found ${existingRewards?.length || 0} existing referral rewards`);

    // Process each referral
    for (const referral of referrals || []) {
      console.log(`\n🔗 Processing referral: ${referral.referrer_id} -> ${referral.referred_id}`);
      
      // Check if reward already exists for this referral
      const existingReward = existingRewards?.find(r => 
        r.user_id === referral.referrer_id && 
        r.source === `referral_${referral.referred_id}`
      );

      if (existingReward) {
        console.log(`✅ Reward already exists: $${existingReward.amount} (${existingReward.status})`);
        continue;
      }

      // Check if there's a reward with undefined source for this referrer
      const undefinedReward = existingRewards?.find(r => 
        r.user_id === referral.referrer_id && 
        !r.source
      );

      if (undefinedReward) {
        console.log(`🔄 Updating existing reward with undefined source...`);
        
        // Update the existing reward
        const { error: updateError } = await supabase
          .from('rewards')
          .update({
            source: `referral_${referral.referred_id}`,
            description: `Referral bonus for new user signup`
          })
          .eq('id', undefinedReward.id);

        if (updateError) {
          console.error(`❌ Error updating reward:`, updateError);
        } else {
          console.log(`✅ Updated reward: $${undefinedReward.amount}`);
        }
      } else {
        console.log(`➕ Creating new reward: $${referral.commission_earned}`);
        
        // Create new reward
        const { error: insertError } = await supabase
          .from('rewards')
          .insert({
            user_id: referral.referrer_id,
            type: 'referral',
            amount: referral.commission_earned,
            source: `referral_${referral.referred_id}`,
            description: 'Referral bonus for new user signup',
            status: 'pending'
          });

        if (insertError) {
          console.error(`❌ Error creating reward:`, insertError);
        } else {
          console.log(`✅ Created reward: $${referral.commission_earned}`);
        }
      }
    }

    console.log('\n✅ Referral rewards fix completed!');

    // Verify the fix
    const { data: updatedRewards, error: verifyError } = await supabase
      .from('rewards')
      .select('*')
      .eq('type', 'referral');

    if (verifyError) {
      console.error('❌ Error verifying rewards:', verifyError);
      return;
    }

    console.log(`\n📊 Final count: ${updatedRewards?.length || 0} referral rewards`);
    
    if (updatedRewards && updatedRewards.length > 0) {
      console.log('\n📋 Updated Rewards:');
      updatedRewards.forEach(reward => {
        console.log(`- User: ${reward.user_id}`);
        console.log(`  Amount: $${reward.amount}`);
        console.log(`  Source: ${reward.source || 'undefined'}`);
        console.log(`  Status: ${reward.status}`);
      });
    }

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixReferralRewards(); 