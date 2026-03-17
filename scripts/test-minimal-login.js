require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testMinimalLogin() {
  console.log('🔍 Testing minimal login...');
  
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    console.log('🔍 Step 1: Basic authentication...');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('❌ Auth error:', error);
      return;
    }
    
    console.log('✅ Step 1: Authentication successful');
    console.log('🔍 User ID:', data.user?.id);
    
    console.log('🔍 Step 2: Check if user exists in users table...');
    
    const { data: userCheck, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      console.error('❌ User table error:', userError);
      console.log('🔍 This might be the issue - user not found in users table');
      return;
    }
    
    console.log('✅ Step 2: User found in users table');
    console.log('🔍 User data:', userCheck);
    
    console.log('🔍 Step 3: Test full profile fetch...');
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
      console.log('🔍 This might be the issue - profile fetch failed');
      return;
    }
    
    console.log('✅ Step 3: Full profile fetch successful');
    console.log('🔍 Profile keys:', Object.keys(profile));
    
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

testMinimalLogin(); 