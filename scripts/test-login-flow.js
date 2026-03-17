require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testLoginFlow() {
  console.log('🔍 Testing login flow...');
  
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    console.log('🔍 Step 1: Attempting login with Supabase...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Login error:', error);
      return;
    }
    
    console.log('✅ Step 1: Login successful');
    console.log('🔍 User ID:', data.user?.id);
    console.log('🔍 Access token exists:', !!data.session?.access_token);
    console.log('🔍 Refresh token exists:', !!data.session?.refresh_token);
    
    console.log('🔍 Step 2: Testing session validation...');
    
    // Test if we can get user with the access token
    const { data: userData, error: userError } = await supabase.auth.getUser(data.session.access_token);
    
    if (userError) {
      console.error('❌ User validation error:', userError);
    } else {
      console.log('✅ Step 2: Session validation successful');
      console.log('🔍 Validated user ID:', userData.user?.id);
    }
    
    console.log('🔍 Step 3: Testing user profile fetch...');
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
    } else {
      console.log('✅ Step 3: Profile fetch successful');
      console.log('🔍 Profile:', {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        is_admin: profile.is_admin,
        kyc_verified: profile.kyc_verified
      });
    }
    
    console.log('🔍 Step 4: Testing session persistence...');
    
    // Test if session persists after a delay
    setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('🔍 Session after delay:', !!session);
      if (session) {
        console.log('✅ Step 4: Session persists correctly');
      } else {
        console.log('❌ Step 4: Session lost after delay');
      }
    }, 1000);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Check if we have the required environment variables
console.log('🔍 Environment check:');
console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('🔍 Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

testLoginFlow(); 