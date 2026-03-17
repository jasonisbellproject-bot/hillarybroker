const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyWalletAddressesSchema() {
  try {
    console.log('🔧 Applying wallet addresses schema...')

    // Create the wallet_addresses table
    console.log('📋 Creating wallet_addresses table...')
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.wallet_addresses (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL CHECK (type IN ('bitcoin', 'ethereum', 'usdt', 'bank', 'paypal')),
          address TEXT NOT NULL,
          network TEXT,
          fee DECIMAL(5,2) DEFAULT 0,
          min_amount DECIMAL(15,2) DEFAULT 0,
          max_amount DECIMAL(15,2) DEFAULT 999999,
          processing_time TEXT DEFAULT 'Instant',
          status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
          description TEXT,
          icon TEXT DEFAULT 'wallet',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (createTableError) {
      console.error('❌ Error creating table:', createTableError)
      return
    }

    console.log('✅ Wallet addresses table created')

    // Create indexes
    console.log('📊 Creating indexes...')
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_wallet_addresses_type ON public.wallet_addresses(type);
        CREATE INDEX IF NOT EXISTS idx_wallet_addresses_status ON public.wallet_addresses(status);
      `
    })

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError)
    } else {
      console.log('✅ Indexes created')
    }

    // Enable RLS
    console.log('🔒 Enabling RLS...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;`
    })

    if (rlsError) {
      console.error('❌ Error enabling RLS:', rlsError)
    } else {
      console.log('✅ RLS enabled')
    }

    // Create RLS policy
    console.log('📋 Creating RLS policy...')
    const { error: policyError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "Anyone can view wallet addresses" ON public.wallet_addresses
          FOR SELECT USING (true);
      `
    })

    if (policyError) {
      console.error('❌ Error creating policy:', policyError)
    } else {
      console.log('✅ RLS policy created')
    }

    // Insert sample data
    console.log('💰 Inserting sample wallet addresses...')
    const { error: insertError } = await supabase
      .from('wallet_addresses')
      .insert([
        {
          name: 'Bitcoin Wallet',
          type: 'bitcoin',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          network: 'Bitcoin',
          fee: 0,
          min_amount: 50,
          max_amount: 50000,
          processing_time: 'Instant',
          status: 'active',
          description: 'Deposit with Bitcoin',
          icon: 'bitcoin'
        },
        {
          name: 'Ethereum Wallet',
          type: 'ethereum',
          address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
          network: 'Ethereum',
          fee: 0,
          min_amount: 50,
          max_amount: 50000,
          processing_time: 'Instant',
          status: 'active',
          description: 'Deposit with Ethereum',
          icon: 'ethereum'
        },
        {
          name: 'USDT TRC20',
          type: 'usdt',
          address: 'TQn9Y2khDD95J42FQtQTdwVVRqQZqKqKqK',
          network: 'TRC20',
          fee: 0,
          min_amount: 50,
          max_amount: 50000,
          processing_time: 'Instant',
          status: 'active',
          description: 'Deposit with USDT (TRC20)',
          icon: 'credit-card'
        },
        {
          name: 'Bank Transfer',
          type: 'bank',
          address: 'Account: 1234567890, Bank: Example Bank',
          network: 'Bank Transfer',
          fee: 0,
          min_amount: 100,
          max_amount: 100000,
          processing_time: '1-3 business days',
          status: 'active',
          description: 'Direct bank transfer',
          icon: 'credit-card'
        },
        {
          name: 'PayPal',
          type: 'paypal',
          address: 'payments@bitsparetron.com',
          network: 'PayPal',
          fee: 2.5,
          min_amount: 10,
          max_amount: 10000,
          processing_time: 'Instant',
          status: 'active',
          description: 'PayPal payment',
          icon: 'credit-card'
        }
      ])

    if (insertError) {
      console.error('❌ Error inserting wallet addresses:', insertError)
    } else {
      console.log('✅ Sample wallet addresses inserted')
    }

    console.log('\n🎉 Wallet addresses schema applied successfully!')
    console.log('   - Table created with proper constraints')
    console.log('   - Indexes created for performance')
    console.log('   - RLS enabled with public read policy')
    console.log('   - Sample data inserted')

  } catch (error) {
    console.error('❌ Error applying schema:', error)
  }
}

applyWalletAddressesSchema() 