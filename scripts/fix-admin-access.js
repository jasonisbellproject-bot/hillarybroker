require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminAccess() {
  try {
    console.log('🔧 Fixing admin access...');
    
    // First, let's check the current admin user
    const { data: adminUser, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('is_admin', true)
      .single();
    
    if (fetchError) {
      console.error('❌ Error fetching admin user:', fetchError);
      return;
    }
    
    console.log('📋 Found admin user:', adminUser.email);
    console.log('🆔 User ID:', adminUser.id);
    console.log('👑 Admin status:', adminUser.is_admin);
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminUser.email,
      password: 'aaasssaaa'
    });
    
    if (authError) {
      console.error('❌ Authentication failed:', authError.message);
      return;
    }
    
    console.log('✅ Authentication successful');
    console.log('🔑 Auth User ID:', authData.user.id);
    
    // Check if the auth user ID matches the database user ID
    if (authData.user.id !== adminUser.id) {
      console.log('⚠️  User ID mismatch detected');
      console.log('📊 Database User ID:', adminUser.id);
      console.log('🔐 Auth User ID:', authData.user.id);
      
      // Update the database user ID to match the auth user ID
      console.log('🔄 Updating database user ID...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ id: authData.user.id })
        .eq('email', adminUser.email);
      
      if (updateError) {
        console.error('❌ Error updating user ID:', updateError);
      } else {
        console.log('✅ User ID updated successfully');
      }
    }
    
    // Now test admin access with the correct user ID
    console.log('🧪 Testing admin access...');
    const { data: testUser, error: testError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();
    
    if (testError) {
      console.error('❌ Error testing admin access:', testError);
      
      // Try to fix by updating the user directly
      console.log('🔄 Attempting to fix admin status...');
      const { error: fixError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('email', adminUser.email);
      
      if (fixError) {
        console.error('❌ Error fixing admin status:', fixError);
      } else {
        console.log('✅ Admin status updated');
      }
    } else {
      console.log('✅ Admin access working!');
      console.log('👑 Admin status:', testUser.is_admin ? 'Yes' : 'No');
    }
    
    console.log('🎉 Admin access fix completed!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password: aaasssaaa');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixAdminAccess();
