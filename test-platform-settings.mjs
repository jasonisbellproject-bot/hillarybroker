import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testPlatformSettings() {
  console.log('🧪 Testing Platform Settings...\n');

  try {
    // Get current platform settings
    const { data: settings, error: settingsError } = await supabase
      .from('platform_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      console.error('❌ Error fetching platform settings:', settingsError);
      return;
    }

    console.log('📋 Current Platform Settings:');
    console.log(`- Min Deposit: $${settings.min_deposit}`);
    console.log(`- Max Deposit: $${settings.max_deposit}`);
    console.log(`- Min Withdrawal: $${settings.min_withdrawal}`);
    console.log(`- Max Withdrawal: $${settings.max_withdrawal}`);
    console.log(`- Daily Withdrawal Limit: $${settings.daily_withdrawal_limit}`);
    console.log(`- Withdrawal Fee: $${settings.withdrawal_fee}`);

    // Test withdrawal validation logic
    console.log('\n🧪 Testing Withdrawal Validation:');
    
    const testAmounts = [50, 100, 500, 1000, 5000, 10000, 50000];
    
    for (const amount of testAmounts) {
      let isValid = true;
      let errorMessage = '';

      // Check min withdrawal
      if (amount < settings.min_withdrawal) {
        isValid = false;
        errorMessage = `Amount must be at least $${settings.min_withdrawal}`;
      }
      
      // Check max withdrawal
      if (amount > settings.max_withdrawal) {
        isValid = false;
        errorMessage = `Amount cannot exceed $${settings.max_withdrawal}`;
      }

      console.log(`- $${amount}: ${isValid ? '✅ Valid' : `❌ Invalid - ${errorMessage}`}`);
    }

    // Test deposit validation logic
    console.log('\n🧪 Testing Deposit Validation:');
    
    for (const amount of testAmounts) {
      let isValid = true;
      let errorMessage = '';

      // Check min deposit
      if (amount < settings.min_deposit) {
        isValid = false;
        errorMessage = `Amount must be at least $${settings.min_deposit}`;
      }
      
      // Check max deposit
      if (amount > settings.max_deposit) {
        isValid = false;
        errorMessage = `Amount cannot exceed $${settings.max_deposit}`;
      }

      console.log(`- $${amount}: ${isValid ? '✅ Valid' : `❌ Invalid - ${errorMessage}`}`);
    }

    // Test daily withdrawal limit
    console.log('\n🧪 Testing Daily Withdrawal Limit:');
    
    // Get today's completed withdrawals for a test user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: todayWithdrawals, error: dailyError } = await supabase
      .from('withdrawals')
      .select('amount')
      .eq('status', 'completed')
      .gte('created_at', today.toISOString())
      .lt('created_at', tomorrow.toISOString());

    if (dailyError) {
      console.error('❌ Error fetching today\'s withdrawals:', dailyError);
    } else {
      const todayTotal = (todayWithdrawals || []).reduce((sum, w) => sum + parseFloat(w.amount), 0);
      const remainingLimit = settings.daily_withdrawal_limit - todayTotal;
      
      console.log(`- Today's total withdrawals: $${todayTotal.toFixed(2)}`);
      console.log(`- Daily limit: $${settings.daily_withdrawal_limit}`);
      console.log(`- Remaining limit: $${remainingLimit.toFixed(2)}`);
      
      const testWithdrawalAmount = 1000;
      if (testWithdrawalAmount > remainingLimit) {
        console.log(`- Test withdrawal of $${testWithdrawalAmount}: ❌ Would exceed daily limit`);
      } else {
        console.log(`- Test withdrawal of $${testWithdrawalAmount}: ✅ Within daily limit`);
      }
    }

    console.log('\n✅ Platform settings test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testPlatformSettings(); 