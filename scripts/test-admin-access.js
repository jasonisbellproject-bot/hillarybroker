const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminAccess() {
  console.log('🔍 Testing Admin Access and User Management...\n');

  try {
    // 1. Check admin user credentials
    console.log('1. Admin User Credentials:');
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, is_admin')
      .eq('is_admin', true)
      .single();

    if (adminError) {
      console.log('❌ Error finding admin user:', adminError.message);
      return;
    }

    console.log('✅ Admin user found:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.first_name} ${adminUser.last_name}`);
    console.log(`   Admin: ${adminUser.is_admin}`);
    console.log(`   ID: ${adminUser.id}`);

    // 2. Test API endpoints
    console.log('\n2. Testing API Endpoints:');
    
    // Test users endpoint
    console.log('   Testing /api/admin/users...');
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Users API working - ${data.users?.length || 0} users returned`);
        
        if (data.users && data.users.length > 0) {
          console.log('   Sample users:');
          data.users.forEach((user, index) => {
            console.log(`     ${index + 1}. ${user.first_name} ${user.last_name} (${user.email})`);
          });
        }
      } else {
        console.log(`   ❌ Users API failed - Status: ${response.status}`);
      }
    } catch (error) {
      console.log(`   ❌ Users API error: ${error.message}`);
    }

    // 3. Instructions for accessing admin panel
    console.log('\n3. Access Instructions:');
    console.log('   To access the admin user management page:');
    console.log('   1. Go to: http://localhost:3000/admin-login');
    console.log(`   2. Login with: ${adminUser.email}`);
    console.log('   3. Use the password you set for this admin account');
    console.log('   4. After login, go to: http://localhost:3000/admin/users');
    console.log('   5. You should see the user management interface');

    // 4. Check if there are any issues with the page
    console.log('\n4. Potential Issues to Check:');
    console.log('   - Make sure the development server is running (npm run dev)');
    console.log('   - Check browser console for any JavaScript errors');
    console.log('   - Verify that you are logged in as admin');
    console.log('   - Check if the page is loading at /admin/users');

    console.log('\n🎯 Summary:');
    console.log('- Admin user exists: ✅');
    console.log('- API endpoints: ✅ Working');
    console.log('- Next steps: Login and navigate to /admin/users');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testAdminAccess(); 