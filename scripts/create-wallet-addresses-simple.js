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

async function createWalletAddresses() {
  try {
    console.log('🔧 Creating wallet addresses...')

    // Try to insert sample data directly
    console.log('💰 Adding sample wallet addresses...')
    const { data, error } = await supabase
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
      .select()

    if (error) {
      console.error('❌ Error inserting wallet addresses:', error)
      console.log('   This might mean the table needs to be created first.')
      console.log('   Please run the schema setup manually in Supabase dashboard.')
    } else {
      console.log('✅ Sample wallet addresses added successfully!')
      console.log('   - Bitcoin Wallet')
      console.log('   - Ethereum Wallet')
      console.log('   - USDT TRC20')
      console.log('   - Bank Transfer')
      console.log('   - PayPal')
    }

  } catch (error) {
    console.error('❌ Error creating wallet addresses:', error)
  }
}

createWalletAddresses() 