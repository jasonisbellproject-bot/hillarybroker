const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login...');

    const adminEmail = 'admin@bitsparetron.com';
    const adminPassword = 'Admin123!';

    // Try to sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError) {
      console.error('❌ Login failed:', authError.message);
      return;
    }

    console.log('✅ Login successful!');
    console.log('👤 User ID:', authData.user.id);
    console.log('📧 Email:', authData.user.email);
    console.log('🔑 Session:', authData.session ? 'Valid' : 'Invalid');

    // Check user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch failed:', profileError.message);
      return;
    }

    console.log('✅ Profile found:');
    console.log('👤 Name:', userProfile.first_name, userProfile.last_name);
    console.log('👑 Is Admin:', userProfile.is_admin);
    console.log('✅ KYC Verified:', userProfile.kyc_verified);
    console.log('💰 Wallet Balance:', userProfile.wallet_balance);

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminLogin(); 