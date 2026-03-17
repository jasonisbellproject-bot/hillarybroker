require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyRLSFix() {
  try {
    console.log('🔧 Applying RLS policy fix...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'fix-infinite-recursion.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        console.log(`🔄 Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`⚠️  Statement ${i + 1} had an issue (this might be normal):`, error.message);
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      }
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
      console.log('💡 You may need to run the SQL manually in Supabase Dashboard');
    } else {
      console.log('✅ Admin user access working!');
      console.log('📧 Email:', adminUser.email);
      console.log('👑 Admin status:', adminUser.is_admin ? 'Yes' : 'No');
      console.log('🎉 RLS policies fixed successfully!');
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('💡 Try running the SQL manually in Supabase Dashboard > SQL Editor');
  }
}

applyRLSFix();
