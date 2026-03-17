async function testDashboardAPI() {
  console.log('🔍 Testing Dashboard API Endpoints')
  console.log('==================================')
  
  const baseUrl = 'http://localhost:3000'
  
  // Test 1: Check if server is running
  console.log('\n1. Testing server connection...')
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/stats`)
    console.log(`Server status: ${response.status}`)
    
    if (response.status === 401) {
      console.log('✅ Server is running (401 expected - no auth)')
    } else if (response.status === 200) {
      console.log('✅ Server is running and returning data')
    } else {
      console.log(`⚠️ Server responded with status: ${response.status}`)
    }
  } catch (error) {
    console.log('❌ Server not running or not accessible')
    console.log('Make sure to run: npm run dev')
    return
  }
  
  // Test 2: Check stats endpoint
  console.log('\n2. Testing stats endpoint...')
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/stats`)
    const data = await response.json()
    
    if (response.status === 401) {
      console.log('✅ Stats endpoint requires authentication (expected)')
    } else if (response.status === 200) {
      console.log('✅ Stats endpoint working:', data)
    } else {
      console.log(`⚠️ Stats endpoint status: ${response.status}`)
      console.log('Response:', data)
    }
  } catch (error) {
    console.error('❌ Error testing stats endpoint:', error.message)
  }
  
  // Test 3: Check transactions endpoint
  console.log('\n3. Testing transactions endpoint...')
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/transactions`)
    const data = await response.json()
    
    if (response.status === 401) {
      console.log('✅ Transactions endpoint requires authentication (expected)')
    } else if (response.status === 200) {
      console.log('✅ Transactions endpoint working:', data)
    } else {
      console.log(`⚠️ Transactions endpoint status: ${response.status}`)
      console.log('Response:', data)
    }
  } catch (error) {
    console.error('❌ Error testing transactions endpoint:', error.message)
  }
  
  // Test 4: Check investments endpoint
  console.log('\n4. Testing investments endpoint...')
  try {
    const response = await fetch(`${baseUrl}/api/dashboard/investments`)
    const data = await response.json()
    
    if (response.status === 401) {
      console.log('✅ Investments endpoint requires authentication (expected)')
    } else if (response.status === 200) {
      console.log('✅ Investments endpoint working:', data)
    } else {
      console.log(`⚠️ Investments endpoint status: ${response.status}`)
      console.log('Response:', data)
    }
  } catch (error) {
    console.error('❌ Error testing investments endpoint:', error.message)
  }
  
  console.log('\n📝 Troubleshooting Steps:')
  console.log('1. Make sure the server is running: npm run dev')
  console.log('2. Visit: http://localhost:3000/login')
  console.log('3. Login with: test@example.com / password123')
  console.log('4. Check browser console for any errors')
  console.log('5. Check Network tab in DevTools for API calls')
  
  console.log('\n🔧 Common Issues:')
  console.log('- If you see 401 errors: This is normal, endpoints require login')
  console.log('- If you see 500 errors: Check server logs for details')
  console.log('- If you see 404 errors: API routes might not be working')
  console.log('- If dashboard shows no data: Check browser console for errors')
  
  console.log('\n🎯 Next Steps:')
  console.log('1. Open your browser and go to: http://localhost:3000')
  console.log('2. Click "Login" or go to: http://localhost:3000/login')
  console.log('3. Use these credentials:')
  console.log('   Email: test@example.com')
  console.log('   Password: password123')
  console.log('4. After login, you should see your dashboard with data')
}

testDashboardAPI().catch(console.error) 