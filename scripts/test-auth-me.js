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

async function testAuthMe() {
  try {
    console.log('🔍 Testing /api/auth/me endpoint...')

    // First, let's login to get a session
    console.log('1. Logging in...')
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
    console.log('   Access Token:', authData.session.access_token ? 'Present' : 'Missing')

    // Now test getting user with the access token
    console.log('\n2. Testing getUser with access token...')
    const { data: { user }, error: userError } = await supabase.auth.getUser(authData.session.access_token)

    if (userError) {
      console.error('❌ getUser failed:', userError)
      return
    }

    console.log('✅ getUser successful')
    console.log('   User ID:', user.id)
    console.log('   Email:', user.email)

    // Test getting user profile
    console.log('\n3. Testing user profile fetch...')
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('❌ Profile fetch failed:', profileError)
      return
    }

    console.log('✅ Profile fetch successful')
    console.log('   Name:', `${profile.first_name} ${profile.last_name}`)
    console.log('   Email:', profile.email)
    console.log('   Is Admin:', profile.is_admin)

    console.log('\n🎉 All tests passed!')

  } catch (error) {
    console.error('❌ Error in auth test:', error)
  }
}

testAuthMe() 