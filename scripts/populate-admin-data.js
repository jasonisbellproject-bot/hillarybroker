const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function populateAdminData() {
  try {
    console.log('🚀 Starting database population for admin panel...');

    // Create sample users
    console.log('📝 Creating sample users...');
    const users = [
      {
        email: 'john.doe@example.com',
        first_name: 'John',
        last_name: 'Doe',
        kyc_verified: true,
        two_factor_enabled: true,
        is_admin: false,
        status: 'active',
        wallet_balance: 1250,
        referral_code: 'JOHN123',
        total_earned: 2500,
        total_staked: 5000
      },
      {
        email: 'jane.smith@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        kyc_verified: true,
        two_factor_enabled: false,
        is_admin: false,
        status: 'active',
        wallet_balance: 950,
        referral_code: 'JANE456',
        referred_by: 'JOHN123',
        total_earned: 1800,
        total_staked: 3000
      },
      {
        email: 'mike.wilson@example.com',
        first_name: 'Mike',
        last_name: 'Wilson',
        kyc_verified: false,
        two_factor_enabled: true,
        is_admin: false,
        status: 'pending',
        wallet_balance: 300,
        referral_code: 'MIKE789',
        referred_by: 'JANE456',
        total_earned: 500,
        total_staked: 1000
      },
      {
        email: 'admin@bitsparetron.com',
        first_name: 'Admin',
        last_name: 'User',
        kyc_verified: true,
        two_factor_enabled: true,
        is_admin: true,
        status: 'active',
        wallet_balance: 5000,
        referral_code: 'ADMIN001',
        total_earned: 10000,
        total_staked: 20000
      }
    ];

    for (const user of users) {
      const { data, error } = await supabase
        .from('users')
        .upsert(user, { onConflict: 'email' });
      
      if (error) {
        console.error('Error creating user:', error);
      } else {
        console.log(`✅ Created user: ${user.email}`);
      }
    }

    // Create sample staking pools
    console.log('🏦 Creating sample staking pools...');
    const pools = [
      {
        name: 'Flexible Staking',
        description: 'Earn rewards with flexible staking. No lock period, withdraw anytime.',
        apy: 8.5,
        min_stake: 100,
        max_stake: 50000,
        lock_period: 0,
        status: 'active',
        features: ['Flexible', 'No Lock Period', 'Daily Rewards', 'Instant Withdrawal'],
        rewards_distributed: 45000,
        total_rewards: 85000
      },
      {
        name: 'Premium Staking',
        description: 'Higher rewards with 30-day lock period. Perfect for long-term investors.',
        apy: 15.2,
        min_stake: 500,
        max_stake: 100000,
        lock_period: 30,
        status: 'active',
        features: ['High APY', '30-Day Lock', 'Weekly Rewards', 'Compound Interest'],
        rewards_distributed: 125000,
        total_rewards: 180000
      },
      {
        name: 'VIP Staking',
        description: 'Exclusive high-yield staking with 90-day lock period for VIP members.',
        apy: 22.5,
        min_stake: 1000,
        max_stake: 250000,
        lock_period: 90,
        status: 'active',
        features: ['VIP Access', '90-Day Lock', 'Monthly Rewards', 'Priority Support'],
        rewards_distributed: 75000,
        total_rewards: 120000
      }
    ];

    for (const pool of pools) {
      const { data, error } = await supabase
        .from('staking_pools')
        .upsert(pool, { onConflict: 'name' });
      
      if (error) {
        console.error('Error creating pool:', error);
      } else {
        console.log(`✅ Created pool: ${pool.name}`);
      }
    }

    // Create sample withdrawals
    console.log('💸 Creating sample withdrawals...');
    const withdrawals = [
      {
        user_id: 1, // john.doe@example.com
        amount: 500,
        method: 'bank',
        status: 'pending',
        reference: 'WTH1703123456789ABC123',
        bank_details: {
          accountName: 'John Doe',
          accountNumber: '1234567890',
          bankName: 'Chase Bank',
          routingNumber: '021000021'
        }
      },
      {
        user_id: 2, // jane.smith@example.com
        amount: 250,
        method: 'crypto',
        status: 'approved',
        reference: 'WTH1703123456789DEF456',
        wallet_address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        admin_notes: 'Approved after KYC verification',
        processed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        processed_by: 'admin@bitsparetron.com'
      },
      {
        user_id: 3, // mike.wilson@example.com
        amount: 1000,
        method: 'paypal',
        status: 'rejected',
        reference: 'WTH1703123456789GHI789',
        admin_notes: 'Rejected due to insufficient KYC documentation',
        processed_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        processed_by: 'admin@bitsparetron.com'
      }
    ];

    for (const withdrawal of withdrawals) {
      const { data, error } = await supabase
        .from('withdrawals')
        .insert(withdrawal);
      
      if (error) {
        console.error('Error creating withdrawal:', error);
      } else {
        console.log(`✅ Created withdrawal: ${withdrawal.reference}`);
      }
    }

    // Create sample stakes
    console.log('🔒 Creating sample stakes...');
    const stakes = [
      {
        user_id: 1,
        pool_id: 1,
        amount: 2000,
        status: 'active',
        apy: 8.5,
        lock_period: 0
      },
      {
        user_id: 2,
        pool_id: 2,
        amount: 1500,
        status: 'active',
        apy: 15.2,
        lock_period: 30
      },
      {
        user_id: 3,
        pool_id: 1,
        amount: 500,
        status: 'active',
        apy: 8.5,
        lock_period: 0
      }
    ];

    for (const stake of stakes) {
      const { data, error } = await supabase
        .from('user_stakes')
        .insert(stake);
      
      if (error) {
        console.error('Error creating stake:', error);
      } else {
        console.log(`✅ Created stake: ${stake.amount} for user ${stake.user_id}`);
      }
    }

    // Create sample investments
    console.log('💰 Creating sample investments...');
    const investments = [
      {
        user_id: 1,
        plan_id: 1,
        amount: 3000,
        status: 'active',
        expected_return: 3600,
        duration: 12
      },
      {
        user_id: 2,
        plan_id: 2,
        amount: 2000,
        status: 'active',
        expected_return: 2600,
        duration: 6
      },
      {
        user_id: 3,
        plan_id: 1,
        amount: 1000,
        status: 'active',
        expected_return: 1200,
        duration: 12
      }
    ];

    for (const investment of investments) {
      const { data, error } = await supabase
        .from('investments')
        .insert(investment);
      
      if (error) {
        console.error('Error creating investment:', error);
      } else {
        console.log(`✅ Created investment: ${investment.amount} for user ${investment.user_id}`);
      }
    }

    // Create sample transactions
    console.log('💳 Creating sample transactions...');
    const transactions = [
      {
        user_id: 1,
        type: 'deposit',
        amount: 5000,
        currency: 'USD',
        method: 'bank',
        status: 'completed',
        reference: 'TXN1703123456789ABC123'
      },
      {
        user_id: 2,
        type: 'deposit',
        amount: 3000,
        currency: 'USD',
        method: 'crypto',
        status: 'completed',
        reference: 'TXN1703123456789DEF456'
      },
      {
        user_id: 3,
        type: 'deposit',
        amount: 1500,
        currency: 'USD',
        method: 'paypal',
        status: 'completed',
        reference: 'TXN1703123456789GHI789'
      }
    ];

    for (const transaction of transactions) {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction);
      
      if (error) {
        console.error('Error creating transaction:', error);
      } else {
        console.log(`✅ Created transaction: ${transaction.reference}`);
      }
    }

    console.log('🎉 Database population completed successfully!');
    console.log('📊 Admin panel is now ready with real data');

  } catch (error) {
    console.error('❌ Error populating database:', error);
  }
}

populateAdminData(); 