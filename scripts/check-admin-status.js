const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAdminStatus() {
  try {
    console.log('🔍 Checking admin user status...');

    // Check the specific admin user
    const { data: adminUser, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@bitsparetron.com')
      .single();

    if (error) {
      console.error('❌ Error fetching admin user:', error);
      return;
    }

    if (!adminUser) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('   ID:', adminUser.id);
    console.log('   Email:', adminUser.email);
    console.log('   Name:', adminUser.first_name, adminUser.last_name);
    console.log('   Is Admin:', adminUser.is_admin ? '✅ YES' : '❌ NO');
    console.log('   Status:', adminUser.status);
    console.log('   Created:', adminUser.created_at);

    if (!adminUser.is_admin) {
      console.log('\n🔧 Fixing admin status...');
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('email', 'admin@bitsparetron.com');

      if (updateError) {
        console.error('❌ Error updating admin status:', updateError);
      } else {
        console.log('✅ Admin status updated successfully!');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkAdminStatus(); 