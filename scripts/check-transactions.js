const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTransactions() {
  try {
    console.log('🔍 Checking transactions table...');
    
    // Check if transactions table exists and has data
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .limit(5);

    if (error) {
      console.error('❌ Error fetching transactions:', error);
      return;
    }

    console.log(`📊 Found ${transactions?.length || 0} transactions`);
    
    if (transactions && transactions.length > 0) {
      console.log('📋 Sample transaction:', transactions[0]);
    }

    // Check deposits table
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('*')
      .limit(5);

    if (depositsError) {
      console.error('❌ Error fetching deposits:', depositsError);
    } else {
      console.log(`💰 Found ${deposits?.length || 0} deposits`);
      if (deposits && deposits.length > 0) {
        console.log('📋 Sample deposit:', deposits[0]);
      }
    }

    // Check withdrawals table
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .limit(5);

    if (withdrawalsError) {
      console.error('❌ Error fetching withdrawals:', withdrawalsError);
    } else {
      console.log(`💸 Found ${withdrawals?.length || 0} withdrawals`);
      if (withdrawals && withdrawals.length > 0) {
        console.log('📋 Sample withdrawal:', withdrawals[0]);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkTransactions(); 