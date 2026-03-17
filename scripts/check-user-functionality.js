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

async function checkUserFunctionality() {
  try {
    console.log('🔍 Checking user functionality...')

    // 1. Check if test user exists
    console.log('\n1. Checking test user...')
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('*')
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

    const user = users[0]
    console.log('✅ Test user found:', user.email)
    console.log('   Balance:', user.wallet_balance)
    console.log('   Total earned:', user.total_earned)
    console.log('   Total staked:', user.total_staked)

    // 2. Check staking pools
    console.log('\n2. Checking staking pools...')
    const { data: pools, error: poolsError } = await supabase
      .from('staking_pools')
      .select('*')
      .eq('status', 'active')

    if (poolsError) {
      console.error('❌ Error fetching staking pools:', poolsError)
    } else {
      console.log(`✅ Found ${pools?.length || 0} active staking pools`)
      if (pools && pools.length > 0) {
        pools.forEach(pool => {
          console.log(`   - ${pool.name}: ${pool.apy}% APY, Min: $${pool.min_stake}`)
        })
      }
    }

    // 3. Check user stakes
    console.log('\n3. Checking user stakes...')
    const { data: stakes, error: stakesError } = await supabase
      .from('user_stakes')
      .select('*')
      .eq('user_id', user.id)

    if (stakesError) {
      console.error('❌ Error fetching user stakes:', stakesError)
    } else {
      console.log(`✅ Found ${stakes?.length || 0} user stakes`)
    }

    // 4. Check deposits
    console.log('\n4. Checking deposits...')
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', user.id)

    if (depositsError) {
      console.error('❌ Error fetching deposits:', depositsError)
    } else {
      console.log(`✅ Found ${deposits?.length || 0} deposits`)
    }

    // 5. Check withdrawals
    console.log('\n5. Checking withdrawals...')
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', user.id)

    if (withdrawalsError) {
      console.error('❌ Error fetching withdrawals:', withdrawalsError)
    } else {
      console.log(`✅ Found ${withdrawals?.length || 0} withdrawals`)
    }

    // 6. Check rewards
    console.log('\n6. Checking rewards...')
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', user.id)

    if (rewardsError) {
      console.error('❌ Error fetching rewards:', rewardsError)
    } else {
      console.log(`✅ Found ${rewards?.length || 0} rewards`)
    }

    // 7. Check transactions
    console.log('\n7. Checking transactions...')
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)

    if (transactionsError) {
      console.error('❌ Error fetching transactions:', transactionsError)
    } else {
      console.log(`✅ Found ${transactions?.length || 0} transactions`)
    }

    // 8. Check if we need to add sample data
    console.log('\n8. Checking if sample data is needed...')
    const needsSampleData = (!pools || pools.length === 0) || 
                           (!deposits || deposits.length === 0) || 
                           (!rewards || rewards.length === 0)

    if (needsSampleData) {
      console.log('⚠️  Sample data is missing. Adding sample data...')
      
      // Add staking pools if none exist
      if (!pools || pools.length === 0) {
        console.log('   Adding staking pools...')
        const { error: poolsInsertError } = await supabase
          .from('staking_pools')
          .insert([
            {
              name: 'Flexible Staking',
              description: 'Earn rewards with no lock period',
              apy: 12.5,
              min_stake: 100,
              max_stake: 10000,
              lock_period: 0,
              status: 'active'
            },
            {
              name: 'High Yield Staking',
              description: 'Higher rewards with 30-day lock',
              apy: 25.0,
              min_stake: 500,
              max_stake: 50000,
              lock_period: 30,
              status: 'active'
            },
            {
              name: 'Premium Staking',
              description: 'Maximum rewards with 90-day lock',
              apy: 35.0,
              min_stake: 1000,
              max_stake: 100000,
              lock_period: 90,
              status: 'active'
            }
          ])
        
        if (poolsInsertError) {
          console.error('❌ Error adding staking pools:', poolsInsertError)
        } else {
          console.log('✅ Staking pools added')
        }
      }

      // Add sample deposits if none exist
      if (!deposits || deposits.length === 0) {
        console.log('   Adding sample deposits...')
        const { error: depositsInsertError } = await supabase
          .from('deposits')
          .insert([
            {
              user_id: user.id,
              amount: 1500,
              currency: 'USD',
              payment_method: 'Bitcoin',
              status: 'completed',
              transaction_hash: '0x1234567890abcdef',
              reference: 'DEP-001'
            },
            {
              user_id: user.id,
              amount: 2500,
              currency: 'USD',
              payment_method: 'Ethereum',
              status: 'completed',
              transaction_hash: '0xabcdef1234567890',
              reference: 'DEP-002'
            }
          ])
        
        if (depositsInsertError) {
          console.error('❌ Error adding deposits:', depositsInsertError)
        } else {
          console.log('✅ Sample deposits added')
        }
      }

      // Add sample rewards if none exist
      if (!rewards || rewards.length === 0) {
        console.log('   Adding sample rewards...')
        const { error: rewardsInsertError } = await supabase
          .from('rewards')
          .insert([
            {
              user_id: user.id,
              type: 'daily',
              amount: 5.00,
              status: 'claimed',
              description: 'Daily login bonus'
            },
            {
              user_id: user.id,
              type: 'referral',
              amount: 25.00,
              status: 'claimed',
              description: 'Referral bonus'
            },
            {
              user_id: user.id,
              type: 'staking',
              amount: 12.50,
              status: 'pending',
              description: 'Staking reward'
            }
          ])
        
        if (rewardsInsertError) {
          console.error('❌ Error adding rewards:', rewardsInsertError)
        } else {
          console.log('✅ Sample rewards added')
        }
      }

      // Update user balance if it's 0
      if (user.wallet_balance === 0) {
        console.log('   Updating user balance...')
        const { error: balanceError } = await supabase
          .from('users')
          .update({ 
            wallet_balance: 5000,
            total_earned: 42.50,
            total_staked: 1000
          })
          .eq('id', user.id)
        
        if (balanceError) {
          console.error('❌ Error updating user balance:', balanceError)
        } else {
          console.log('✅ User balance updated')
        }
      }
    } else {
      console.log('✅ Sample data already exists')
    }

    console.log('\n🎉 User functionality check completed!')
    console.log('   The dashboard should now display properly with sample data.')

  } catch (error) {
    console.error('❌ Error checking user functionality:', error)
  }
}

checkUserFunctionality() 