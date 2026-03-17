require('dotenv').config();

async function testAdminUsersAPI() {
  try {
    console.log('🧪 Testing admin users API...');
    
    const response = await fetch('http://localhost:3001/api/admin/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Admin users API successful!');
      console.log('👥 Total users returned:', data.length || 0);
      if (data.length > 0) {
        console.log('📋 First user:', {
          id: data[0].id,
          email: data[0].email,
          is_admin: data[0].is_admin,
          kyc_verified: data[0].kyc_verified
        });
      }
    } else {
      console.log('❌ Admin users API failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin users API:', error.message);
  }
}

testAdminUsersAPI();
