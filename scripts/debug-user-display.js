const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugUserDisplay() {
  console.log('🔍 Debugging User Display Issues...\n');

  try {
    // 1. Check if we can connect to the database
    console.log('1. Testing database connection...');
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (testError) {
      console.log('❌ Database connection failed:', testError.message);
      return;
    }
    console.log('✅ Database connection successful');

    // 2. Check total number of users
    console.log('\n2. Checking total users in database...');
    const { count: totalUsers, error: countError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error counting users:', countError.message);
    } else {
      console.log(`✅ Total users in database: ${totalUsers}`);
    }

    // 3. Get sample users
    console.log('\n3. Fetching sample users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Found ${users?.length || 0} users:`);
      if (users && users.length > 0) {
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.first_name} ${user.last_name} (${user.email}) - Admin: ${user.is_admin}`);
        });
      } else {
        console.log('   No users found in database');
      }
    }

    // 4. Check admin user specifically
    console.log('\n4. Checking admin user...');
    const adminUserId = 'c7750996-2ecc-4889-9be6-8d506acb9a9a';
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('*')
      .eq('id', adminUserId)
      .single();

    if (adminError) {
      console.log('❌ Admin user not found:', adminError.message);
    } else {
      console.log('✅ Admin user found:', adminUser.email, '- Admin status:', adminUser.is_admin);
    }

    // 5. Test the API endpoint directly
    console.log('\n5. Testing API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/admin/users');
      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:', {
          usersCount: data.users?.length || 0,
          pagination: data.pagination
        });
        
        if (data.users && data.users.length > 0) {
          console.log('Sample user from API:', {
            name: `${data.users[0].first_name} ${data.users[0].last_name}`,
            email: data.users[0].email,
            status: data.users[0].status,
            kyc_verified: data.users[0].kyc_verified
          });
        }
      } else {
        const errorText = await response.text();
        console.log('❌ API Error:', errorText);
      }
    } catch (apiError) {
      console.log('❌ API request failed:', apiError.message);
    }

    // 6. Check financial_stats table
    console.log('\n6. Checking financial_stats table...');
    const { data: financialStats, error: financialError } = await supabase
      .from('financial_stats')
      .select('*')
      .limit(3);

    if (financialError) {
      console.log('❌ Financial stats table error:', financialError.message);
    } else {
      console.log(`✅ Financial stats records: ${financialStats?.length || 0}`);
    }

    console.log('\n🎯 Debug Summary:');
    console.log('- Database connection:', testError ? '❌ Failed' : '✅ Working');
    console.log('- Total users:', totalUsers || 0);
    console.log('- Admin user exists:', adminError ? '❌ No' : '✅ Yes');
    console.log('- API endpoint:', '✅ Tested');

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

// Run the debug
debugUserDisplay();
