const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminUserManagement() {
  console.log('🧪 Testing Admin User Management Functionality...\n');

  try {
    // 1. Test fetching users
    console.log('1. Testing user fetch...');
    const response = await fetch('http://localhost:3000/api/admin/users');
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Users fetched successfully: ${data.users?.length || 0} users found`);
      if (data.users && data.users.length > 0) {
        console.log(`   Sample user: ${data.users[0].first_name} ${data.users[0].last_name} (${data.users[0].email})`);
      }
    } else {
      console.log('❌ Failed to fetch users:', response.status);
    }

    // 2. Test user creation
    console.log('\n2. Testing user creation...');
    const testUser = {
      first_name: 'Test',
      last_name: 'User',
      email: `testuser${Date.now()}@example.com`,
      is_admin: false,
      kyc_verified: true
    };

    const createResponse = await fetch('http://localhost:3000/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ User created successfully:', createData.user.email);
      
      // 3. Test user suspension
      console.log('\n3. Testing user suspension...');
      const suspendResponse = await fetch(`http://localhost:3000/api/admin/users/${createData.user.id}/suspend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (suspendResponse.ok) {
        const suspendData = await suspendResponse.json();
        console.log('✅ User suspended successfully');
        
        // 4. Test user activation
        console.log('\n4. Testing user activation...');
        const activateResponse = await fetch(`http://localhost:3000/api/admin/users/${createData.user.id}/activate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        if (activateResponse.ok) {
          console.log('✅ User activated successfully');
        } else {
          console.log('❌ Failed to activate user:', activateResponse.status);
        }
      } else {
        console.log('❌ Failed to suspend user:', suspendResponse.status);
      }

      // 5. Test KYC review
      console.log('\n5. Testing KYC review...');
      const kycResponse = await fetch(`http://localhost:3000/api/admin/users/${createData.user.id}/kyc-review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'approved',
          notes: 'Test KYC approval'
        })
      });

      if (kycResponse.ok) {
        console.log('✅ KYC review completed successfully');
      } else {
        console.log('❌ Failed to complete KYC review:', kycResponse.status);
      }

      // 6. Test user editing
      console.log('\n6. Testing user editing...');
      const editData = {
        first_name: 'Updated',
        last_name: 'User',
        email: testUser.email,
        wallet_balance: 1000,
        total_earned: 500,
        kyc_verified: true,
        is_admin: false,
        status: 'active'
      };

      const editResponse = await fetch(`http://localhost:3000/api/admin/users/${createData.user.id}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });

      if (editResponse.ok) {
        console.log('✅ User edited successfully');
      } else {
        console.log('❌ Failed to edit user:', editResponse.status);
      }

    } else {
      console.log('❌ Failed to create user:', createResponse.status);
    }

    console.log('\n🎉 Admin User Management testing completed!');

  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

// Run the test
testAdminUserManagement();
