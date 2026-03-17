require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixAdminAuth() {
  try {
    console.log('🔧 Fixing admin authentication...');
    
    // First, let's check the existing admin user
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
    
    // Create a new auth user with the same email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminUser.email,
      password: 'admin123456', // Set a default password
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: adminUser.first_name,
        last_name: adminUser.last_name,
      }
    });
    
    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log('ℹ️  Auth user already exists, trying to sign in...');
        
        // Try to sign in to test the credentials
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: adminUser.email,
          password: 'admin123456'
        });
        
        if (signInError) {
          console.log('❌ Sign in failed:', signInError.message);
          console.log('💡 You may need to reset the password or create a new admin user');
        } else {
          console.log('✅ Admin authentication working!');
          console.log('📧 Email:', adminUser.email);
          console.log('🔑 Password: admin123456');
        }
      } else {
        console.error('❌ Error creating auth user:', authError);
      }
      return;
    }
    
    console.log('✅ Admin auth user created successfully!');
    console.log('📧 Email:', adminUser.email);
    console.log('🔑 Password: admin123456');
    console.log('🆔 Auth User ID:', authData.user.id);
    
    // Update the database user to match the auth user ID
    const { error: updateError } = await supabase
      .from('users')
      .update({ id: authData.user.id })
      .eq('email', adminUser.email);
    
    if (updateError) {
      console.error('❌ Error updating user ID:', updateError);
    } else {
      console.log('✅ User ID updated successfully');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixAdminAuth();
