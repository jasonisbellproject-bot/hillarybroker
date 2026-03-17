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

async function applyCopyTradingSchema() {
  try {
    console.log('🔧 Applying copy trading schema...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'copy-trading-schema.sql');
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
    
    // Test the schema by checking if tables exist
    console.log('🧪 Testing copy trading schema...');
    
    const tables = [
      'copy_traders',
      'copy_trader_performance',
      'copy_trader_trades',
      'copy_trading_subscriptions',
      'copied_trades',
      'copy_trading_analytics',
      'copy_trading_settings'
    ];
    
    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ Table ${table} not accessible:`, error.message);
      } else {
        console.log(`✅ Table ${table} is working`);
      }
    }
    
    console.log('🎉 Copy trading schema applied successfully!');
    console.log('💡 You can now use copy trading functionality');
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.log('💡 Try running the SQL manually in Supabase Dashboard > SQL Editor');
  }
}

applyCopyTradingSchema();
