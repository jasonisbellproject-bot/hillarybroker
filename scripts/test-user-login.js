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

async function testUserLogin() {
  try {
    console.log('🔍 Testing user login functionality...')

    // 1. Test user login
    console.log('\n1. Testing user login...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (authError) {
      console.error('❌ Login failed:', authError.message)
      return
    }

    console.log('✅ Login successful')
    console.log('   User ID:', authData.user.id)
    console.log('   Email:', authData.user.email)

    // 2. Get user profile
    console.log('\n2. Getting user profile...')
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('❌ Failed to get user profile:', profileError)
      return
    }

    console.log('✅ User profile retrieved')
    console.log('   Balance:', userProfile.wallet_balance)
    console.log('   Total earned:', userProfile.total_earned)
    console.log('   Total staked:', userProfile.total_staked)
    console.log('   Is admin:', userProfile.is_admin)

    // 3. Test dashboard stats API (simulate)
    console.log('\n3. Testing dashboard stats...')
    const { data: stats, error: statsError } = await supabase
      .from('users')
      .select(`
        wallet_balance,
        total_earned,
        total_staked,
        referral_code,
        email,
        first_name,
        last_name,
        avatar_url
      `)
      .eq('id', authData.user.id)
      .single()

    if (statsError) {
      console.error('❌ Failed to get dashboard stats:', statsError)
    } else {
      console.log('✅ Dashboard stats retrieved')
      console.log('   Wallet balance:', stats.wallet_balance)
      console.log('   Total earned:', stats.total_earned)
      console.log('   Total staked:', stats.total_staked)
    }

    // 4. Test staking pools API (simulate)
    console.log('\n4. Testing staking pools...')
    const { data: pools, error: poolsError } = await supabase
      .from('staking_pools')
      .select('*')
      .eq('status', 'active')

    if (poolsError) {
      console.error('❌ Failed to get staking pools:', poolsError)
    } else {
      console.log(`✅ Found ${pools?.length || 0} active staking pools`)
      if (pools && pools.length > 0) {
        pools.forEach(pool => {
          console.log(`   - ${pool.name}: ${pool.apy}% APY`)
        })
      }
    }

    // 5. Test user stakes API (simulate)
    console.log('\n5. Testing user stakes...')
    const { data: stakes, error: stakesError } = await supabase
      .from('user_stakes')
      .select(`
        *,
        staking_pools(name, description, apy)
      `)
      .eq('user_id', authData.user.id)

    if (stakesError) {
      console.error('❌ Failed to get user stakes:', stakesError)
    } else {
      console.log(`✅ Found ${stakes?.length || 0} user stakes`)
      if (stakes && stakes.length > 0) {
        stakes.forEach(stake => {
          console.log(`   - ${stake.staking_pools?.name}: $${stake.amount} (${stake.status})`)
        })
      }
    }

    // 6. Test deposits API (simulate)
    console.log('\n6. Testing deposits...')
    const { data: deposits, error: depositsError } = await supabase
      .from('deposits')
      .select('*')
      .eq('user_id', authData.user.id)

    if (depositsError) {
      console.error('❌ Failed to get deposits:', depositsError)
    } else {
      console.log(`✅ Found ${deposits?.length || 0} deposits`)
    }

    // 7. Test withdrawals API (simulate)
    console.log('\n7. Testing withdrawals...')
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from('withdrawals')
      .select('*')
      .eq('user_id', authData.user.id)

    if (withdrawalsError) {
      console.error('❌ Failed to get withdrawals:', withdrawalsError)
    } else {
      console.log(`✅ Found ${withdrawals?.length || 0} withdrawals`)
    }

    // 8. Test rewards API (simulate)
    console.log('\n8. Testing rewards...')
    const { data: rewards, error: rewardsError } = await supabase
      .from('rewards')
      .select('*')
      .eq('user_id', authData.user.id)

    if (rewardsError) {
      console.error('❌ Failed to get rewards:', rewardsError)
    } else {
      console.log(`✅ Found ${rewards?.length || 0} rewards`)
      if (rewards && rewards.length > 0) {
        rewards.forEach(reward => {
          console.log(`   - ${reward.type}: $${reward.amount} (${reward.status})`)
        })
      }
    }

    // 9. Test transactions API (simulate)
    console.log('\n9. Testing transactions...')
    const { data: transactions, error: transactionsError } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', authData.user.id)

    if (transactionsError) {
      console.error('❌ Failed to get transactions:', transactionsError)
    } else {
      console.log(`✅ Found ${transactions?.length || 0} transactions`)
    }

    console.log('\n🎉 User login functionality test completed!')
    console.log('   All user features should be working properly.')
    console.log('   You can now test the web interface.')

  } catch (error) {
    console.error('❌ Error testing user login:', error)
  }
}

testUserLogin() 