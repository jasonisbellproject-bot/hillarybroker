require('dotenv').config();

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testTransactionApproval() {
  try {
    console.log('🔍 Testing transaction approval...');
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
    console.log('Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');

    // First, let's check what transactions exist
    console.log('\n📋 Checking deposits...');
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('*')
      .limit(5);

    if (depositsError) {
      console.error('❌ Error fetching deposits:', depositsError);
    } else {
      console.log('✅ Deposits found:', deposits?.length || 0);
      if (deposits && deposits.length > 0) {
        console.log('Sample deposit:', {
          id: deposits[0].id,
          status: deposits[0].status,
          amount: deposits[0].amount,
          user_id: deposits[0].user_id
        });
      }
    }

    console.log('\n📋 Checking withdrawals...');
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .limit(5);

    if (withdrawalsError) {
      console.error('❌ Error fetching withdrawals:', withdrawalsError);
    } else {
      console.log('✅ Withdrawals found:', withdrawals?.length || 0);
      if (withdrawals && withdrawals.length > 0) {
        console.log('Sample withdrawal:', {
          id: withdrawals[0].id,
          status: withdrawals[0].status,
          amount: withdrawals[0].amount,
          user_id: withdrawals[0].user_id
        });
      }
    }

    // Check if there are any pending transactions
    console.log('\n⏳ Checking pending transactions...');
    const { data: pendingDeposits } = await supabase
      .from('deposits')
      .select('*')
      .eq('status', 'pending');

    const { data: pendingWithdrawals } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('status', 'pending');

    console.log('Pending deposits:', pendingDeposits?.length || 0);
    console.log('Pending withdrawals:', pendingWithdrawals?.length || 0);

    if (pendingDeposits && pendingDeposits.length > 0) {
      console.log('Sample pending deposit ID:', pendingDeposits[0].id);
    }

    if (pendingWithdrawals && pendingWithdrawals.length > 0) {
      console.log('Sample pending withdrawal ID:', pendingWithdrawals[0].id);
    }

    // Check admin user
    console.log('\n👤 Checking admin user...');
    const adminUserId = 'c7750996-2ecc-4889-9be6-8d506acb9a9a';
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUserId)
      .single();

    if (adminError) {
      console.error('❌ Error fetching admin user:', adminError);
    } else {
      console.log('✅ Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        is_admin: adminUser.is_admin,
        wallet_balance: adminUser.wallet_balance
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testTransactionApproval();
