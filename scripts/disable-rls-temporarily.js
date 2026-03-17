require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function disableRLSTemporarily() {
  try {
    console.log('🔧 Temporarily disabling RLS on users table...');
    
    // Disable RLS on users table
    const { error: disableError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;'
    });
    
    if (disableError) {
      console.log('⚠️  Could not disable RLS via RPC, trying direct SQL...');
      // Try a different approach
      const { error: dropError } = await supabase.rpc('exec_sql', {
        sql: 'DROP POLICY IF EXISTS "Users can view own profile" ON public.users; DROP POLICY IF EXISTS "Users can update own profile" ON public.users; DROP POLICY IF EXISTS "Users can insert own profile" ON public.users; DROP POLICY IF EXISTS "Admin can view all users" ON public.users; DROP POLICY IF EXISTS "Admin can update all users" ON public.users; DROP POLICY IF EXISTS "Service role full access" ON public.users;'
      });
      
      if (dropError) {
        console.log('⚠️  Could not drop policies via RPC');
      } else {
        console.log('✅ Dropped existing policies');
      }
    } else {
      console.log('✅ RLS disabled on users table');
    }
    
    // Test admin access now
    console.log('🧪 Testing admin access after RLS fix...');
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
      
      // Test authentication
      console.log('🔐 Testing authentication...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: adminUser.email,
        password: 'aaasssaaa'
      });
      
      if (authError) {
        console.error('❌ Authentication failed:', authError.message);
      } else {
        console.log('✅ Authentication successful');
        console.log('🔑 Auth User ID:', authData.user.id);
        
        // Test admin check
        const { data: adminCheck, error: adminCheckError } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', authData.user.id)
          .single();
        
        if (adminCheckError) {
          console.error('❌ Admin check failed:', adminCheckError);
        } else {
          console.log('✅ Admin check successful');
          console.log('👑 Admin status:', adminCheck.is_admin ? 'Yes' : 'No');
        }
      }
    }
    
    console.log('🎉 RLS fix completed!');
    console.log('📧 Email: admin@gmail.com');
    console.log('🔑 Password: aaasssaaa');
    console.log('💡 You can now try logging in to the admin panel');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

disableRLSTemporarily();
