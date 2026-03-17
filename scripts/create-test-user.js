require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestUser() {
  console.log('🔍 Creating test user...');
  
  try {
    const email = 'test@example.com';
    const password = 'password123';
    
    // Check if user already exists by trying to get user profile
    const { data: existingProfile } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (existingProfile) {
      console.log('✅ User already exists:', existingProfile.id);
      
      // Try to sign in to test the password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (signInError) {
        console.log('⚠️ Password might be different, creating new user...');
        // Delete existing user and create new one
        await supabase.auth.admin.deleteUser(existingProfile.id);
        await supabase.from('users').delete().eq('id', existingProfile.id);
      } else {
        console.log('✅ Existing user can sign in successfully');
        return signInData.user;
      }
    }
    
    // Create new user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });
    
    if (createError) {
      console.error('❌ Error creating user:', createError);
      return;
    }
    
    console.log('✅ User created successfully:', newUser.user.id);
    
    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: newUser.user.id,
        email: email,
        first_name: 'Test',
        last_name: 'User',
        is_admin: false,
        kyc_verified: false,
        wallet_balance: 1000.00,
        total_earned: 0.00,
        total_staked: 0.00,
        referral_code: 'TEST123'
      });
    
    if (profileError) {
      console.error('❌ Error creating profile:', profileError);
    } else {
      console.log('✅ User profile created successfully');
    }
    
    // Test sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    
    if (signInError) {
      console.error('❌ Error signing in:', signInError);
    } else {
      console.log('✅ User can sign in successfully');
      console.log('🔍 Session access token:', signInData.session?.access_token ? 'Present' : 'Missing');
    }
    
    return newUser.user;
    
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

createTestUser(); 