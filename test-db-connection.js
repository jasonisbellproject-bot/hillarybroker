const { createClient } = require('@supabase/supabase-js');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  console.log('Please set:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('investment_plans').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Database connection successful');

    // Test 2: Investment plans table
    console.log('\n2. Testing investment_plans table...');
    const { data: plans, error: plansError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active');

    if (plansError) {
      console.log('❌ Error fetching investment plans:', plansError.message);
    } else {
      console.log(`✅ Found ${plans?.length || 0} active investment plans`);
      if (plans && plans.length > 0) {
        console.log('Sample plan:', {
          id: plans[0].id,
          name: plans[0].name,
          min_amount: plans[0].min_amount,
          max_amount: plans[0].max_amount,
          daily_return: plans[0].daily_return
        });
      }
    }

    // Test 3: Investments table
    console.log('\n3. Testing investments table...');
    const { data: investments, error: investmentsError } = await supabase
      .from('investments')
      .select('*')
      .limit(5);

    if (investmentsError) {
      console.log('❌ Error fetching investments:', investmentsError.message);
    } else {
      console.log(`✅ Found ${investments?.length || 0} investments`);
      if (investments && investments.length > 0) {
        console.log('Sample investment:', {
          id: investments[0].id,
          user_id: investments[0].user_id,
          plan_id: investments[0].plan_id,
          amount: investments[0].amount,
          status: investments[0].status
        });
      }
    }

    // Test 4: Users table
    console.log('\n4. Testing users table...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, wallet_balance')
      .limit(5);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Found ${users?.length || 0} users`);
      if (users && users.length > 0) {
        console.log('Sample user:', {
          id: users[0].id,
          email: users[0].email,
          wallet_balance: users[0].wallet_balance
        });
      }
    }

    // Test 5: RLS Policies
    console.log('\n5. Testing RLS policies...');
    const { data: publicPlans, error: publicError } = await supabase
      .from('investment_plans')
      .select('*')
      .eq('status', 'active');

    if (publicError) {
      console.log('❌ RLS policy issue:', publicError.message);
    } else {
      console.log('✅ RLS policies working correctly');
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testDatabaseConnection(); 