require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixReferralData() {
  console.log('🔧 Fixing Referral System Data...\n');

  try {
    // 1. Check for users with invalid referred_by values (text instead of UUID)
    console.log('1. Checking for invalid referred_by values...');
    const { data: usersWithInvalidRefs, error: invalidRefsError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, referred_by')
      .not('referred_by', 'is', null)
      .not('referred_by', 'eq', '');

    if (invalidRefsError) {
      console.error('❌ Error fetching users with invalid refs:', invalidRefsError);
    } else {
      console.log(`Found ${usersWithInvalidRefs?.length || 0} users with referred_by values`);
      
      if (usersWithInvalidRefs) {
        for (const user of usersWithInvalidRefs) {
          // Check if referred_by is a valid UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(user.referred_by)) {
            console.log(`⚠️  User ${user.email} has invalid referred_by: ${user.referred_by}`);
            
            // Try to find the referrer by referral code
            const { data: referrer } = await supabase
              .from('users')
              .select('id')
              .eq('referral_code', user.referred_by)
              .single();

            if (referrer) {
              console.log(`✅ Found referrer with code ${user.referred_by}, updating...`);
              await supabase
                .from('users')
                .update({ referred_by: referrer.id })
                .eq('id', user.id);
            } else {
              console.log(`❌ No referrer found for code ${user.referred_by}, clearing...`);
              await supabase
                .from('users')
                .update({ referred_by: null })
                .eq('id', user.id);
            }
          }
        }
      }
    }

    // 2. Check for referrals with $0 commission and fix them
    console.log('\n2. Checking for referrals with $0 commission...');
    const { data: zeroCommissionRefs, error: zeroCommissionError } = await supabase
      .from('referrals')
      .select('*')
      .eq('commission_earned', 0);

    if (zeroCommissionError) {
      console.error('❌ Error fetching zero commission referrals:', zeroCommissionError);
    } else {
      console.log(`Found ${zeroCommissionRefs?.length || 0} referrals with $0 commission`);
      
      if (zeroCommissionRefs && zeroCommissionRefs.length > 0) {
        for (const referral of zeroCommissionRefs) {
          console.log(`💰 Updating referral ${referral.id} to $500 commission`);
          await supabase
            .from('referrals')
            .update({ commission_earned: 500.00 })
            .eq('id', referral.id);
        }
      }
    }

    // 3. Check for missing reward records for referrals
    console.log('\n3. Checking for missing reward records...');
    const { data: allReferrals, error: allReferralsError } = await supabase
      .from('referrals')
      .select('*')
      .eq('status', 'active');

    if (allReferralsError) {
      console.error('❌ Error fetching all referrals:', allReferralsError);
    } else {
      console.log(`Found ${allReferrals?.length || 0} active referrals`);
      
      if (allReferrals) {
        for (const referral of allReferrals) {
          // Check if reward exists for this referral
          const { data: existingReward, error: rewardCheckError } = await supabase
            .from('rewards')
            .select('*')
            .eq('user_id', referral.referrer_id)
            .eq('type', 'referral')
            .eq('source', `referral_${referral.referred_id}`)
            .single();

          if (rewardCheckError && rewardCheckError.code !== 'PGRST116') {
            console.error('❌ Error checking reward:', rewardCheckError);
            continue;
          }

          if (!existingReward) {
            console.log(`➕ Creating missing reward for referral ${referral.id}`);
            await supabase
              .from('rewards')
              .insert({
                user_id: referral.referrer_id,
                type: 'referral',
                amount: referral.commission_earned || 500.00,
                source: `referral_${referral.referred_id}`,
                description: 'Referral bonus for new user signup',
                status: 'pending'
              });
          }
        }
      }
    }

    // 4. Verify the fixes
    console.log('\n4. Verifying fixes...');
    const { data: finalStats, error: finalStatsError } = await supabase
      .from('referrals')
      .select('commission_earned', { count: 'exact' });

    if (finalStatsError) {
      console.error('❌ Error fetching final stats:', finalStatsError);
    } else {
      const totalReferrals = finalStats?.length || 0;
      const totalCommission = finalStats?.reduce((sum, ref) => sum + Number(ref.commission_earned), 0) || 0;
      console.log(`📊 Final stats: ${totalReferrals} referrals, $${totalCommission} total commission`);
    }

    console.log('\n✅ Referral data fix completed!');

  } catch (error) {
    console.error('❌ Fix failed:', error);
  }
}

fixReferralData();
