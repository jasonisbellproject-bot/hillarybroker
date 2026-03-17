const { createClient } = require('@supabase/supabase-js')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testSession() {
  console.log('🔍 Testing Session and Authentication')
  console.log('=====================================')
  
  // Test 1: Check if we can connect to Supabase
  console.log('\n1. Testing Supabase connection...')
  try {
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Database connection failed:', error)
      return
    }
    
    console.log('✅ Database connection successful')
  } catch (error) {
    console.error('❌ Connection test failed:', error)
    return
  }

  // Test 2: Try to sign in with test user
  console.log('\n2. Testing sign in...')
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    })
    
    if (error) {
      console.error('❌ Sign in failed:', error.message)
      console.log('\nPossible solutions:')
      console.log('1. Create test user: node scripts/create-test-user.js')
      console.log('2. Check if user exists in database')
      console.log('3. Verify password is correct')
    } else {
      console.log('✅ Sign in successful')
      console.log('User ID:', data.user.id)
      console.log('User Email:', data.user.email)
      console.log('Session created:', !!data.session)
      
      if (data.session) {
        console.log('Access token present:', !!data.session.access_token)
        console.log('Refresh token present:', !!data.session.refresh_token)
      }
    }
  } catch (error) {
    console.error('❌ Sign in error:', error)
  }

  // Test 3: Check current session
  console.log('\n3. Checking current session...')
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Session check failed:', error)
    } else if (session) {
      console.log('✅ Session found')
      console.log('User:', session.user.email)
      console.log('Session valid:', !!session.access_token)
    } else {
      console.log('❌ No active session found')
    }
  } catch (error) {
    console.error('❌ Session check error:', error)
  }

  // Test 4: Sign out
  console.log('\n4. Testing sign out...')
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ Sign out failed:', error)
    } else {
      console.log('✅ Sign out successful')
    }
  } catch (error) {
    console.error('❌ Sign out error:', error)
  }

  console.log('\n📝 Next Steps:')
  console.log('1. If sign in failed, create test user: node scripts/create-test-user.js')
  console.log('2. If sign in worked, try logging in through the web interface')
  console.log('3. Check browser console for session-related errors')
  console.log('4. Clear browser cookies if session issues persist')
}

testSession().catch(console.error) 