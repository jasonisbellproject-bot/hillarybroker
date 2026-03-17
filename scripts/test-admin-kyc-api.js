require('dotenv').config();

async function testAdminKYCApi() {
  try {
    console.log('🧪 Testing admin KYC API...');
    
    const response = await fetch('http://localhost:3001/api/admin/kyc', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Admin KYC API successful!');
      console.log('📋 KYC documents returned:', data.length || 0);
    } else {
      console.log('❌ Admin KYC API failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing admin KYC API:', error.message);
  }
}

testAdminKYCApi();
