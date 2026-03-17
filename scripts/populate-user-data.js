require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function populateInvestmentPlans() {
  console.log('📊 Creating investment plans...');
  
  const plans = [
    {
      name: 'Starter Plan',
      description: 'Perfect for beginners. Low risk with steady returns.',
      min_amount: 100,
      max_amount: 999,
      daily_return: 2.5,
      duration: 30,
      total_return: 75,
      status: 'active',
      features: ['Low Risk', 'Steady Returns', 'Flexible Duration']
    },
    {
      name: 'Professional Plan',
      description: 'Balanced risk and reward for experienced investors.',
      min_amount: 1000,
      max_amount: 4999,
      daily_return: 3.5,
      duration: 45,
      total_return: 157.5,
      status: 'active',
      features: ['Balanced Risk', 'Higher Returns', 'Medium Duration']
    },
    {
      name: 'Premium Plan',
      description: 'High returns with advanced trading strategies.',
      min_amount: 5000,
      max_amount: 19999,
      daily_return: 4.5,
      duration: 60,
      total_return: 270,
      status: 'active',
      features: ['High Returns', 'Advanced Strategies', 'Long Duration']
    },
    {
      name: 'VIP Plan',
      description: 'Exclusive VIP treatment with maximum returns.',
      min_amount: 20000,
      max_amount: 50000,
      daily_return: 6.0,
      duration: 90,
      total_return: 540,
      status: 'active',
      features: ['VIP Treatment', 'Maximum Returns', 'Premium Support']
    }
  ];

  for (const plan of plans) {
    const { data, error } = await supabase
      .from('investment_plans')
      .upsert(plan, { onConflict: 'name' });

    if (error) {
      console.error(`Error creating plan ${plan.name}:`, error);
    } else {
      console.log(`✅ Created plan: ${plan.name}`);
    }
  }
}

async function populateStakingPools() {
  console.log('\n🏦 Creating staking pools...');
  
  const pools = [
    {
      name: 'High Yield',
      description: 'High yield staking pool with excellent returns',
      apy: 25.0,
      min_stake: 100,
      max_stake: 10000,
      lock_period: 30,
      status: 'active',
      features: ['High APY', 'Flexible Staking', 'Daily Rewards']
    },
    {
      name: 'Flexible',
      description: 'Flexible staking with no lock period',
      apy: 15.0,
      min_stake: 50,
      max_stake: 5000,
      lock_period: 0,
      status: 'active',
      features: ['No Lock Period', 'Flexible Withdrawal', 'Good Returns']
    },
    {
      name: 'Premium',
      description: 'Premium staking with high returns and longer lock',
      apy: 35.0,
      min_stake: 500,
      max_stake: 50000,
      lock_period: 90,
      status: 'active',
      features: ['High APY', 'Long Lock Period', 'Premium Benefits']
    },
    {
      name: 'Starter',
      description: 'Perfect for beginners with low minimum stake',
      apy: 10.0,
      min_stake: 25,
      max_stake: 1000,
      lock_period: 7,
      status: 'active',
      features: ['Low Minimum', 'Short Lock', 'Beginner Friendly']
    }
  ];

  for (const pool of pools) {
    const { data, error } = await supabase
      .from('staking_pools')
      .upsert(pool, { onConflict: 'name' });

    if (error) {
      console.error(`Error creating pool ${pool.name}:`, error);
    } else {
      console.log(`✅ Created pool: ${pool.name}`);
    }
  }
}

async function createTestUser() {
  console.log('\n👤 Creating test user...');
  
  // Create a test user
  const testUser = {
    id: 'test-user-123',
    email: 'test@example.com',
    first_name: 'Test',
    last_name: 'User',
    wallet_balance: 10000,
    total_earned: 2500,
    total_staked: 3000,
    referral_code: 'TEST123',
    status: 'active'
  };

  const { data, error } = await supabase
    .from('users')
    .upsert(testUser, { onConflict: 'email' });

  if (error) {
    console.error('Error creating test user:', error);
  } else {
    console.log('✅ Created test user: test@example.com');
  }

  return testUser.id;
}

