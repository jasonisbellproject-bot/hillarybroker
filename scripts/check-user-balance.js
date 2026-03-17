const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkUserBalance() {
  try {
    console.log('🔍 Checking user balances...\n');

    // Get all users with their wallet balances
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, wallet_balance, total_earned, total_staked')
      .order('wallet_balance', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error);
      return;
    }

    console.log('📊 User Balances:');
    console.log('='.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email || 'No email'}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Wallet Balance: $${user.wallet_balance || 0}`);
      console.log(`   Total Earned: $${user.total_earned || 0}`);
      console.log(`   Total Staked: $${user.total_staked || 0}`);
      console.log('');
    });

    // Check for users with zero balance
    const zeroBalanceUsers = users.filter(user => !user.wallet_balance || user.wallet_balance === 0);
    console.log(`⚠️  Users with zero balance: ${zeroBalanceUsers.length}`);
    
    if (zeroBalanceUsers.length > 0) {
      console.log('\nUsers with $0 balance:');
      zeroBalanceUsers.forEach(user => {
        console.log(`- ${user.email || 'No email'} (ID: ${user.id})`);
      });
    }

    // Check for users with high balance
    const highBalanceUsers = users.filter(user => user.wallet_balance && user.wallet_balance > 1000);
    console.log(`\n💰 Users with balance > $1000: ${highBalanceUsers.length}`);
    
    if (highBalanceUsers.length > 0) {
      console.log('\nUsers with high balance:');
      highBalanceUsers.forEach(user => {
        console.log(`- ${user.email || 'No email'}: $${user.wallet_balance}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkUserBalance(); 