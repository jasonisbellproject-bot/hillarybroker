require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSampleCopyTraders() {
  try {
    console.log('🎯 Creating sample copy traders...');
    
    // Get existing users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(5);
    
    if (usersError) {
      console.error('❌ Error fetching users:', usersError.message);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('❌ No users found. Please create some users first.');
      return;
    }
    
    console.log(`📋 Found ${users.length} users to create copy traders for`);
    
    const sampleTraders = [
      {
        display_name: "CryptoMaster Pro",
        description: "Professional crypto trader with 5+ years experience. Specializing in DeFi and yield farming strategies.",
        success_rate: 87.5,
        total_profit: 15420.50,
        min_copy_amount: 50.00,
        max_copy_amount: 5000.00,
        copy_fee_percentage: 3.5,
        is_verified: true
      },
      {
        display_name: "DeFi Explorer",
        description: "Early DeFi adopter and yield optimizer. Focus on sustainable long-term strategies.",
        success_rate: 92.3,
        total_profit: 23450.75,
        min_copy_amount: 100.00,
        max_copy_amount: 10000.00,
        copy_fee_percentage: 5.0,
        is_verified: true
      },
      {
        display_name: "Staking Specialist",
        description: "Expert in staking strategies and passive income generation. Low risk, steady returns.",
        success_rate: 95.8,
        total_profit: 8750.25,
        min_copy_amount: 25.00,
        max_copy_amount: 2500.00,
        copy_fee_percentage: 2.5,
        is_verified: false
      },
      {
        display_name: "Trading Ninja",
        description: "Aggressive trading strategies with high risk/reward ratio. Not for the faint-hearted.",
        success_rate: 78.9,
        total_profit: 45680.00,
        min_copy_amount: 200.00,
        max_copy_amount: 15000.00,
        copy_fee_percentage: 7.0,
        is_verified: true
      },
      {
        display_name: "Conservative Investor",
        description: "Safe and steady investment approach. Perfect for beginners and risk-averse investors.",
        success_rate: 96.2,
        total_profit: 12340.80,
        min_copy_amount: 10.00,
        max_copy_amount: 1000.00,
        copy_fee_percentage: 2.0,
        is_verified: false
      }
    ];
    
    // Create copy traders for each user
    for (let i = 0; i < Math.min(users.length, sampleTraders.length); i++) {
      const user = users[i];
      const traderData = sampleTraders[i];
      
      console.log(`📝 Creating copy trader for ${user.email}...`);
      
      const { data: trader, error } = await supabase
        .from('copy_traders')
        .insert({
          user_id: user.id,
          ...traderData
        })
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log(`⚠️  Copy trader already exists for ${user.email}`);
        } else {
          console.log(`❌ Error creating copy trader for ${user.email}:`, error.message);
        }
      } else {
        console.log(`✅ Created copy trader: ${trader.display_name}`);
      }
    }
    
    console.log('\n🎉 Sample copy traders created successfully!');
    console.log('💡 You can now test the copy trading functionality');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

createSampleCopyTraders();