async function createSampleInvestments(userId) {
  console.log('\n💼 Creating sample investments...');
  
  const investments = [
    {
      user_id: userId,
      plan_id: 1, // Starter Plan
      amount: 500,
      daily_return: 12.5,
      total_return: 375,
      start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      status: 'active'
    },
    {
      user_id: userId,
      plan_id: 2, // Professional Plan
      amount: 2000,
      daily_return: 70,
      total_return: 3150,
      start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
      end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
      status: 'active'
    }
  ];

  for (const investment of investments) {
    const { data, error } = await supabase
      .from('investments')
      .insert(investment);

    if (error) {
      console.error('Error creating investment:', error);
    } else {
      console.log(`✅ Created investment: $${investment.amount}`);
    }
  }
}

async function createSampleStakes(userId) {
  console.log('\n🔒 Creating sample stakes...');
  
  const stakes = [
    {
      user_id: userId,
      pool_id: 1, // High Yield
      amount: 1000,
      apy: 25.0,
      lock_period: 30,
      start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
      end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days from now
      status: 'active'
    },
    {
      user_id: userId,
      pool_id: 2, // Flexible
      amount: 500,
      apy: 15.0,
      lock_period: 0,
      start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      end_date: null, // No lock period
      status: 'active'
    }
  ];

  for (const stake of stakes) {
    const { data, error } = await supabase
      .from('user_stakes')
      .insert(stake);

    if (error) {
      console.error('Error creating stake:', error);
    } else {
      console.log(`✅ Created stake: $${stake.amount} in pool ${stake.pool_id}`);
    }
  }
}

async function createSampleRewards(userId) {
  console.log('\n🎁 Creating sample rewards...');
  
  const rewards = [
    {
      user_id: userId,
      type: 'referral',
      amount: 25.00,
      currency: 'USD',
      description: 'Referral bonus for new user signup',
      status: 'claimed'
    },
    {
      user_id: userId,
      type: 'bonus',
      amount: 50.00,
      currency: 'USD',
      description: 'Welcome bonus for new user',
      status: 'claimed'
    },
    {
      user_id: userId,
      type: 'staking',
      amount: 15.75,
      currency: 'USD',
      description: 'Daily staking reward',
      status: 'pending'
    },
    {
      user_id: userId,
      type: 'promotion',
      amount: 100.00,
      currency: 'USD',
      description: 'Special promotion reward',
      status: 'pending'
    }
  ];

  for (const reward of rewards) {
    const { data, error } = await supabase
      .from('rewards')
      .insert(reward);

    if (error) {
      console.error('Error creating reward:', error);
    } else {
      console.log(`✅ Created reward: $${reward.amount} (${reward.status})`);
    }
  }
}

async function createSampleTransactions(userId) {
  console.log('\n💰 Creating sample transactions...');
  
  const transactions = [
    {
      user_id: userId,
      type: 'deposit',
      amount: 5000,
      currency: 'USD',
      method: 'Bank Transfer',
      reference: 'DEP-001',
      status: 'completed'
    },
    {
      user_id: userId,
      type: 'investment',
      amount: 500,
      currency: 'USD',
      method: 'Starter Plan',
      reference: 'INV-001',
      status: 'completed'
    },
    {
      user_id: userId,
      type: 'reward',
      amount: 25.00,
      currency: 'USD',
      method: 'referral',
      reference: 'REW-001',
      status: 'completed'
    },
    {
      user_id: userId,
      type: 'withdrawal',
      amount: 1000,
      currency: 'USD',
      method: 'Bank Transfer',
      reference: 'WTH-001',
      status: 'completed'
    }
  ];

  for (const transaction of transactions) {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction);

    if (error) {
      console.error('Error creating transaction:', error);
    } else {
      console.log(`✅ Created transaction: $${transaction.amount} (${transaction.type})`);
    }
  }
}

async function main() {
  console.log('🚀 Populating User Dashboard Data');
  console.log('================================');
  
  try {
    // Create investment plans
    await populateInvestmentPlans();
    
    // Create staking pools
    await populateStakingPools();
    
    // Create test user
    const userId = await createTestUser();
    
    // Create sample data for the user
    await createSampleInvestments(userId);
    await createSampleStakes(userId);
    await createSampleRewards(userId);
    await createSampleTransactions(userId);
    
    console.log('\n✅ All sample data created successfully!');
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit http://localhost:3002/login');
    console.log('2. Login with: test@example.com / password123');
    console.log('3. Navigate to the dashboard to see the sample data');
    console.log('4. Test all the features: investments, staking, rewards, etc.');
    
  } catch (error) {
    console.error('❌ Error populating data:', error);
  }
}

main(); 