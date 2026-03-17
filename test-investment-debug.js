const { createClient } = require('@supabase/supabase-js');

// Check if environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing Supabase environment variables');
  console.log('Please set:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInvestmentTables() {
  console.log('🔍 Testing Investment Tables...\n');

  try {
    // Test investment_plans table
    console.log('1. Testing investment_plans table...');
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('*')
      .limit(5);

    if (plansError) {
      console.log('❌ Error fetching investment plans:', plansError.message);
    } else {
      console.log(`✅ Found ${plans?.length || 0} investment plans`);
      if (plans && plans.length > 0) {
        console.log('Sample plan:', plans[0]);
      }
    }

    // Test investments table
    console.log('\n2. Testing investments table...');
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .limit(5);

    if (investmentsError) {
      console.log('❌ Error fetching investments:', investmentsError.message);
    } else {
      console.log(`✅ Found ${investments?.length || 0} investments`);
      if (investments && investments.length > 0) {
        console.log('Sample investment:', investments[0]);
      }
    }

    // Test users table
    console.log('\n3. Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, wallet_balance')
      .limit(5);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Found ${users?.length || 0} users`);
      if (users && users.length > 0) {
        console.log('Sample user:', users[0]);
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testInvestmentTables(); 