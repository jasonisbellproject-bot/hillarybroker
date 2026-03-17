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

async function testAuth() {
  try {
    console.log('🔍 Testing authentication...')

    // Test user login
    console.log('1. Testing user login...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })

    if (authError) {
      console.error('❌ Login failed:', authError)
      return
    }

    console.log('✅ Login successful')
    console.log('   User ID:', authData.user.id)
    console.log('   Email:', authData.user.email)

    // Test getting user profile
    console.log('\n2. Testing user profile fetch...')
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    if (profileError) {
      console.error('❌ Profile fetch failed:', profileError)
      return
    }

    console.log('✅ Profile fetch successful')
    console.log('   Name:', `${profile.first_name} ${profile.last_name}`)
    console.log('   Email:', profile.email)
    console.log('   Is Admin:', profile.is_admin)
    console.log('   KYC Verified:', profile.kyc_verified)

    // Test wallet addresses table
    console.log('\n3. Testing wallet addresses table...')
    const { data: walletAddresses, error: walletError } = await supabase
      .from('wallet_addresses')
      .select('*')

    if (walletError) {
      console.error('❌ Wallet addresses fetch failed:', walletError)
      console.log('\n📋 You need to create the wallet_addresses table first.')
      console.log('   Run the SQL provided by the manual-create-wallet-addresses.js script')
    } else {
      console.log('✅ Wallet addresses fetch successful')
      console.log('   Found', walletAddresses.length, 'wallet addresses')
      walletAddresses.forEach(wa => {
        console.log(`   - ${wa.name} (${wa.type})`)
      })
    }

    console.log('\n🎉 Authentication test completed!')

  } catch (error) {
    console.error('❌ Error in auth test:', error)
  }
}

testAuth() 