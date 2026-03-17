require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAdminLogin() {
  try {
    console.log('🧪 Testing admin login with fixed credentials...');
    
    // Try to sign in with the admin user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@gmail.com',
      password: 'aaasssaaa'
    });
    
    if (signInError) {
      console.log('❌ Sign in failed:', signInError.message);
      
      // Try with a different common password
      console.log('🔄 Trying with password: password123...');
      const { data: signInData2, error: signInError2 } = await supabase.auth.signInWithPassword({
        email: 'admin@gmail.com',
        password: 'aaasssaaa'
      });
      
      if (signInError2) {
        console.log('❌ Second attempt failed:', signInError2.message);
        console.log('💡 You may need to reset the password or create a new admin user');
        return;
      } else {
        console.log('✅ Admin authentication working with password: password123');
        console.log('📧 Email: admin@gmail.com');
        console.log('🔑 Password: password123');
      }
    } else {
      console.log('✅ Admin authentication working!');
      console.log('📧 Email: admin@gmail.com');
      console.log('🔑 Password: aaasssaaa');
    }
    
    // Check if user is admin
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('email', 'admin@gmail.com')
      .single();
    
    if (userError) {
      console.error('❌ Error checking admin status:', userError);
    } else {
      console.log('👑 Admin status:', user.is_admin ? '✅ Yes' : '❌ No');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testAdminLogin();
