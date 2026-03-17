import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

async function testEmailConnection() {
  console.log('🔍 Testing email server connection...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Email server connection successful');
      return true;
    } else {
      console.log('❌ Email server connection failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing email connection:', error.message);
    return false;
  }
}

async function testWelcomeEmail() {
  console.log('\n📧 Testing welcome email...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'welcome',
        data: { name: 'John Doe' }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Welcome email sent successfully');
      console.log('📧 Message ID:', data.messageId);
      return true;
    } else {
      console.log('❌ Welcome email failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing welcome email:', error.message);
    return false;
  }
}

async function testReferralBonusEmail() {
  console.log('\n🎉 Testing referral bonus email...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'referralBonus',
        data: { 
          name: 'John Doe', 
          amount: 500, 
          referredUser: 'Jane Smith' 
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Referral bonus email sent successfully');
      console.log('📧 Message ID:', data.messageId);
      return true;
    } else {
      console.log('❌ Referral bonus email failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing referral bonus email:', error.message);
    return false;
  }
}

async function testDepositApprovedEmail() {
  console.log('\n💰 Testing deposit approved email...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'depositApproved',
        data: { 
          name: 'John Doe', 
          amount: 1000, 
          reference: 'DEP123456789' 
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Deposit approved email sent successfully');
      console.log('📧 Message ID:', data.messageId);
      return true;
    } else {
      console.log('❌ Deposit approved email failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing deposit approved email:', error.message);
    return false;
  }
}

async function testKYCApprovedEmail() {
  console.log('\n✅ Testing KYC approved email...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'kycApproved',
        data: { name: 'John Doe' }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ KYC approved email sent successfully');
      console.log('📧 Message ID:', data.messageId);
      return true;
    } else {
      console.log('❌ KYC approved email failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing KYC approved email:', error.message);
    return false;
  }
}

async function testAdminNotificationEmail() {
  console.log('\n👨‍💼 Testing admin notification email...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        template: 'adminNotification',
        data: { 
          adminName: 'Admin User',
          notificationType: 'withdrawal_request',
          userFullName: 'John Doe',
          userEmail: 'john@example.com',
          amount: 1000,
          method: 'crypto',
          address: '0x1234567890abcdef',
          reference: 'WD123456789'
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Admin notification email sent successfully');
      console.log('📧 Message ID:', data.messageId);
      return true;
    } else {
      console.log('❌ Admin notification email failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing admin notification email:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting email functionality tests...\n');
  
  const tests = [
    testEmailConnection,
    testWelcomeEmail,
    testReferralBonusEmail,
    testDepositApprovedEmail,
    testKYCApprovedEmail,
    testAdminNotificationEmail
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error('❌ Test failed with error:', error.message);
      failed++;
    }
  }
  
  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All email tests passed! Email notifications are working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check your SMTP settings and try again.');
  }
}

// Run the tests
runAllTests().catch(console.error); 