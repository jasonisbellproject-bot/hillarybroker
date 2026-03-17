const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Use the anon key like middleware does
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testMiddlewareQuery() {
  try {
    console.log('🔍 Testing middleware-style query...');

    // First, let's sign in as admin
    console.log('🔐 Signing in as admin...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'admin@bitsparetron.com',
      password: 'Admin123!'
    });

    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }

    console.log('✅ Signed in successfully');
    console.log('   User ID:', authData.user.id);

    // Now try the same query that middleware does
    console.log('🔍 Testing middleware query...');
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', authData.user.id)
      .single();

    console.log('🔍 Query result:', { user, userError });

    if (userError) {
      console.log('❌ Query failed:', userError);
      
      // Let's try without .single() to see if we get any results
      console.log('🔍 Trying without .single()...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', authData.user.id);

      console.log('🔍 Multiple results:', { users, usersError });
    } else {
      console.log('✅ Query successful!');
      console.log('   Is Admin:', user.is_admin);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testMiddlewareQuery(); 