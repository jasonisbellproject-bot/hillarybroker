require('dotenv').config();

async function testInvestmentPlansAPI() {
  try {
    console.log('🧪 Testing investment plans API...');
    
    const response = await fetch('http://localhost:3001/api/investment/plans', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Investment plans API successful!');
      console.log('📋 Plans returned:', data.length || 0);
      if (data.length > 0) {
        console.log('📋 First plan:', {
          id: data[0].id,
          name: data[0].name,
          min_amount: data[0].min_amount,
          max_amount: data[0].max_amount,
          duration: data[0].duration,
          return_rate: data[0].return_rate
        });
      }
    } else {
      console.log('❌ Investment plans API failed:', data.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing investment plans API:', error.message);
  }
}

testInvestmentPlansAPI();
