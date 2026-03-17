const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupKYCTable() {
  try {
    console.log('🔍 Setting up KYC table...')
    
    // Create the KYC documents table
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
      console.log('❌ Failed to create table via RPC:', createError.message)
      console.log('💡 You may need to run the SQL manually in Supabase dashboard')
      console.log('📋 SQL to run:')
      console.log(createTableSQL)
    } else {
      console.log('✅ KYC table created successfully')
    }
    
    // Test if table exists
    const { data, error } = await supabase
      .from('kyc_documents')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ Table test failed:', error.message)
    } else {
      console.log('✅ KYC table is accessible')
      console.log('📊 Found', data?.length || 0, 'documents')
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupKYCTable() 