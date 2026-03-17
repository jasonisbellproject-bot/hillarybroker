const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function fixAdminUserId() {
  console.log('🔍 Finding correct admin user ID...\n');

  try {
    // Find admin users
    const { data: adminUsers, error: adminError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, is_admin')
      .eq('is_admin', true);

    if (adminError) {
      console.log('❌ Error finding admin users:', adminError.message);
      return;
    }

    console.log(`✅ Found ${adminUsers?.length || 0} admin users:`);
    if (adminUsers && adminUsers.length > 0) {
      adminUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ID: ${user.id}`);
        console.log(`      Name: ${user.first_name} ${user.last_name}`);
        console.log(`      Email: ${user.email}`);
        console.log(`      Admin: ${user.is_admin}`);
        console.log('');
      });

      // Use the first admin user
      const correctAdminId = adminUsers[0].id;
      console.log(`🎯 Using admin user ID: ${correctAdminId}`);

      // Update the API routes with the correct admin ID
      const filesToUpdate = [
        'app/api/admin/users/route.ts',
        'app/api/admin/users/[id]/edit/route.ts',
        'app/api/admin/users/[id]/suspend/route.ts',
        'app/api/admin/users/[id]/activate/route.ts',
        'app/api/admin/users/[id]/kyc-review/route.ts'
      ];

      console.log('\n📝 Files that need to be updated:');
      filesToUpdate.forEach(file => {
        console.log(`   - ${file}`);
      });

      console.log('\n💡 To fix this, replace the hardcoded admin user ID in each file:');
      console.log(`   OLD: 'c7750996-2ecc-4889-9be6-8d506acb9a9a'`);
      console.log(`   NEW: '${correctAdminId}'`);

    } else {
      console.log('❌ No admin users found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the fix
fixAdminUserId();
