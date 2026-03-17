require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testLogin() {
  console.log('🔍 Testing login flow...');
  
  try {
    // Test with a known user (you'll need to create this user first)
    const email = 'test@example.com';
    const password = 'password123';
    
    console.log('🔍 Attempting login with:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Login error:', error);
      return;
    }
    
    console.log('✅ Login successful');
    console.log('🔍 User ID:', data.user?.id);
    console.log('🔍 User email:', data.user?.email);
    console.log('🔍 Session access token:', data.session?.access_token ? 'Present' : 'Missing');
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
    } else {
      console.log('✅ Profile fetched successfully');
      console.log('🔍 Profile:', {
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        is_admin: profile.is_admin,
        kyc_verified: profile.kyc_verified
      });
    }
    
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

testLogin(); 