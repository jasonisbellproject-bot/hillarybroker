#!/usr/bin/env node

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

async function testEmailNotifications() {
  console.log('🧪 Testing Email Notifications...\n');

  // Test deposit approved email
  console.log('💰 Testing deposit approved email...');
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
    } else {
      console.log('❌ Deposit approved email failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing deposit approved email:', error.message);
  }

  // Test withdrawal approved email
  console.log('\n💰 Testing withdrawal approved email...');
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'withdrawalApproved',
        data: { 
          name: 'John Doe', 
          amount: 500, 
          reference: 'WTH123456789' 
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Withdrawal approved email sent successfully');
      console.log('📧 Message ID:', data.messageId);
    } else {
      console.log('❌ Withdrawal approved email failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing withdrawal approved email:', error.message);
  }

  // Test deposit rejected email
  console.log('\n❌ Testing deposit rejected email...');
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'depositRejected',
        data: { 
          name: 'John Doe', 
          amount: 1000, 
          reference: 'DEP123456789',
          reason: 'Invalid payment method'
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Deposit rejected email sent successfully');
      console.log('📧 Message ID:', data.messageId);
    } else {
      console.log('❌ Deposit rejected email failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing deposit rejected email:', error.message);
  }

  // Test withdrawal rejected email
  console.log('\n❌ Testing withdrawal rejected email...');
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'withdrawalRejected',
        data: { 
          name: 'John Doe', 
          amount: 500, 
          reference: 'WTH123456789',
          reason: 'Insufficient balance'
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Withdrawal rejected email sent successfully');
      console.log('📧 Message ID:', data.messageId);
    } else {
      console.log('❌ Withdrawal rejected email failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing withdrawal rejected email:', error.message);
  }

  // Test KYC approved email
  console.log('\n✅ Testing KYC approved email...');
  try {
    const response = await fetch(`${BASE_URL}/api/test-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        template: 'kycApproved',
        data: { 
          name: 'John Doe'
        }
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ KYC approved email sent successfully');
      console.log('📧 Message ID:', data.messageId);
    } else {
      console.log('❌ KYC approved email failed:', data.error);
    }
  } catch (error) {
    console.error('❌ Error testing KYC approved email:', error.message);
  }

  console.log('\n🎉 Email notification testing completed!');
}

// Run the test
testEmailNotifications().catch(console.error); 