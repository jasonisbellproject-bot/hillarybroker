require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixRLSPolicies() {
  try {
    console.log('🔧 Fixing RLS policies...');
    
    // Drop existing policies that might cause infinite recursion
    const policiesToDrop = [
      'users_policy',
      'users_select_policy',
      'users_insert_policy',
      'users_update_policy',
      'users_delete_policy'
    ];
    
    for (const policyName of policiesToDrop) {
      try {
        await supabase.rpc('drop_policy_if_exists', {
          table_name: 'users',
          policy_name: policyName
        });
        console.log(`✅ Dropped policy: ${policyName}`);
      } catch (error) {
        console.log(`ℹ️  Policy ${policyName} doesn't exist or already dropped`);
      }
    }
    
    // Create new, simpler policies
    const { error: selectError } = await supabase.rpc('create_policy', {
      table_name: 'users',
      policy_name: 'users_select_policy',
      definition: 'SELECT USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true))',
      operation: 'SELECT'
    });
    
    if (selectError) {
      console.error('❌ Error creating select policy:', selectError);
    } else {
      console.log('✅ Created select policy');
    }
    
    const { error: insertError } = await supabase.rpc('create_policy', {
      table_name: 'users',
      policy_name: 'users_insert_policy',
      definition: 'INSERT WITH CHECK (auth.uid() = id)',
      operation: 'INSERT'
    });
    
    if (insertError) {
      console.error('❌ Error creating insert policy:', insertError);
    } else {
      console.log('✅ Created insert policy');
    }
    
    const { error: updateError } = await supabase.rpc('create_policy', {
      table_name: 'users',
      policy_name: 'users_update_policy',
      definition: 'UPDATE USING (auth.uid() = id OR auth.uid() IN (SELECT id FROM users WHERE is_admin = true))',
      operation: 'UPDATE'
    });
    
    if (updateError) {
      console.error('❌ Error creating update policy:', updateError);
    } else {
      console.log('✅ Created update policy');
    }
    
    // Test the fix
    console.log('🧪 Testing admin user access...');
    const { data: adminUser, error: testError } = await supabase
      .from('users')
      .select('email, is_admin')
      .eq('email', 'admin@gmail.com')
      .single();
    
    if (testError) {
      console.error('❌ Still having issues:', testError);
    } else {
      console.log('✅ Admin user access working!');
      console.log('📧 Email:', adminUser.email);
      console.log('👑 Admin status:', adminUser.is_admin ? 'Yes' : 'No');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

fixRLSPolicies();
