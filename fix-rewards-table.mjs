import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixRewardsTable() {
  console.log('🔧 Fixing Rewards Table...\n');

  try {
    // Add source column to rewards table
    console.log('📝 Adding source column to rewards table...');
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.rewards 
        ADD COLUMN IF NOT EXISTS source TEXT;
      `
    });

    if (alterError) {
      console.error('❌ Error adding source column:', alterError);
      return;
    }

    console.log('✅ Source column added successfully');

    // Update existing rewards
    console.log('\n🔄 Updating existing rewards...');
    
    // Update bonus rewards
    const { error: bonusUpdateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.rewards 
        SET source = 'signup' 
        WHERE type = 'bonus' AND source IS NULL;
      `
    });

    if (bonusUpdateError) {
      console.error('❌ Error updating bonus rewards:', bonusUpdateError);
    } else {
      console.log('✅ Updated bonus rewards');
    }

    // Update referral rewards
    const { error: referralUpdateError } = await supabase.rpc('exec_sql', {
      sql: `
        UPDATE public.rewards 
        SET source = 'referral_bonus' 
        WHERE type = 'referral' AND source IS NULL;
      `
    });

    if (referralUpdateError) {
      console.error('❌ Error updating referral rewards:', referralUpdateError);
    } else {
      console.log('✅ Updated referral rewards');
    }

    // Now create proper referral rewards
    console.log('\n💰 Creating proper referral rewards...');
    
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

    // Process each referral
    for (const referral of referrals || []) {
      console.log(`\n🔗 Processing referral: ${referral.referrer_id} -> ${referral.referred_id}`);
      
      // Check if reward already exists for this referral
      const { data: existingReward, error: checkError } = await supabase
        .from('rewards')
        .select('*')
        .eq('user_id', referral.referrer_id)
        .eq('type', 'referral')
        .eq('source', `referral_${referral.referred_id}`)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking existing reward:', checkError);
        continue;
      }

      if (existingReward) {
        console.log(`✅ Reward already exists: $${existingReward.amount} (${existingReward.status})`);
        continue;
      }

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

    console.log('\n✅ Rewards table fix completed!');

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

fixRewardsTable(); 