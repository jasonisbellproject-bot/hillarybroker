const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function testKYCTable() {
  try {
    console.log('🔍 Testing KYC table...')
    
    // Test if table exists
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ KYC table error:', error.message)
      console.log('📝 Error code:', error.code)
      
      if (error.code === '42P01') {
        console.log('📋 Table does not exist. Creating it...')
        
        // Create the table
        const createTableSQL = `
          CREATE TABLE IF NOT EXISTS kyc_documents (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
            document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('passport', 'drivers_license', 'national_id')),
            document_url TEXT NOT NULL,
            status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
            admin_notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
        
        const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
        
        if (createError) {
          console.log('❌ Failed to create table:', createError.message)
          console.log('💡 You may need to run the SQL manually in Supabase dashboard')
        } else {
          console.log('✅ KYC table created successfully')
        }
      }
    } else {
      console.log('✅ KYC table exists and is accessible')
      console.log('📊 Found', data?.length || 0, 'documents')
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testKYCTable() 