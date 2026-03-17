import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: '.env.local' });

const BASE_URL = 'http://localhost:3000';

async function testWithdrawalRequest() {
  console.log('💰 Testing withdrawal request notification...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/withdrawals/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'your-session-cookie-here' // You'll need to add a valid session cookie
      },
      body: JSON.stringify({
        amount: 500,
        method: 'bitcoin',
        address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Withdrawal request created successfully');
      console.log('📧 Admin notification should have been sent');
      return true;
    } else {
      console.log('❌ Withdrawal request failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing withdrawal request:', error.message);
    return false;
  }
}

async function testDepositRequest() {
  console.log('\n💰 Testing deposit request notification...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/deposits/create`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Cookie': 'your-session-cookie-here' // You'll need to add a valid session cookie
      },
      body: JSON.stringify({
        amount: 1000,
        method: 'bitcoin',
        transactionHash: '0x1234567890abcdef',
        paymentProof: 'proof.jpg',
        walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Deposit request created successfully');
      console.log('📧 Admin notification should have been sent');
      return true;
    } else {
      console.log('❌ Deposit request failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing deposit request:', error.message);
    return false;
  }
}

async function checkAdminEmails() {
  console.log('\n👨‍💼 Checking admin email configuration...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Email server connection successful');
      console.log('');
      console.log('📧 Admin email configuration:');
      console.log('- ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'Not set');
      console.log('- ADMIN_NAME:', process.env.ADMIN_NAME || 'Admin');
      console.log('');
      console.log('💡 To configure admin emails, add to your .env.local:');
      console.log('ADMIN_EMAIL=ewaenpatrick5@gmail.com');
      console.log('ADMIN_NAME=Admin Team');
      
      return true;
    } else {
      console.log('❌ Email server connection failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error checking admin emails:', error.message);
    return false;
  }
}

async function testAdminNotification() {
  console.log('\n📧 Testing admin notification email...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'adminNotification',
        data: {
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
      console.log('📧 Results:', data.results || data.messageId);
      return true;
    } else {
      console.log('❌ Admin notification email failed:', data.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing admin notification:', error.message);
    return false;
  }
}

async function runAdminTests() {
  console.log('🚀 Starting admin notification tests...\n');
  
  const tests = [
    checkAdminEmails,
    testAdminNotification,
    // testWithdrawalRequest,  // Uncomment when you have valid session
    // testDepositRequest      // Uncomment when you have valid session
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
  
  console.log('\n📋 Next Steps:');
  console.log('1. Admin email is configured: ewaenpatrick5@gmail.com');
  console.log('2. Test with real user sessions');
  console.log('3. Verify admin notifications are received');
  console.log('');
  console.log('📧 Current .env.local configuration:');
  console.log('ADMIN_EMAIL=ewaenpatrick5@gmail.com');
  console.log('ADMIN_NAME=Admin Team');
}

// Run the tests
runAdminTests().catch(console.error); 