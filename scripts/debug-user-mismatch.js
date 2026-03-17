const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugUserMismatch() {
  try {
    console.log('🔍 Debugging user mismatch...');

    // First, let's sign in as admin
    console.log('🔐 Signing in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@bitsparetron.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }

    console.log('✅ Signed in successfully');
    console.log('   Auth User ID:', authData.user.id);

    // Check if user exists in auth.users
    console.log('🔍 Checking auth.users table...');
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(authData.user.id);
    
    if (authUserError) {
      console.error('❌ Auth user error:', authUserError);
    } else {
      console.log('✅ Auth user found:', authUser.user.email);
    }

    // Check if user exists in public.users
    console.log('🔍 Checking public.users table...');
    const { data: dbUser, error: dbUserError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (dbUserError) {
      console.error('❌ Database user error:', dbUserError);
    } else {
      console.log('✅ Database user found:', dbUser.email);
      console.log('   Is Admin:', dbUser.is_admin);
    }

    // Let's also check by email
    console.log('🔍 Checking by email...');
    const { data: emailUser, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@bitsparetron.com')
      .single();

    if (emailError) {
      console.error('❌ Email lookup error:', emailError);
    } else {
      console.log('✅ User found by email:', emailUser.email);
      console.log('   User ID:', emailUser.id);
      console.log('   Is Admin:', emailUser.is_admin);
      
      if (emailUser.id !== authData.user.id) {
        console.log('⚠️  ID MISMATCH DETECTED!');
        console.log('   Auth ID:', authData.user.id);
        console.log('   DB ID:', emailUser.id);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugUserMismatch(); 