require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabaseTables() {
  try {
    console.log('🔍 Checking database tables and data...\n');
    
    // Check users table
    console.log('👥 Users Table:');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Found ${users.length} users`);
      users.forEach(user => {
        console.log(`   - ${user.email} (Admin: ${user.is_admin ? 'Yes' : 'No'})`);
      });
    }
    
    // Check investment_plans table
    console.log('\n📈 Investment Plans Table:');
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('*');
    
    if (plansError) {
      console.log('❌ Error fetching plans:', plansError.message);
    } else {
      console.log(`✅ Found ${plans.length} investment plans`);
      plans.forEach(plan => {
        console.log(`   - ${plan.name} (${plan.min_amount}-${plan.max_amount})`);
      });
    }
    
    // Check staking_pools table
    console.log('\n🔒 Staking Pools Table:');
    const { data: pools, error: poolsError } = await supabase
      .from('staking_pools')
      .select('*');
    
    if (poolsError) {
      console.log('❌ Error fetching pools:', poolsError.message);
    } else {
      console.log(`✅ Found ${pools.length} staking pools`);
      pools.forEach(pool => {
        console.log(`   - ${pool.name} (APY: ${pool.apy}%)`);
      });
    }
    
    // Check transactions table
    console.log('\n💰 Transactions Table:');
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*');
    
    if (transactionsError) {
      console.log('❌ Error fetching transactions:', transactionsError.message);
    } else {
      console.log(`✅ Found ${transactions.length} transactions`);
    }
    
    // Check investments table
    console.log('\n🎯 Investments Table:');
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('*');
    
    if (investmentsError) {
      console.log('❌ Error fetching investments:', investmentsError.message);
    } else {
      console.log(`✅ Found ${investments.length} investments`);
    }
    
    // Check user_stakes table
    console.log('\n🔐 User Stakes Table:');
    const { data: stakes, error: stakesError } = await supabase
      .from('user_stakes')
      .select('*');
    
    if (stakesError) {
      console.log('❌ Error fetching stakes:', stakesError.message);
    } else {
      console.log(`✅ Found ${stakes.length} user stakes`);
    }
    
    // Check withdrawals table
    console.log('\n💸 Withdrawals Table:');
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*');
    
    if (withdrawalsError) {
      console.log('❌ Error fetching withdrawals:', withdrawalsError.message);
    } else {
      console.log(`✅ Found ${withdrawals.length} withdrawals`);
    }
    
    // Check kyc_documents table
    console.log('\n📋 KYC Documents Table:');
    const { data: kycDocs, error: kycError } = await supabase
      .from('kyc_documents')
      .select('*');
    
    if (kycError) {
      console.log('❌ Error fetching KYC documents:', kycError.message);
    } else {
      console.log(`✅ Found ${kycDocs.length} KYC documents`);
    }
    
    console.log('\n🎉 Database check completed!');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabaseTables();
