const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables')
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addSampleData() {
  try {
    console.log('🔧 Adding sample data...')

    // First, get the test user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'test@example.com')
      .limit(1)

    if (userError) {
      console.error('❌ Error fetching user:', userError)
      return
    }

    if (!users || users.length === 0) {
      console.error('❌ Test user not found. Please create the test user first.')
      return
    }

    const userId = users[0].id
    console.log('✅ Found test user:', userId)

    // Add investment plans
    console.log('📋 Adding investment plans...')
    const { error: plansError } = await supabase
      .from('investment_plans')
      .upsert([
        {
          id: 1,
          name: 'Starter Plan',
          min_amount: 100,
          max_amount: 1000,
          daily_return: 1.5,
          duration: 30,
          total_return: 45,
          status: 'active'
        },
        {
          id: 2,
          name: 'Premium Plan',
          min_amount: 1000,
          max_amount: 10000,
          daily_return: 2.5,
          duration: 30,
          total_return: 75,
          status: 'active'
        },
        {
          id: 3,
          name: 'VIP Plan',
          min_amount: 10000,
          max_amount: 100000,
          daily_return: 3.5,
          duration: 30,
          total_return: 105,
          status: 'active'
        }
      ])

    if (plansError) {
      console.error('❌ Error adding investment plans:', plansError)
    } else {
      console.log('✅ Investment plans added')
    }

    // Add sample deposits
    console.log('💰 Adding sample deposits...')
    const { error: depositsError } = await supabase
      .from('deposits')
      .upsert([
        {
          user_id: userId,
          amount: 1500,
          currency: 'USD',
          payment_method: 'Bitcoin',
          status: 'completed',
          transaction_hash: '0x1234567890abcdef',
        },
        {
          user_id: userId,
          amount: 2500,
          currency: 'USD',
          payment_method: 'Ethereum',
          status: 'completed',
          transaction_hash: '0xabcdef1234567890',
        },
        {
          user_id: userId,
          amount: 800,
          currency: 'USD',
          payment_method: 'USDT',
          status: 'pending',
          transaction_hash: null,
        }
      ])

    if (depositsError) {
      console.error('❌ Error adding deposits:', depositsError)
    } else {
      console.log('✅ Sample deposits added')
    }

    // Add sample withdrawals
    console.log('💸 Adding sample withdrawals...')
    const { error: withdrawalsError } = await supabase
      .from('withdrawals')
      .upsert([
        {
          user_id: userId,
          amount: 500,
          currency: 'USD',
          wallet_address: '0x1234567890abcdef1234567890abcdef12345678',
          status: 'completed',
        },
        {
          user_id: userId,
          amount: 300,
          currency: 'USD',
          wallet_address: '0xabcdef1234567890abcdef1234567890abcdef12',
          status: 'pending',
        }
      ])

    if (withdrawalsError) {
      console.error('❌ Error adding withdrawals:', withdrawalsError)
    } else {
      console.log('✅ Sample withdrawals added')
    }

    // Add sample investments
    console.log('📈 Adding sample investments...')
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
    
    const { error: investmentsError } = await supabase
      .from('investments')
      .upsert([
        {
          user_id: userId,
          plan_id: 1,
          amount: 1000,
          daily_return: 1.5,
          total_return: 45,
          start_date: now.toISOString(),
          end_date: thirtyDaysFromNow.toISOString(),
          status: 'active',
        },
        {
          user_id: userId,
          plan_id: 2,
          amount: 2500,
          daily_return: 2.5,
          total_return: 75,
          start_date: new Date(now.getTime() - (15 * 24 * 60 * 60 * 1000)).toISOString(),
          end_date: new Date(now.getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString(),
          status: 'active',
        },
        {
          user_id: userId,
          plan_id: 1,
          amount: 500,
          daily_return: 1.5,
          total_return: 45,
          start_date: new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000)).toISOString(),
          end_date: new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(),
          status: 'completed',
        }
      ])

    if (investmentsError) {
      console.error('❌ Error adding investments:', investmentsError)
    } else {
      console.log('✅ Sample investments added')
    }

    console.log('🎉 Sample data added successfully!')
    console.log('📊 You can now view real data in the dashboard')

  } catch (error) {
    console.error('❌ Error adding sample data:', error)
  }
}

addSampleData() 