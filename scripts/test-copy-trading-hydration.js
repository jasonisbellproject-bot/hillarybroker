require('dotenv').config();

async function testCopyTradingHydration() {
  try {
    console.log('🧪 Testing copy trading page for hydration issues...\n');
    
    // Test the page loads without errors
    console.log('📋 Testing page accessibility...');
    const pageResponse = await fetch('http://localhost:3001/copy-trading');
    console.log('Page status:', pageResponse.status);
    
    if (pageResponse.ok) {
      console.log('✅ Copy trading page is accessible');
    } else {
      console.log('❌ Copy trading page failed to load');
    }
    
    // Test the API endpoint
    console.log('\n📋 Testing API endpoint...');
    const apiResponse = await fetch('http://localhost:3001/api/copy-trading/traders?limit=5');
    console.log('API status:', apiResponse.status);
    
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log('✅ API endpoint working');
      console.log('📊 Traders returned:', data.length);
    } else {
      const errorData = await apiResponse.json();
      console.log('❌ API endpoint failed:', errorData.error);
    }
    
    console.log('\n💡 To test hydration issues:');
    console.log('1. Open http://localhost:3001/copy-trading in your browser');
    console.log('2. Check the browser console for hydration warnings');
    console.log('3. Look for "bis_skin_checked" attributes in the DOM');
    console.log('4. The suppressHydrationWarning should prevent the error');
    
  } catch (error) {
    console.error('❌ Error testing copy trading hydration:', error.message);
  }
}

testCopyTradingHydration();
