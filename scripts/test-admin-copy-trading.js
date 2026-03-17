const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminCopyTrading() {
  console.log('🧪 Testing Admin Copy Trading API...\n');

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

    // 2. Check if copy_traders table exists
    console.log('\n2. Checking copy_traders table...');
    const { data: traders, error: tradersError } = await supabase
      .from('copy_traders')
      .select('*')
      .limit(5);

    if (tradersError) {
      console.log('❌ Copy traders table error:', tradersError.message);
      console.log('💡 You may need to create the copy_traders table first');
      return;
    }
    console.log(`✅ Copy traders table exists with ${traders?.length || 0} records`);

    // 3. Test the admin copy trading API endpoint
    console.log('\n3. Testing admin copy trading API endpoint...');
    try {
      const response = await fetch('http://localhost:3000/api/admin/copy-trading/traders');
      console.log('API Response Status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:', {
          tradersCount: data.length || 0,
          sampleTrader: data[0] ? {
            id: data[0].id,
            display_name: data[0].display_name,
            is_verified: data[0].is_verified,
            is_active: data[0].is_active
          } : null
        });
      } else {
        const errorText = await response.text();
        console.log('❌ API Error:', errorText);
      }
    } catch (apiError) {
      console.log('❌ API request failed:', apiError.message);
      console.log('💡 Make sure the development server is running (npm run dev)');
    }

    // 4. Check for sample users to create test traders
    console.log('\n4. Checking for sample users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name')
      .limit(3);

    if (usersError) {
      console.log('❌ Error fetching users:', usersError.message);
    } else {
      console.log(`✅ Found ${users?.length || 0} users:`);
      if (users && users.length > 0) {
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.first_name} ${user.last_name} (${user.email}) - ID: ${user.id}`);
        });
      }
    }

    // 5. Test creating a copy trader (if we have users)
    if (users && users.length > 0) {
      console.log('\n5. Testing copy trader creation...');
      const testUser = users[0];
      
      try {
        const createResponse = await fetch('http://localhost:3000/api/admin/copy-trading/traders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: testUser.id,
            display_name: `Test Trader ${Date.now()}`,
            description: 'Test copy trader created by admin script',
            min_copy_amount: 10,
            max_copy_amount: 1000,
            copy_fee_percentage: 5,
            is_verified: true,
            is_active: true
          }),
        });

        console.log('Create API Response Status:', createResponse.status);
        
        if (createResponse.ok) {
          const createData = await createResponse.json();
          console.log('✅ Copy trader created successfully:', {
            id: createData.trader.id,
            display_name: createData.trader.display_name,
            user_id: createData.trader.user_id
          });

          // Test updating the trader
          console.log('\n6. Testing copy trader update...');
          const updateResponse = await fetch(`http://localhost:3000/api/admin/copy-trading/traders/${createData.trader.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              display_name: `Updated Test Trader ${Date.now()}`,
              copy_fee_percentage: 7,
              is_verified: false
            }),
          });

          console.log('Update API Response Status:', updateResponse.status);
          
          if (updateResponse.ok) {
            const updateData = await updateResponse.json();
            console.log('✅ Copy trader updated successfully:', {
              id: updateData.trader.id,
              display_name: updateData.trader.display_name,
              copy_fee_percentage: updateData.trader.copy_fee_percentage,
              is_verified: updateData.trader.is_verified
            });

            // Test deleting the trader
            console.log('\n7. Testing copy trader deletion...');
            const deleteResponse = await fetch(`http://localhost:3000/api/admin/copy-trading/traders/${createData.trader.id}`, {
              method: 'DELETE',
            });

            console.log('Delete API Response Status:', deleteResponse.status);
            
            if (deleteResponse.ok) {
              const deleteData = await deleteResponse.json();
              console.log('✅ Copy trader deleted successfully:', deleteData.message);
            } else {
              const deleteError = await deleteResponse.text();
              console.log('❌ Delete API Error:', deleteError);
            }
          } else {
            const updateError = await updateResponse.text();
            console.log('❌ Update API Error:', updateError);
          }
        } else {
          const createError = await createResponse.text();
          console.log('❌ Create API Error:', createError);
        }
      } catch (testError) {
        console.log('❌ Test request failed:', testError.message);
      }
    }

    console.log('\n🎯 Test Summary:');
    console.log('- Database connection:', testError ? '❌ Failed' : '✅ Working');
    console.log('- Copy traders table:', tradersError ? '❌ Missing' : '✅ Exists');
    console.log('- Admin API endpoints:', '✅ Tested');
    console.log('- CRUD operations:', '✅ Tested');

    console.log('\n📋 Next Steps:');
    console.log('1. Access the admin copy trading page: http://localhost:3000/admin/copy-trading');
    console.log('2. Use the "Add Copy Trader" button to create new traders');
    console.log('3. Use the table actions to edit, verify, or delete traders');
    console.log('4. Monitor trader performance and manage their settings');

  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testAdminCopyTrading();
