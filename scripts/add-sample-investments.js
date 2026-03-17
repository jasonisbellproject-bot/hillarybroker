require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addSampleInvestments() {
  try {
    console.log('🔍 Adding sample investments...');

    // First, let's create some investment plans
    const plans = [
      {
        name: 'Starter Plan',
        min_amount: 100,
        max_amount: 1000,
        daily_return: 2.5,
        duration: 30,
        total_return: 175,
        status: 'active'
      },
      {
        name: 'Professional Plan',
        min_amount: 1000,
        max_amount: 10000,
        daily_return: 3.5,
        duration: 45,
        total_return: 257.5,
        status: 'active'
      },
      {
        name: 'Premium Plan',
        min_amount: 10000,
        max_amount: 100000,
        daily_return: 4.5,
        duration: 60,
        total_return: 370,
        status: 'active'
      },
      {
        name: 'VIP Plan',
        min_amount: 100000,
        max_amount: 1000000,
        daily_return: 6.0,
        duration: 90,
        total_return: 640,
        status: 'active'
      }
    ];

    // Insert investment plans
    const { data: insertedPlans, error: plansError } = await supabase
      .from('investment_plans')
      .insert(plans)
      .select();

    if (plansError) {
      console.error('Error creating investment plans:', plansError);
      return;
    }

    console.log('✅ Investment plans created:', insertedPlans.length);

    // Get some users to create investments for
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(5);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.log('👥 Found users:', users.length);

    // Create sample investments
    const sampleInvestments = [];
    const investmentStatuses = ['active', 'completed', 'cancelled'];
    const withdrawalStatuses = ['pending', 'processing', 'approved', 'rejected', 'completed'];
    const amounts = [500, 1000, 2500, 5000, 10000];

    for (let i = 0; i < 20; i++) {
      const user = users[i % users.length];
      const plan = insertedPlans[i % insertedPlans.length];
      const status = investmentStatuses[i % investmentStatuses.length];
      const amount = amounts[i % amounts.length];
      
      // Create investment 1-30 days ago
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const created_at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      const start_date = created_at;
      const end_date = new Date(new Date(created_at).getTime() + plan.duration * 24 * 60 * 60 * 1000).toISOString();

      sampleInvestments.push({
        user_id: user.id,
        plan_id: plan.id,
        amount: amount,
        daily_return: plan.daily_return,
        total_return: (amount * plan.daily_return * plan.duration) / 100,
        start_date: start_date,
        end_date: end_date,
        status: status,
        created_at: created_at,
        updated_at: created_at
      });
    }

    // Insert investments
    const { data: insertedInvestments, error: investmentsError } = await supabase
      .from('investments')
      .insert(sampleInvestments)
      .select();

    if (investmentsError) {
      console.error('Error creating investments:', investmentsError);
      return;
    }

    console.log('✅ Sample investments created:', insertedInvestments.length);

    // Create some withdrawals
    const sampleWithdrawals = [];
    for (let i = 0; i < 10; i++) {
      const user = users[i % users.length];
      const amount = amounts[i % amounts.length];
      const status = withdrawalStatuses[i % withdrawalStatuses.length];
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const created_at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      const methods = ['bank', 'crypto', 'paypal', 'card'];
      const method = methods[i % methods.length];

      sampleWithdrawals.push({
        user_id: user.id,
        amount: amount,
        currency: 'USD',
        method: method,
        status: status,
        reference: `WD-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        wallet_address: method === 'crypto' ? `0x${Math.random().toString(16).substr(2, 40)}` : null,
        created_at: created_at,
        updated_at: created_at
      });
    }

    const { data: insertedWithdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .insert(sampleWithdrawals)
      .select();

    if (withdrawalsError) {
      console.error('Error creating withdrawals:', withdrawalsError);
      return;
    }

    console.log('✅ Sample withdrawals created:', insertedWithdrawals.length);

    // Create some deposits
    const sampleDeposits = [];
    const depositStatuses = ['pending', 'completed', 'failed'];
    for (let i = 0; i < 15; i++) {
      const user = users[i % users.length];
      const amount = amounts[i % amounts.length];
      const status = depositStatuses[i % depositStatuses.length];
      const daysAgo = Math.floor(Math.random() * 30) + 1;
      const created_at = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();

      sampleDeposits.push({
        user_id: user.id,
        amount: amount,
        currency: 'USD',
        payment_method: 'bank',
        status: status,
        created_at: created_at,
        updated_at: created_at
      });
    }

    const { data: insertedDeposits, error: depositsError } = await supabase
      .from('deposits')
      .insert(sampleDeposits)
      .select();

    if (depositsError) {
      console.error('Error creating deposits:', depositsError);
      return;
    }

    console.log('✅ Sample deposits created:', insertedDeposits.length);

    console.log('🎉 All sample data created successfully!');
    console.log('📊 Summary:');
    console.log(`   - ${insertedPlans.length} investment plans`);
    console.log(`   - ${insertedInvestments.length} investments`);
    console.log(`   - ${insertedWithdrawals.length} withdrawals`);
    console.log(`   - ${insertedDeposits.length} deposits`);

  } catch (error) {
    console.error('❌ Error adding sample data:', error);
  }
}

addSampleInvestments(); 