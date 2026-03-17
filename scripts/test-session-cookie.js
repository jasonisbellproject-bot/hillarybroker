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

async function testSessionCookie() {
  try {
    console.log('🔍 Testing session cookie format...')

    // Login to get a session
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
    console.log('   Session:', authData.session ? 'Present' : 'Missing')

    // Simulate the session cookie format
    const sessionData = {
      user: authData.user,
      session: authData.session
    }

    const sessionCookie = encodeURIComponent(JSON.stringify(sessionData))
    console.log('\n2. Session cookie format:')
    console.log('   Cookie length:', sessionCookie.length)
    console.log('   User ID in cookie:', sessionData.user.id)

    // Test parsing
    console.log('\n3. Testing cookie parsing...')
    const parsedData = JSON.parse(decodeURIComponent(sessionCookie))
    console.log('✅ Parsing successful')
    console.log('   Parsed user ID:', parsedData.user?.id)
    console.log('   Parsed email:', parsedData.user?.email)

    console.log('\n🎉 Session cookie test completed!')

  } catch (error) {
    console.error('❌ Error in session cookie test:', error)
  }
}

testSessionCookie() 